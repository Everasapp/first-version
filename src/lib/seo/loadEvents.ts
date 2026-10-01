import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/src/lib/supabase/public";

import { cities } from "@/src/data/cities";
import type { EventCardData } from "@/src/components/home/EventCard";
import {
  eventMatchesCategoryFilter,
  resolveCategoryLabels,
} from "@/src/lib/event-categories";
import { formatEventDateRange } from "@/src/lib/formatEventDate";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { resolveEventStatusBadge } from "@/src/lib/eventStatusBadge";
import { isPublicEventActive } from "@/src/lib/eventActive";
import {
  parseEventScheduleMode,
  type EventScheduleMode,
} from "@/src/lib/eventScheduleMode";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import { engagementFromRow } from "@/src/lib/event-engagement";
import { getDateRange, getMonthRange } from "@/src/lib/seo/dateRange";
import {
  eventAppearsInRange,
  temporalContextForDateFilter,
  type EventTemporalContext,
} from "@/src/lib/seo/eventAppearsInRange";

export type PublishedEventRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  categories?: string[] | null;
  province: string | null;
  municipality: string | null;
  location_name: string | null;
  start_at: string;
  end_at: string | null;
  schedule_mode?: string | null;
  image_url: string | null;
  slug: string | null;
  is_free: boolean;
  price_from: number | string | null;
  status: string;
  is_featured: boolean;
  views_count?: number | null;
  favorites_count?: number | null;
  shares_count?: number | null;
};

function getEventArea(municipality: string | null) {
  if (!municipality) return undefined;
  return cities.find(
    (city) =>
      city.city.toLocaleLowerCase("it") ===
      municipality.toLocaleLowerCase("it"),
  )?.area;
}

export function mapPublishedEvent(event: PublishedEventRow): EventCardData {
  const status = resolveEventStatusBadge(event.start_at, event.end_at);
  const pricing = resolveEventPricing(event.is_free, event.price_from);
  const categoryLabels = resolveCategoryLabels(event);
  const scheduleMode = parseEventScheduleMode(event.schedule_mode);

  return {
    id: event.slug || event.id,
    eventId: event.id,
    title: event.title,
    category: categoryLabels[0] ?? "Evento",
    categories: categoryLabels,
    date: formatEventDateRange(event.start_at, event.end_at),
    startDate: event.start_at,
    endDate: event.end_at || undefined,
    scheduleMode,
    location: event.municipality || event.location_name || "Sardegna",
    municipality: event.municipality || undefined,
    area: getEventArea(event.municipality),
    imageUrl: event.image_url || "/images/concert.webp",
    isFree: pricing.isFree,
    priceFrom: pricing.priceFrom,
    isFeatured: event.is_featured,
    happeningNow: status.happeningNow,
    isActiveEvent: status.isActiveEvent,
    statusLabel: status.statusLabel,
    ...engagementFromRow(event),
  };
}

export type EventListFilters = {
  city?: string;
  categorySlug?: string;
  date?: string;
  areaLabel?: string;
  month?: { year: number; monthIndex: number };
  range?: { start: Date; end: Date };
  /** Override inferred context for `range` / undated lists. */
  temporalContext?: EventTemporalContext;
  titleIncludes?: string[];
  /** Solo eventi gratuiti / ingresso libero. */
  freeOnly?: boolean;
  /** Guide festa: tieni l’ultima edizione visibile anche dopo la chiusura. */
  includeExpired?: boolean;
  /** Schede puntuali (articoli Cultura): includi questi slug. */
  slugs?: string[];
};

const PUBLISHED_EVENT_SELECT_BASE = `
        id,
        title,
        description,
        category,
        categories,
        province,
        municipality,
        location_name,
        start_at,
        end_at,
        image_url,
        slug,
        is_free,
        price_from,
        status,
        is_featured,
        views_count,
        favorites_count,
        shares_count
      `;

const PUBLISHED_EVENT_SELECT_WITH_MODE = `
        id,
        title,
        description,
        category,
        categories,
        province,
        municipality,
        location_name,
        start_at,
        end_at,
        schedule_mode,
        image_url,
        slug,
        is_free,
        price_from,
        status,
        is_featured,
        views_count,
        favorites_count,
        shares_count
      `;

function isMissingScheduleModeColumn(message: string | undefined) {
  return Boolean(
    message &&
      /schedule_mode/i.test(message) &&
      /does not exist|schema cache|column/i.test(message),
  );
}

