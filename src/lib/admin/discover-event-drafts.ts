import type { SupabaseClient } from "@supabase/supabase-js";

import { cities } from "@/src/data/cities";
import {
  draftToEditable,
  type ListingEventCandidate,
} from "@/src/lib/admin/event-import";
import { extractEventFromUrl } from "@/src/lib/admin/event-page-extractor";
import {
  classifyImportError,
  finishImportRun,
  startImportRun,
  type ImportRunStatus,
  type ImportTriggeredBy,
} from "@/src/lib/cron/import-runs";
import { normalizeEventCategories } from "@/src/lib/event-categories";
import { optimizeImageToWebp } from "@/src/lib/images/optimizeToWebp";
import {
  normalizeEventDescription,
  stripHtml,
} from "@/src/lib/sanitizeHtml";
import { createSlug } from "@/src/lib/slug";

const MAX_SOURCE_RETRIES = 2;
const SOURCE_RETRY_BACKOFF_MS = [1000, 4000] as const;

const LISTING_SOURCES: Array<{ url: string; label: string }> = [
  { url: "https://www.sassaritoday.it/eventi/", label: "SassariToday" },
  { url: "https://www.cagliaritoday.it/eventi/", label: "CagliariToday" },
  {
    url: "https://www.comune.santateresagallura.ss.it/it/eventi",
    label: "Comune di Santa Teresa Gallura",
  },
  {
    url: "https://www.sardegnaturismo.it/it/eventi",
    label: "SardegnaTurismo",
  },
  {
    url: "https://sardegnaeventi24.it/eventi-in-sardegna/",
    label: "SardegnaEventi24",
  },
  {
    url: "https://saludetrigu.it/",
    label: "Salude & Trigu",
  },
  {
    url: "https://turismosassari.it/calendario-eventi",
    label: "Turismo Sassari",
  },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildStartAt(date: string, time: string) {
  const t = time && /^\d{2}:\d{2}$/.test(time) ? time : "00:00";
  const month = Number(date.slice(5, 7));
  const offset = month >= 4 && month <= 10 ? "+02:00" : "+01:00";
  return `${date}T${t}:00${offset}`;
}

function isUpcoming(startAt: string | null) {
  if (!startAt) return true;
  const parsed = new Date(startAt);
  if (Number.isNaN(parsed.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed >= today;
}

const MIN_DESCRIPTION_CHARS = 280;

function hasUsableImage(imageUrl: string) {
  const url = imageUrl.trim();
  if (!/^https?:\/\//i.test(url)) return false;
  if (/\.(svg|ico)(\?|$)/i.test(url)) return false;
  if (/logo|placeholder|sprite|default[-_]?img/i.test(url)) return false;
  return true;
}

function hasCompleteDescription(description: string) {
  const text = stripHtml(description).trim();
  if (text.length < MIN_DESCRIPTION_CHARS) return false;
  if (/\.\.\.$|…$/.test(text) && text.length < 600) return false;
  return true;
}

function missingMediaReason(editable: ReturnType<typeof draftToEditable>) {
  if (!hasUsableImage(editable.imageUrl)) return "immagine mancante";
  if (!hasCompleteDescription(editable.description)) {
    return "descrizione incompleta";
  }
  return null;
}

async function downloadAndStoreEventImage(
  supabase: SupabaseClient,
  adminUserId: string,
  title: string,
  imageUrl: string,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: `${new URL(imageUrl).origin}/`,
      },
    });
    if (!response.ok) {
      throw new Error(`Download immagine fallito (${response.status})`);
    }
    const webp = await optimizeImageToWebp(
      Buffer.from(await response.arrayBuffer()),
    );
    const path = `imports/${adminUserId}/${createSlug(title) || "evento"}-${Date.now()}.webp`;
    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(path, webp, {
        contentType: "image/webp",
        upsert: false,
      });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from("event-images").getPublicUrl(path);
    if (!data.publicUrl) throw new Error("URL pubblico immagine mancante");
    return data.publicUrl;
  } finally {
    clearTimeout(timer);
  }
}

function normalizeSourceUrl(url: string) {
  return url.trim().replace(/\/+$/, "").toLowerCase();
}

