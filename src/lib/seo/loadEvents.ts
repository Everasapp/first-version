import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import type { EventCardData } from "@/src/components/home/EventCard";
import { formatEventDateRange } from "@/src/lib/formatEventDate";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { resolveEventStatusBadge } from "@/src/lib/eventStatusBadge";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import { createClient } from "@/src/lib/supabase/server";
import { getDateRange } from "@/src/lib/seo/dateRange";

export type PublishedEventRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  province: string | null;
  municipality: string | null;
  location_name: string | null;
  address: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  slug: string | null;
  is_free: boolean;
  price_from: number | string | null;
  ticket_url: string | null;
  status: string;
  is_featured: boolean;
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
  const categoryName =
    categories.find((category) => category.slug === event.category)?.name ??
    event.category ??
    "Evento";

  return {
    id: event.slug || event.id,
    eventId: event.id,
    title: event.title,
    category: categoryName,
    date: formatEventDateRange(event.start_at, event.end_at),
    startDate: event.start_at,
    endDate: event.end_at || undefined,
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
  };
}

export type EventListFilters = {
  city?: string;
  categorySlug?: string;
  date?: string;
  areaLabel?: string;
};

export async function loadFilteredPublishedEvents(
  filters: EventListFilters = {},
) {
  const supabase = await createClient();
  const [{ data, error }, favoriteIds] = await Promise.all([
    supabase
      .from("events")
      .select(
        `
        id,
        title,
        description,
        category,
        province,
        municipality,
        location_name,
        address,
        start_at,
        end_at,
        image_url,
        slug,
        is_free,
        price_from,
        ticket_url,
        status,
        is_featured
      `,
      )
      .eq("status", "published")
      .order("start_at", { ascending: true }),
    getCurrentUserFavoriteIds(),
  ]);

  const rows = (data ?? []) as PublishedEventRow[];
  const now = new Date();
  const dateRange = filters.date ? getDateRange(filters.date) : null;
  const categoryMeta = filters.categorySlug
    ? categories.find((item) => item.slug === filters.categorySlug)
    : undefined;

  const events = rows
    .filter((event) => {
      if (!isPublicEventActive(event.start_at, event.end_at, now)) {
        return false;
      }

      const eventArea = getEventArea(event.municipality);
      const matchesArea =
        !filters.areaLabel || eventArea === filters.areaLabel;

      const matchesCity =
        !filters.city ||
        event.municipality?.toLocaleLowerCase("it") ===
          filters.city.toLocaleLowerCase("it");

      const normalizedEventCategory =
        event.category?.toLocaleLowerCase("it") ?? "";
      const matchesCategory =
        !filters.categorySlug ||
        normalizedEventCategory === filters.categorySlug.toLocaleLowerCase("it") ||
        normalizedEventCategory ===
          categoryMeta?.name.toLocaleLowerCase("it");

      const eventStartDate = new Date(event.start_at);
      const matchesDate =
        !dateRange ||
        (eventStartDate >= dateRange.start && eventStartDate < dateRange.end);

      return matchesArea && matchesCity && matchesCategory && matchesDate;
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
}