/** PostgREST caps a single response; page until we have every published row. */
async function fetchAllPublishedEventRows(city?: string) {
  const supabase = createPublicClient();
  const pageSize = 1000;
  const rows: PublishedEventRow[] = [];
  let from = 0;
  let select = PUBLISHED_EVENT_SELECT_WITH_MODE;
  let scheduleModeAvailable = true;

  while (true) {
    let query = supabase
      .from("events")
      .select(select as string)
      .eq("status", "published");

    if (city) {
      query = query.ilike("municipality", city);
    }

    const { data, error } = await query
      .order("start_at", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error && scheduleModeAvailable && isMissingScheduleModeColumn(error.message)) {
      // Migration not applied yet: fall back and treat all as `single`.
      select = PUBLISHED_EVENT_SELECT_BASE;
      scheduleModeAvailable = false;
      from = 0;
      rows.length = 0;
      continue;
    }

    if (error) {
      throw new Error(error.message);
    }
    const chunk = (data ?? []) as unknown as PublishedEventRow[];
    rows.push(...chunk);
    if (chunk.length < pageSize) {
      return { rows, error: null };
    }
    from += pageSize;
  }
}

// Public event rows are identical for every visitor. Cache only this anonymous
// dataset, never the user's favorites/session. City remains part of the cache key.
const fetchCachedPublishedEventRows = unstable_cache(
  async (city: string | null) => fetchAllPublishedEventRows(city ?? undefined),
  ["published-event-rows-v2"],
  {
    revalidate: 300,
    tags: ["published-events"],
  },
);

async function loadPublishedEventRows(city?: string) {
  try {
    return await fetchCachedPublishedEventRows(city?.toLocaleLowerCase("it") ?? null);
  } catch (error) {
    return {
      rows: [] as PublishedEventRow[],
      error: {
        message: error instanceof Error ? error.message : "Unable to load published events",
      },
    };
  }
}

function resolveListTemporalContext(
  filters: EventListFilters,
): EventTemporalContext {
  if (filters.temporalContext) return filters.temporalContext;
  if (filters.month) return "month";
  if (filters.date) {
    return temporalContextForDateFilter(filters.date) ?? "general";
  }
  if (filters.range) return "weekend";
  return "general";
}

export const loadFilteredPublishedEvents = cache(
  async function loadFilteredPublishedEvents(filters: EventListFilters = {}) {
    const [{ rows, error }, favoriteIds] = await Promise.all([
      loadPublishedEventRows(filters.city),
      getCurrentUserFavoriteIds(),
    ]);

    const now = new Date();
    const dateRange = filters.date ? getDateRange(filters.date) : null;
    const monthRange = filters.month
      ? getMonthRange(filters.month.year, filters.month.monthIndex)
      : null;
    const temporalContext = resolveListTemporalContext(filters);

    const events = rows
      .filter((event) => {
        if (
          !filters.includeExpired &&
          !isPublicEventActive(event.start_at, event.end_at, now)
        ) {
          return false;
        }

        const eventArea = getEventArea(event.municipality);
        const matchesArea =
          !filters.areaLabel || eventArea === filters.areaLabel;

        const matchesCity =
          !filters.city ||
          event.municipality?.toLocaleLowerCase("it") ===
            filters.city.toLocaleLowerCase("it");

        const matchesCategory =
          !filters.categorySlug ||
          eventMatchesCategoryFilter(event, filters.categorySlug);

        const matchesFree =
          !filters.freeOnly ||
          resolveEventPricing(event.is_free, event.price_from).isFree;

        const rangeInput = {
          startAt: event.start_at,
          endAt: event.end_at,
          scheduleMode: event.schedule_mode as EventScheduleMode | null,
        };

        const matchesDate =
          !dateRange ||
          eventAppearsInRange(rangeInput, dateRange, temporalContext);

        const matchesMonth =
          !monthRange || eventAppearsInRange(rangeInput, monthRange, "month");

        const matchesRange =
          !filters.range ||
          eventAppearsInRange(rangeInput, filters.range, temporalContext);

        const needles = (filters.titleIncludes ?? []).map((value) =>
          value.toLocaleLowerCase("it"),
        );
        const haystack =
          `${event.title} ${event.description ?? ""} ${event.municipality ?? ""}`.toLocaleLowerCase(
            "it",
          );
        const matchesTitle =
          needles.length === 0 ||
          needles.some((needle) => haystack.includes(needle));

        const matchesSlug =
          !filters.slugs?.length ||
          (typeof event.slug === "string" &&
            filters.slugs.includes(event.slug));

        return (
          matchesArea &&
          matchesCity &&
          matchesCategory &&
          matchesFree &&
          matchesDate &&
          matchesMonth &&
          matchesRange &&
          matchesTitle &&
          matchesSlug
        );
      })
      .map((event) => ({
        ...mapPublishedEvent(event),
        isFavorite: favoriteIds.has(event.id),
      }))
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

    return { events, error };
  },
);