async function loadExistingSourceUrls(supabase: SupabaseClient) {
  const urls = new Set<string>();
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("events")
      .select("source_url")
      .not("source_url", "is", null)
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    if (!data?.length) break;

    for (const row of data) {
      if (row.source_url) urls.add(normalizeSourceUrl(row.source_url as string));
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return urls;
}

type ExistingEventRow = {
  title: string;
  municipality: string;
  start_at: string;
  end_at: string | null;
};

function titleTokens(title: string) {
  const stop = new Set([
    "sassari",
    "evento",
    "eventi",
    "mostra",
    "festival",
    "edizione",
    "concerto",
    "spettacolo",
    "della",
    "delle",
    "nella",
  ]);
  return createSlug(title)
    .split("-")
    .filter((token) => token.length > 3 && !stop.has(token));
}

function titleCoreSlug(title: string) {
  return createSlug(title)
    .replace(/-\d{4}$/, "")
    .replace(/-festival-.*$/, "")
    .replace(/-\d+-edizione.*$/, "")
    .replace(/-edizione-.*$/, "");
}

function titlesLookAlike(left: string, right: string) {
  const a = titleCoreSlug(left);
  const b = titleCoreSlug(right);
  if (!a || !b) return false;
  if (a === b) return true;
  if ((a.includes(b) || b.includes(a)) && Math.min(a.length, b.length) >= 12) {
    return true;
  }
  const ta = titleTokens(left);
  const tb = titleTokens(right);
  if (ta.length === 0 || tb.length === 0) return false;
  const smaller = Math.min(ta.length, tb.length);
  const inter = ta.filter((token) => tb.includes(token)).length;
  const dice = (2 * inter) / (ta.length + tb.length);
  return dice >= 0.5 && inter >= Math.min(2, smaller);
}

function datesOverlap(
  startA: string,
  endA: string | null,
  startB: string,
  endB: string | null,
) {
  const a0 = new Date(startA).getTime();
  const a1 = new Date(endA || startA).getTime();
  const b0 = new Date(startB).getTime();
  const b1 = new Date(endB || startB).getTime();
  if (![a0, a1, b0, b1].every(Number.isFinite)) return false;
  return a0 <= b1 && b0 <= a1;
}

async function loadExistingUpcomingEvents(supabase: SupabaseClient) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fromDate = new Date(today);
  fromDate.setDate(fromDate.getDate() - 40);
  const { data, error } = await supabase
    .from("events")
    .select("title, municipality, start_at, end_at")
    .in("status", ["published", "pending"])
    .or(
      `end_at.gte.${today.toISOString()},start_at.gte.${fromDate.toISOString()}`,
    )
    .limit(3000);

  if (error) throw new Error(error.message);
  return (data || []) as ExistingEventRow[];
}

function isDuplicateOfExisting(
  existing: ExistingEventRow[],
  title: string,
  municipality: string,
  startDate: string,
  endDate: string,
) {
  const city = municipality.trim().toLocaleLowerCase("it");
  const startIso = `${startDate}T00:00:00`;
  const endIso = endDate ? `${endDate}T23:59:59` : startIso;
  return existing.some((row) => {
    if (row.municipality.trim().toLocaleLowerCase("it") !== city) return false;
    if (!titlesLookAlike(title, row.title)) return false;
    return datesOverlap(startIso, endIso, row.start_at, row.end_at);
  });
}

async function findOrganizerDirectoryId(
  supabase: SupabaseClient,
  organizerName: string,
  sourceUrl: string,
) {
  const trimmed = organizerName.trim();
  if (trimmed) {
    const { data } = await supabase
      .from("organizer_directory")
      .select("id")
      .ilike("name", `%${trimmed}%`)
      .limit(1)
      .maybeSingle();
    if (data?.id) return data.id as string;
  }

  try {
    const host = new URL(sourceUrl).hostname.replace(/^www\./, "");
    const { data } = await supabase
      .from("organizer_directory")
      .select("id")
      .ilike("website", `%${host}%`)
      .limit(1)
      .maybeSingle();
    if (data?.id) return data.id as string;
  } catch {
    // ignore
  }

  return null;
}

