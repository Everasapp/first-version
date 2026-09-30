import type { EventCardData } from "@/src/components/home/EventCard";

/** SSR-visible cards per homepage section (Hot / Nord / Centro / Sud). */
export const HOMEPAGE_SSR_CARDS_PER_SECTION = 6;

/** Max events passed to each homepage carousel component. */
export const HOMEPAGE_MAX_EVENTS_PER_SECTION = 12;

/** Max unique events across all four homepage carousels. */
export const HOMEPAGE_MAX_TOTAL_EVENTS =
  HOMEPAGE_MAX_EVENTS_PER_SECTION * 4;

export const HOMEPAGE_AREAS = [
  "Nord Sardegna",
  "Centro Sardegna",
  "Sud Sardegna",
] as const;

export type HomepageArea = (typeof HOMEPAGE_AREAS)[number];

export type HomepageEventSections = {
  hot: EventCardData[];
  north: EventCardData[];
  center: EventCardData[];
  south: EventCardData[];
  /**
   * Real area inventory counts (before carousel cap / global claim).
   * Scalars only — never send the full catalog to the client.
   */
  northTotalCount: number;
  centerTotalCount: number;
  southTotalCount: number;
  /** Flattened first-6 SSR cards: Hot → Nord → Centro → Sud. */
  ssrCards: EventCardData[];
  /** Claimed identity keys (`id:…` / `slug:…`) for diagnostics. */
  usedIdentities: string[];
};

export type SameTitleDistinctPair = {
  title: string;
  a: { eventId: string; slug: string };
  b: { eventId: string; slug: string };
};

export function homepageEventIdentityKeys(
  event: Pick<EventCardData, "eventId" | "id">,
): string[] {
  const keys: string[] = [];
  const eventId = event.eventId?.trim();
  const slug = event.id?.trim();
  if (eventId) keys.push(`id:${eventId}`);
  if (slug) keys.push(`slug:${slug}`);
  return keys;
}

function isClaimed(
  event: Pick<EventCardData, "eventId" | "id">,
  used: Set<string>,
): boolean {
  return homepageEventIdentityKeys(event).some((key) => used.has(key));
}

function claim(
  event: Pick<EventCardData, "eventId" | "id">,
  used: Set<string>,
) {
  for (const key of homepageEventIdentityKeys(event)) {
    used.add(key);
  }
}

/**
 * Same ordering as the previous AreaSection client sort:
 * newest `createdAt` first, then sooner `startDate`.
 */
export function sortHomepageAreaEvents(
  events: readonly EventCardData[],
): EventCardData[] {
  return [...events].sort((a, b) => {
    const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (aCreated !== bCreated) return bCreated - aCreated;
    const aStart = a.startDate ? new Date(a.startDate).getTime() : 0;
    const bStart = b.startDate ? new Date(b.startDate).getTime() : 0;
    return aStart - bStart;
  });
}

function takeUnique(
  candidates: readonly EventCardData[],
  limit: number,
  used: Set<string>,
): EventCardData[] {
  const selected: EventCardData[] = [];
  for (const event of candidates) {
    if (selected.length >= limit) break;
    if (isClaimed(event, used)) continue;
    selected.push(event);
    claim(event, used);
  }
  return selected;
}

export type SelectHomepageEventSectionsInput = {
  /**
   * Already ordered “Hot this week” candidates
   * (created_at → status → featured → start_at).
   */
  hotCandidates: readonly EventCardData[];
  /** Active public events for area carousels (any order; filtered/sorted here). */
  allEvents: readonly EventCardData[];
  ssrPerSection?: number;
  maxPerSection?: number;
};

/**
 * Caps and globally dedupes homepage carousel payloads.
 * Priority: Hot → Nord → Centro → Sud. Does not mutate inputs.
 */
export function selectHomepageEventSections(
  input: SelectHomepageEventSectionsInput,
): HomepageEventSections {
  const ssrPerSection =
    input.ssrPerSection ?? HOMEPAGE_SSR_CARDS_PER_SECTION;
  const maxPerSection =
    input.maxPerSection ?? HOMEPAGE_MAX_EVENTS_PER_SECTION;
  const used = new Set<string>();

  const hot = takeUnique(input.hotCandidates, maxPerSection, used);

  const northAll = input.allEvents.filter(
    (event) => event.area === "Nord Sardegna",
  );
  const centerAll = input.allEvents.filter(
    (event) => event.area === "Centro Sardegna",
  );
  const southAll = input.allEvents.filter(
    (event) => event.area === "Sud Sardegna",
  );

  const north = takeUnique(
    sortHomepageAreaEvents(northAll),
    maxPerSection,
    used,
  );
  const center = takeUnique(
    sortHomepageAreaEvents(centerAll),
    maxPerSection,
    used,
  );
  const south = takeUnique(
    sortHomepageAreaEvents(southAll),
    maxPerSection,
    used,
  );

  const ssrCards = [
    ...hot.slice(0, ssrPerSection),
    ...north.slice(0, ssrPerSection),
    ...center.slice(0, ssrPerSection),
    ...south.slice(0, ssrPerSection),
  ];

  return {
    hot,
    north,
    center,
    south,
    northTotalCount: northAll.length,
    centerTotalCount: centerAll.length,
    southTotalCount: southAll.length,
    ssrCards,
    usedIdentities: [...used],
  };
}

/** Report-only: same title, different id/slug — not auto-removed. */
export function findSameTitleDistinctHomepageEvents(
  events: readonly EventCardData[],
): SameTitleDistinctPair[] {
  const byTitle = new Map<string, EventCardData[]>();
  for (const event of events) {
    const key = event.title.trim().toLocaleLowerCase("it");
    const list = byTitle.get(key) ?? [];
    list.push(event);
    byTitle.set(key, list);
  }

  const pairs: SameTitleDistinctPair[] = [];
  for (const group of byTitle.values()) {
    if (group.length < 2) continue;
    for (let i = 0; i < group.length; i += 1) {
      for (let j = i + 1; j < group.length; j += 1) {
        const a = group[i];
        const b = group[j];
        if (a.eventId === b.eventId && a.id === b.id) continue;
        pairs.push({
          title: a.title,
          a: { eventId: a.eventId, slug: a.id },
          b: { eventId: b.eventId, slug: b.id },
        });
      }
    }
  }
  return pairs;
}
