import type { SupabaseClient } from "@supabase/supabase-js";

import { cities } from "@/src/data/cities";
import {
  draftToEditable,
  type ListingEventCandidate,
} from "@/src/lib/admin/event-import";
import { extractEventFromUrl } from "@/src/lib/admin/event-page-extractor";
import { normalizeEventCategories } from "@/src/lib/event-categories";
import { normalizeEventDescription } from "@/src/lib/sanitizeHtml";
import { createSlug } from "@/src/lib/slug";

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
      if (row.source_url) urls.add(row.source_url as string);
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return urls;
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
      image_url: editable.imageUrl.trim() || null,
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

async function collectCandidates(existingUrls: Set<string>) {
  const seen = new Set<string>();
  const candidates: Array<ListingEventCandidate & { listingLabel: string }> = [];

  for (const source of LISTING_SOURCES) {
    const result = await extractEventFromUrl(source.url);
    if (!result.listing?.candidates.length) continue;

    for (const item of result.listing.candidates) {
      if (existingUrls.has(item.url) || seen.has(item.url)) continue;
      if (!isUpcoming(item.startAt)) continue;
      seen.add(item.url);
      candidates.push({ ...item, listingLabel: source.label });
    }
    await sleep(300);
  }

  candidates.sort((a, b) => {
    const aTime = a.startAt ? new Date(a.startAt).getTime() : 9e15;
    const bTime = b.startAt ? new Date(b.startAt).getTime() : 9e15;
    return aTime - bTime;
  });

  return candidates;
}

export async function discoverAndImportEventDrafts({
  supabase,
  adminUserId,
  limit = 20,
  publish = false,
}: {
  supabase: SupabaseClient;
  adminUserId: string;
  limit?: number;
  publish?: boolean;
}) {
  const existingUrls = await loadExistingSourceUrls(supabase);
  const candidates = await collectCandidates(existingUrls);
  const batch = candidates.slice(0, Math.max(1, limit));

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

  for (const candidate of batch) {
    try {
      const extracted = await extractEventFromUrl(candidate.url);
      if (!extracted.ok || !extracted.draft) {
        skipped.push({
          title: candidate.title,
          url: candidate.url,
          reason: extracted.error || "analisi fallita",
        });
        continue;
      }

      const editable = draftToEditable(extracted.draft);
      if (!editable.startDate.trim() && candidate.startAt) {
        editable.startDate = candidate.startAt.slice(0, 10);
      }

      if (
        !editable.title.trim() ||
        !editable.municipality.trim() ||
        !editable.startDate.trim()
      ) {
        skipped.push({
          title: candidate.title,
          url: candidate.url,
          reason: "titolo, comune o data mancanti",
        });
        continue;
      }

      const row = await importDraft(supabase, adminUserId, editable, publish);
      imported.push({
        id: row.id as string,
        slug: row.slug as string,
        title: row.title as string,
        municipality: row.municipality as string,
        start_at: row.start_at as string,
        source_url: candidate.url,
      });
    } catch (error) {
      errors.push({
        title: candidate.title,
        url: candidate.url,
        error: error instanceof Error ? error.message : "import fallito",
      });
    }
    await sleep(250);
  }

  return {
    discoveredNew: candidates.length,
    processed: batch.length,
    importedCount: imported.length,
    skippedCount: skipped.length,
    errorCount: errors.length,
    imported,
    skipped: skipped.slice(0, 30),
    errors: errors.slice(0, 20),
  };
}