async function importDraft(
  supabase: SupabaseClient,
  adminUserId: string,
  editable: ReturnType<typeof draftToEditable>,
  publish: boolean,
) {
  const title = editable.title.trim();
  const municipality = editable.municipality.trim();
  const startDate = editable.startDate.trim();

  const cityRecord =
    cities.find((c) => c.city.toLowerCase() === municipality.toLowerCase()) ||
    null;
  const province = editable.province.trim() || cityRecord?.province || "";
  if (!province) {
    throw new Error(`Provincia mancante per ${municipality}`);
  }

  const organizerDirectoryId = await findOrganizerDirectoryId(
    supabase,
    editable.organizerName,
    editable.sourceUrl,
  );

  const startAt = buildStartAt(startDate, editable.startTime.trim());
  let endAt: string | null = null;
  if (editable.endDate.trim()) {
    endAt = buildStartAt(
      editable.endDate.trim(),
      editable.endTime.trim() || "23:59",
    );
  } else if (editable.endTime.trim() && editable.startTime.trim()) {
    endAt = buildStartAt(startDate, editable.endTime.trim());
  }

  const numericPrice = editable.isFree
    ? null
    : Number.parseFloat(editable.priceFrom.replace(",", "."));

  const categorySlugs = normalizeEventCategories(
    editable.categories?.length
      ? editable.categories
      : editable.category
        ? [editable.category]
        : ["musica-concerti"],
  );
  const primaryCategory = categorySlugs[0] || "musica-concerti";
  const nowIso = new Date().toISOString();
  const uniqueSlug = `${createSlug(title) || "evento"}-${Date.now().toString(36)}`;
  const storedImageUrl = await downloadAndStoreEventImage(
    supabase,
    adminUserId,
    title,
    editable.imageUrl.trim(),
  );

  const { data, error } = await supabase
    .from("events")
    .insert({
      organizer_id: adminUserId,
      created_by: adminUserId,
      title,
      slug: uniqueSlug,
      description: normalizeEventDescription(editable.description) || null,
      category: primaryCategory,
      categories: categorySlugs,
      subcategory: editable.subcategory.trim() || null,
      province,
      municipality,
      location_name: editable.locationName.trim() || null,
      address: editable.address.trim() || editable.locationName.trim() || null,
      start_at: startAt,
      end_at: endAt,
      image_url: storedImageUrl,
      is_free: editable.isFree,
      price_from: Number.isFinite(numericPrice as number) ? numericPrice : null,
      price: Number.isFinite(numericPrice as number) ? numericPrice : 0,
      ticket_url: editable.ticketUrl.trim() || null,
      organizer_display_name: editable.organizerName.trim() || null,
      organizer_directory_id: organizerDirectoryId,
      source_url: editable.sourceUrl.trim() || null,
      source_name: editable.sourceName.trim() || null,
      imported_at: nowIso,
      imported_by: adminUserId,
      import_method: "url",
      verification_status: publish ? "verified" : "pending_verification",
      last_verified_at: publish ? nowIso : null,
      status: publish ? "published" : "pending",
      is_featured: false,
    })
    .select("id, slug, title, municipality, start_at")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("event_import_logs").insert({
    admin_id: adminUserId,
    event_id: data.id,
    organizer_directory_id: organizerDirectoryId,
    source_url: editable.sourceUrl,
    source_name: editable.sourceName,
    import_method: "url",
    status: "success",
    payload: {
      title,
      municipality,
      publish,
      autoDiscovery: true,
      autoPublish: publish,
    },
  });

  return data;
}

type ListingCandidate = ListingEventCandidate & { listingLabel: string };

export type SourceRunResult = {
  source: string;
  status: ImportRunStatus;
  eventsFound: number;
  eventsParsed: number;
  eventsCreated: number;
  duplicates: number;
  skipped: number;
  errors: number;
  durationMs: number;
  retryCount: number;
  errorMessage: string | null;
  httpStatus: number | null;
  lastErrorCode: string | null;
};

