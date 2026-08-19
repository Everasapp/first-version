import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  draftToEditable,
  normalizeTitleKey,
  type DuplicateCandidate,
  type EventListingResult,
  type OrganizerMatch,
} from "@/src/lib/admin/event-import";
import { extractEventFromUrl } from "@/src/lib/admin/event-page-extractor";

export const runtime = "nodejs";
export const maxDuration = 60;

function hostFromUrl(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function organizerSearchNames(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return [];
  const names = [trimmed];
  const withoutYear = trimmed.replace(/\s*20\d{2}\s*$/, "").trim();
  if (withoutYear && withoutYear !== trimmed) names.push(withoutYear);
  return names;
}

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON non valido" }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!url) {
    return NextResponse.json({ error: "URL obbligatorio" }, { status: 400 });
  }

  const extracted = await extractEventFromUrl(url);
  if (extracted.listing) {
    const listing: EventListingResult = extracted.listing;
    const sourceUrls = listing.candidates.map((item) => item.url);
    if (sourceUrls.length > 0) {
      const { data: existingRows } = await auth.supabase
        .from("events")
        .select("id, slug, title, source_url")
        .in("source_url", sourceUrls);

      const byUrl = new Map(
        (existingRows || [])
          .filter((row) => row.source_url)
          .map((row) => [
            row.source_url as string,
            {
              id: row.id as string,
              slug: (row.slug as string | null) ?? null,
              title: row.title as string,
            },
          ]),
      );

      listing.candidates = listing.candidates.map((item) => ({
        ...item,
        existingEvent: byUrl.get(item.url) ?? null,
      }));
    }

    const remaining = listing.candidates.filter(
      (item) => !item.existingEvent,
    ).length;

    return NextResponse.json({
      ok: true,
      listing,
      message: `Trovati ${listing.total} eventi nell’elenco (${remaining} da importare). Seleziona un evento da analizzare.`,
    });
  }

  if (!extracted.ok || !extracted.draft) {
    return NextResponse.json(
      { error: extracted.error || "Analisi non riuscita" },
      { status: 422 },
    );
  }

  const draft = extracted.draft;
  const editable = draftToEditable(draft);

  // Organizer matches
  const organizerMatches: OrganizerMatch[] = [];
  const seenOrganizerIds = new Set<string>();

  function pushDirectoryMatch(row: {
    id: string;
    name: string;
    website: string | null;
  }) {
    if (seenOrganizerIds.has(row.id)) return;
    seenOrganizerIds.add(row.id);
    organizerMatches.push({
      id: row.id,
      name: row.name,
      website: row.website,
      kind: "directory",
    });
  }

  for (const name of organizerSearchNames(editable.organizerName)) {
    const { data: directoryHits } = await auth.supabase
      .from("organizer_directory")
      .select("id, name, website")
      .ilike("name", `%${name}%`)
      .limit(8);

    for (const row of directoryHits || []) {
      pushDirectoryMatch(row);
    }
  }

  const sourceHost =
    hostFromUrl(editable.organizerWebsite) || hostFromUrl(draft.sourceUrl);
  if (sourceHost) {
    const { data: websiteHits } = await auth.supabase
      .from("organizer_directory")
      .select("id, name, website")
      .ilike("website", `%${sourceHost}%`)
      .limit(5);

    for (const row of websiteHits || []) {
      pushDirectoryMatch(row);
    }
  }

  if (editable.organizerName.trim()) {
    const { data: profileHits } = await auth.supabase
      .from("profiles")
      .select("id, business_name, full_name")
      .or(
        `business_name.ilike.%${editable.organizerName.trim()}%,full_name.ilike.%${editable.organizerName.trim()}%`,
      )
      .limit(8);

    for (const row of profileHits || []) {
      organizerMatches.push({
        id: row.id,
        name: row.business_name || row.full_name || "Organizzatore",
        website: null,
        kind: "profile",
      });
    }
  }

  // Exact source_url duplicates
  const { data: bySource } = await auth.supabase
    .from("events")
    .select(
      "id, slug, title, start_at, municipality, source_url, organizer_display_name",
    )
    .eq("source_url", draft.sourceUrl)
    .limit(5);

  const duplicates: DuplicateCandidate[] = [...(bySource || [])];

  // Soft duplicate: same day + similar title + municipality
  if (editable.startDate && editable.title) {
    const dayStart = `${editable.startDate}T00:00:00.000Z`;
    const dayEnd = `${editable.startDate}T23:59:59.999Z`;
    let query = auth.supabase
      .from("events")
      .select(
        "id, slug, title, start_at, municipality, source_url, organizer_display_name",
      )
      .gte("start_at", dayStart)
      .lte("start_at", dayEnd)
      .limit(20);

    if (editable.municipality) {
      query = query.ilike("municipality", editable.municipality);
    }

    const { data: softHits } = await query;
    const titleKey = normalizeTitleKey(editable.title);
    for (const hit of softHits || []) {
      if (duplicates.some((d) => d.id === hit.id)) continue;
      const hitKey = normalizeTitleKey(hit.title || "");
      if (
        hitKey &&
        (hitKey === titleKey ||
          hitKey.includes(titleKey) ||
          titleKey.includes(hitKey))
      ) {
        duplicates.push(hit);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    draft,
    editable,
    organizerMatches,
    duplicates,
    imageRightsNote:
      "Immagine trovata – verifica diritti/utilizzo prima della pubblicazione.",
  });
}
