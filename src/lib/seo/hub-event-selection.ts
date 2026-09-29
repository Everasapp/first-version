import type { EventCardData } from "@/src/components/home/EventCard";
import { parseEventScheduleMode } from "@/src/lib/eventScheduleMode";
import { eventOverlapsRange } from "@/src/lib/seo/landing-copy";

/** SSR card caps for `/eventi-sardegna` curated sections. */
export const HUB_SECTION_LIMITS = {
  oggi: 6,
  weekend: 9,
  sagre: 6,
  concerti: 6,
  gratuiti: 6,
  prossimi: 6,
} as const;

export type HubSectionId = keyof typeof HUB_SECTION_LIMITS;

export const HUB_MAX_SSR_CARDS = Object.values(HUB_SECTION_LIMITS).reduce(
  (sum, n) => sum + n,
  0,
);

export const HUB_SECTION_CTAS: Record<
  HubSectionId,
  { href: string; label: string }
> = {
  oggi: {
    href: "/eventi-oggi",
    label: "Vedi tutti gli eventi di oggi",
  },
  weekend: {
    href: "/eventi-weekend",
    label: "Vedi tutti gli eventi del weekend",
  },
  sagre: {
    href: "/eventi-sardegna/sagre",
    label: "Vedi tutte le sagre",
  },
  concerti: {
    href: "/eventi/musica-concerti",
    label: "Vedi tutti i concerti e spettacoli",
  },
  gratuiti: {
    href: "/eventi-gratuiti",
    label: "Vedi tutti gli eventi gratuiti",
  },
  prossimi: {
    href: "/eventi",
    label: "Vedi tutti gli eventi",
  },
};

export const HUB_SECTION_TITLES: Record<HubSectionId, string> = {
  oggi: "Eventi di oggi in Sardegna",
  weekend: "Eventi del weekend",
  sagre: "Sagre e feste tradizionali",
  concerti: "Concerti e spettacoli",
  gratuiti: "Eventi gratuiti",
  prossimi: "Altri prossimi eventi",
};

export type HubCuratedSection = {
  id: HubSectionId;
  title: string;
  events: EventCardData[];
  cta: { href: string; label: string };
  /** High-priority card images for this section only. */
  priorityImageCount: number;
};

export type HubEventSelection = {
  sections: HubCuratedSection[];
  /** Flattened SSR cards in display order (ItemList source of truth). */
  ssrCards: EventCardData[];
  /** Identifiers claimed during selection (`eventId` and/or slug). */
  usedIdentities: string[];
};

export type SameTitleDistinctPair = {
  title: string;
  a: { eventId: string; slug: string };
  b: { eventId: string; slug: string };
};

function eventStartMs(event: Pick<EventCardData, "startDate">): number {
  const value = new Date(event.startDate).getTime();
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

/** Deterministic hub ordering: start → title → slug. */
export function compareHubEvents(
  a: EventCardData,
  b: EventCardData,
): number {
  const byStart = eventStartMs(a) - eventStartMs(b);
  if (byStart !== 0) return byStart;
  const byTitle = a.title.localeCompare(b.title, "it");
  if (byTitle !== 0) return byTitle;
  return a.id.localeCompare(b.id, "it");
}

export function sortHubEvents(
  events: readonly EventCardData[],
): EventCardData[] {
  return [...events].sort(compareHubEvents);
}

export function hubEventIdentityKeys(
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
  return hubEventIdentityKeys(event).some((key) => used.has(key));
}

function claim(
  event: Pick<EventCardData, "eventId" | "id">,
  used: Set<string>,
) {
  for (const key of hubEventIdentityKeys(event)) {
    used.add(key);
  }
}

function isHubContainer(
  event: Pick<EventCardData, "scheduleMode">,
): boolean {
  return parseEventScheduleMode(event.scheduleMode) === "container";
}

function takeForSection(
  candidates: readonly EventCardData[],
  limit: number,
  used: Set<string>,
): EventCardData[] {
  const selected: EventCardData[] = [];
  for (const event of candidates) {
    if (selected.length >= limit) break;
    if (isHubContainer(event)) continue;
    if (isClaimed(event, used)) continue;
    selected.push(event);
    claim(event, used);
  }
  return selected;
}

export type SelectEventiSardegnaHubCardsInput = {
  events: readonly EventCardData[];
  todayRange: { start: Date; end: Date };
  weekendRange: { start: Date; end: Date };
  isSagre: (event: EventCardData) => boolean;
  isConcerti: (event: EventCardData) => boolean;
};

/**
 * Builds capped, globally-deduped SSR sections for `/eventi-sardegna`.
 * Does not mutate the input array or its items.
 */
export function selectEventiSardegnaHubCards(
  input: SelectEventiSardegnaHubCardsInput,
): HubEventSelection {
  const sorted = sortHubEvents(input.events);
  const used = new Set<string>();

  const todayPool = sorted.filter((event) =>
    eventOverlapsRange(event, input.todayRange, "daily"),
  );
  const today = takeForSection(todayPool, HUB_SECTION_LIMITS.oggi, used);

  const weekendPool = sorted.filter(
    (event) =>
      eventOverlapsRange(event, input.weekendRange, "weekend") &&
      !isClaimed(event, used),
  );
  const weekend = takeForSection(
    weekendPool,
    HUB_SECTION_LIMITS.weekend,
    used,
  );

  const remaining = sorted.filter((event) => !isClaimed(event, used));

  const sagre = takeForSection(
    remaining.filter(input.isSagre),
    HUB_SECTION_LIMITS.sagre,
    used,
  );
  const concerti = takeForSection(
    remaining.filter(
      (event) => input.isConcerti(event) && !isClaimed(event, used),
    ),
    HUB_SECTION_LIMITS.concerti,
    used,
  );
  const gratuiti = takeForSection(
    remaining.filter((event) => event.isFree && !isClaimed(event, used)),
    HUB_SECTION_LIMITS.gratuiti,
    used,
  );
  const prossimi = takeForSection(
    remaining.filter((event) => !isClaimed(event, used)),
    HUB_SECTION_LIMITS.prossimi,
    used,
  );

  const byId: Array<{ id: HubSectionId; events: EventCardData[] }> = [
    { id: "oggi", events: today },
    { id: "weekend", events: weekend },
    { id: "sagre", events: sagre },
    { id: "concerti", events: concerti },
    { id: "gratuiti", events: gratuiti },
    { id: "prossimi", events: prossimi },
  ];

  const sections: HubCuratedSection[] = byId
    .filter((row) => row.events.length > 0)
    .map((row) => ({
      id: row.id,
      title: HUB_SECTION_TITLES[row.id],
      events: row.events,
      cta: HUB_SECTION_CTAS[row.id],
      // Hub cover owns the only high-priority image; card images stay lazy.
      priorityImageCount: 0,
    }));

  const ssrCards = sections.flatMap((section) => section.events);

  return {
    sections,
    ssrCards,
    usedIdentities: [...used],
  };
}

/** Report-only: same title, different id/slug — not auto-removed. */
export function findSameTitleDistinctEvents(
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