function isRetryableSourceError(code: string) {
  return (
    code === "timeout" ||
    code === "network" ||
    code === "http_403" ||
    code === "http_429" ||
    code === "http_5xx" ||
    code === "unknown" ||
    code.startsWith("http_5")
  );
}

async function fetchListingCandidates(
  source: { url: string; label: string },
  existingUrls: Set<string>,
) {
  const result = await extractEventFromUrl(source.url);
  if (!result.listing?.candidates.length) {
    if (!result.ok) {
      throw new Error(result.error || "listing non disponibile");
    }
    return [] as ListingCandidate[];
  }

  const candidates: ListingCandidate[] = [];
  const seen = new Set<string>();
  for (const item of result.listing.candidates) {
    const urlKey = normalizeSourceUrl(item.url);
    if (existingUrls.has(urlKey) || seen.has(urlKey)) continue;
    if (!isUpcoming(item.startAt)) continue;
    seen.add(urlKey);
    candidates.push({ ...item, listingLabel: source.label });
  }
  candidates.sort((a, b) => {
    const aTime = a.startAt ? new Date(a.startAt).getTime() : 9e15;
    const bTime = b.startAt ? new Date(b.startAt).getTime() : 9e15;
    return aTime - bTime;
  });
  return candidates;
}

async function importOneCandidate(
  supabase: SupabaseClient,
  adminUserId: string,
  candidate: ListingCandidate,
  existingEvents: ExistingEventRow[],
  publish: boolean,
): Promise<
  | { kind: "created"; row: ExistingEventRow & { id: string; slug: string; source_url: string } }
  | { kind: "duplicate" }
  | { kind: "skipped"; reason: string }
  | { kind: "error"; error: string }
> {
  try {
    const extracted = await extractEventFromUrl(candidate.url);
    if (!extracted.ok || !extracted.draft) {
      return {
        kind: "skipped",
        reason: extracted.error || "analisi fallita",
      };
    }

    const editable = draftToEditable(extracted.draft);
    if (!editable.startDate.trim() && candidate.startAt) {
      editable.startDate = candidate.startAt.slice(0, 10);
    }
    if (candidate.endAt) {
      const listingEnd = candidate.endAt.slice(0, 10);
      if (!editable.endDate.trim() || listingEnd > editable.endDate.trim()) {
        editable.endDate = listingEnd;
      }
    }
    if (!editable.sourceName.trim()) {
      editable.sourceName = candidate.listingLabel;
    }

    if (
      !editable.title.trim() ||
      !editable.municipality.trim() ||
      !editable.startDate.trim()
    ) {
      return { kind: "skipped", reason: "titolo, comune o data mancanti" };
    }

    const mediaReason = missingMediaReason(editable);
    if (mediaReason) {
      return { kind: "skipped", reason: mediaReason };
    }

    if (
      isDuplicateOfExisting(
        existingEvents,
        editable.title,
        editable.municipality,
        editable.startDate,
        editable.endDate,
      )
    ) {
      return { kind: "duplicate" };
    }

    const row = await importDraft(supabase, adminUserId, editable, publish);
    return {
      kind: "created",
      row: {
        id: row.id as string,
        slug: row.slug as string,
        title: row.title as string,
        municipality: row.municipality as string,
        start_at: row.start_at as string,
        end_at: null,
        source_url: candidate.url,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "import fallito";
    if (/immagine/i.test(message)) {
      return { kind: "skipped", reason: "immagine non scaricabile" };
    }
    return { kind: "error", error: message };
  }
}

async function importOneSource({
  supabase,
  adminUserId,
  source,
  existingUrls,
  existingEvents,
  remainingLimit,
  publish,
  batchId,
  triggeredBy,
}: {
  supabase: SupabaseClient;
  adminUserId: string;
  source: { url: string; label: string };
  existingUrls: Set<string>;
  existingEvents: ExistingEventRow[];
  remainingLimit: number;
  publish: boolean;
  batchId: string;
  triggeredBy: ImportTriggeredBy;
}): Promise<{
  metrics: SourceRunResult;
  imported: Array<{
    id: string;
    slug: string;
    title: string;
    municipality: string;
    start_at: string;
    source_url: string;
  }>;
  skipped: Array<{ title: string; url: string; reason: string }>;
  errors: Array<{ title: string; url: string; error: string }>;
}> {
  const startedAt = new Date();
  const runId = await startImportRun({
    supabase,
    batchId,
    source: source.label,
    triggeredBy,
    startedAt,
  });

  let retryCount = 0;
  let lastClassified = classifyImportError("listing non disponibile");

  for (let attempt = 0; attempt <= MAX_SOURCE_RETRIES; attempt += 1) {
    try {
      const candidates = await fetchListingCandidates(source, existingUrls);
      const batch = candidates.slice(0, Math.max(0, remainingLimit));
      const imported: Array<{
        id: string;
        slug: string;
        title: string;
        municipality: string;
        start_at: string;
        source_url: string;
      }> = [];
      const skipped: Array<{ title: string; url: string; reason: string }> = [];
      const errors: Array<{ title: string; url: string; error: string }> = [];
      let duplicates = 0;

      for (const candidate of batch) {
        const outcome = await importOneCandidate(
          supabase,
          adminUserId,
          candidate,
          existingEvents,
          publish,
        );
        if (outcome.kind === "created") {
          imported.push(outcome.row);
          existingUrls.add(normalizeSourceUrl(outcome.row.source_url));
          existingEvents.push({
            title: outcome.row.title,
            municipality: outcome.row.municipality,
            start_at: outcome.row.start_at,
            end_at: outcome.row.end_at,
          });
        } else if (outcome.kind === "duplicate") {
          duplicates += 1;
          skipped.push({
            title: candidate.title,
            url: candidate.url,
            reason: "già presente su Everas",
          });
        } else if (outcome.kind === "skipped") {
          skipped.push({
            title: candidate.title,
            url: candidate.url,
            reason: outcome.reason,
          });
        } else {
          errors.push({
            title: candidate.title,
            url: candidate.url,
            error: outcome.error,
          });
        }
        await sleep(250);
      }

      const status: ImportRunStatus =
        imported.length > 0 && errors.length > 0 ? "partial" : "success";
      const finishedAt = new Date();
      await finishImportRun({
        supabase,
        runId,
        status,
        startedAt,
        eventsFound: candidates.length,
        eventsParsed: batch.length,
        eventsCreated: imported.length,
        duplicates,
        skipped: skipped.length - duplicates,
        errors: errors.length,
        retryCount,
        errorMessage:
          errors[0]?.error || (status === "partial" ? "errori su alcuni eventi" : null),
        httpStatus: null,
        lastErrorCode: errors.length ? "event_import" : null,
      });

      return {
        metrics: {
          source: source.label,
          status,
          eventsFound: candidates.length,
          eventsParsed: batch.length,
          eventsCreated: imported.length,
          duplicates,
          skipped: skipped.length - duplicates,
          errors: errors.length,
          durationMs: Math.max(0, finishedAt.getTime() - startedAt.getTime()),
          retryCount,
          errorMessage: errors[0]?.error || null,
          httpStatus: null,
          lastErrorCode: errors.length ? "event_import" : null,
        },
        imported,
        skipped,
        errors,
      };
    } catch (error) {
      lastClassified = classifyImportError(error);
      if (
        attempt < MAX_SOURCE_RETRIES &&
        isRetryableSourceError(lastClassified.lastErrorCode)
      ) {
        retryCount = attempt + 1;
        await sleep(SOURCE_RETRY_BACKOFF_MS[attempt]);
        continue;
      }

      const finishedAt = new Date();
      await finishImportRun({
        supabase,
        runId,
        status: "error",
        startedAt,
        retryCount,
        errors: 1,
        errorMessage: lastClassified.errorMessage,
        httpStatus: lastClassified.httpStatus,
        lastErrorCode: lastClassified.lastErrorCode,
      });

      return {
        metrics: {
          source: source.label,
          status: "error",
          eventsFound: 0,
          eventsParsed: 0,
          eventsCreated: 0,
          duplicates: 0,
          skipped: 0,
          errors: 1,
          durationMs: Math.max(0, finishedAt.getTime() - startedAt.getTime()),
          retryCount,
          errorMessage: lastClassified.errorMessage,
          httpStatus: lastClassified.httpStatus,
          lastErrorCode: lastClassified.lastErrorCode,
        },
        imported: [],
        skipped: [],
        errors: [
          {
            title: source.label,
            url: source.url,
            error: lastClassified.errorMessage,
          },
        ],
      };
    }
  }

  const finishedAt = new Date();
  await finishImportRun({
    supabase,
    runId,
    status: "error",
    startedAt,
    retryCount: MAX_SOURCE_RETRIES,
    errors: 1,
    errorMessage: lastClassified.errorMessage,
    httpStatus: lastClassified.httpStatus,
    lastErrorCode: lastClassified.lastErrorCode,
  });

  return {
    metrics: {
      source: source.label,
      status: "error",
      eventsFound: 0,
      eventsParsed: 0,
      eventsCreated: 0,
      duplicates: 0,
      skipped: 0,
      errors: 1,
      durationMs: Math.max(0, finishedAt.getTime() - startedAt.getTime()),
      retryCount: MAX_SOURCE_RETRIES,
      errorMessage: lastClassified.errorMessage,
      httpStatus: lastClassified.httpStatus,
      lastErrorCode: lastClassified.lastErrorCode,
    },
    imported: [],
    skipped: [],
    errors: [
      {
        title: source.label,
        url: source.url,
        error: lastClassified.errorMessage,
      },
    ],
  };
}

export async function discoverAndImportEventDrafts({
  supabase,
  adminUserId,
  limit = 20,
  publish = false,
  onlyHost,
  triggeredBy = "cron",
  batchId,
}: {
  supabase: SupabaseClient;
  adminUserId: string;
  limit?: number;
  publish?: boolean;
  onlyHost?: string;
  triggeredBy?: ImportTriggeredBy;
  batchId?: string;
}) {
  const sources = onlyHost
    ? LISTING_SOURCES.filter((source) =>
        source.url.toLowerCase().includes(onlyHost.toLowerCase()),
      )
    : LISTING_SOURCES;
  const existingUrls = await loadExistingSourceUrls(supabase);
  const existingEvents = await loadExistingUpcomingEvents(supabase);
  const resolvedBatchId = batchId || crypto.randomUUID();

  const imported: Array<{
    id: string;
    slug: string;
    title: string;
    municipality: string;
    start_at: string;
    source_url: string;
  }> = [];
  const skipped: Array<{ title: string; url: string; reason: string }> = [];
  const errors: Array<{ title: string; url: string; error: string }> = [];
  const sourceResults: SourceRunResult[] = [];
  let remainingLimit = Math.max(0, limit);
  let discoveredNew = 0;
  let processed = 0;

  for (const source of sources) {
    try {
      const result = await importOneSource({
        supabase,
        adminUserId,
        source,
        existingUrls,
        existingEvents,
        remainingLimit,
        publish,
        batchId: resolvedBatchId,
        triggeredBy,
      });
      sourceResults.push(result.metrics);
      discoveredNew += result.metrics.eventsFound;
      processed += result.metrics.eventsParsed;
      remainingLimit = Math.max(0, remainingLimit - result.metrics.eventsParsed);
      imported.push(...result.imported);
      skipped.push(...result.skipped);
      errors.push(...result.errors);
    } catch (error) {
      const classified = classifyImportError(error);
      sourceResults.push({
        source: source.label,
        status: "error",
        eventsFound: 0,
        eventsParsed: 0,
        eventsCreated: 0,
        duplicates: 0,
        skipped: 0,
        errors: 1,
        durationMs: 0,
        retryCount: 0,
        errorMessage: classified.errorMessage,
        httpStatus: classified.httpStatus,
        lastErrorCode: classified.lastErrorCode,
      });
      errors.push({
        title: source.label,
        url: source.url,
        error: classified.errorMessage,
      });
    }
    await sleep(300);
  }

  return {
    batchId: resolvedBatchId,
    triggeredBy,
    sourceResults,
    discoveredNew,
    processed,
    importedCount: imported.length,
    skippedCount: skipped.length,
    errorCount: errors.length,
    imported,
    skipped: skipped.slice(0, 30),
    errors: errors.slice(0, 20),
  };
}
