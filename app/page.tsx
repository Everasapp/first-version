import Header from "@/src/components/home/Header";
import Hero from "@/src/components/home/Hero";
import HappeningToday from "@/src/components/home/HappeningToday";
import TownGuidesPreview from "@/src/components/home/TownGuidesPreview";
import HomeSponsoredSection from "@/src/components/ads/HomeSponsoredSection";
import CategoriesSection from "@/src/components/home/CategoriesSection";
import AreaSection from "@/src/components/home/AreaSection";
import type { EventCardData } from "@/src/components/home/EventCard";
import { getPaidHomeAdsForDisplay } from "@/src/lib/ads/orders";
import { resolveCategoryLabels } from "@/src/lib/event-categories";
import { cities } from "@/src/data/cities";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import { formatEventDateRange } from "@/src/lib/formatEventDate";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { resolveEventStatusBadge } from "@/src/lib/eventStatusBadge";
import { isPublicEventActive } from "@/src/lib/eventActive";
import {
  eventOverlapsRomeWeek,
  pickWeeklyTownGuides,
} from "@/src/lib/home/weekly-town-guides";
import { createClient } from "@/src/lib/supabase/server";
import { engagementFromRow } from "@/src/lib/event-engagement";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categories?: string[] | null;
  province: string | null;
  municipality: string;
  location_name: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  is_free: boolean;
  price_from: number | string | null;
  is_featured: boolean;
  created_at?: string | null;
  views_count?: number | null;
  favorites_count?: number | null;
  shares_count?: number | null;
};

function formatEventDate(startAt: string, endAt?: string | null) {
  return formatEventDateRange(startAt, endAt);
}

function getArea(event: EventRow) {
  const city = cities.find(
    (item) =>
      item.city.localeCompare(event.municipality, "it", {
        sensitivity: "base",
      }) === 0,
  );

  if (city?.area) {
    return city.area;
  }

  const province = event.province?.toUpperCase();

  if (["SS", "OT", "OLBIA-TEMPIO"].includes(province ?? "")) {
    return "Nord Sardegna";
  }

  if (["NU", "OR", "NUORO", "ORISTANO"].includes(province ?? "")) {
    return "Centro Sardegna";
  }

  return "Sud Sardegna";
}

/** Alterna Nord / Centro / Sud così Hot this week non è solo Nord. */
function interleaveByArea<T extends { area?: string }>(events: T[]): T[] {
  const buckets: Record<string, T[]> = {
    "Nord Sardegna": [],
    "Centro Sardegna": [],
    "Sud Sardegna": [],
  };
  const other: T[] = [];

  for (const event of events) {
    const area = event.area;
    if (area && area in buckets) {
      buckets[area].push(event);
    } else {
      other.push(event);
    }
  }

  const result: T[] = [];
  const maxLen = Math.max(
    buckets["Nord Sardegna"].length,
    buckets["Centro Sardegna"].length,
    buckets["Sud Sardegna"].length,
  );

  for (let i = 0; i < maxLen; i += 1) {
    for (const area of [
      "Nord Sardegna",
      "Centro Sardegna",
      "Sud Sardegna",
    ] as const) {
      const next = buckets[area][i];
      if (next) result.push(next);
    }
  }

  return [...result, ...other];
}

function mapEvent(event: EventRow, now: Date = new Date()): EventCardData {
  const pricing = resolveEventPricing(event.is_free, event.price_from);
  const status = resolveEventStatusBadge(event.start_at, event.end_at, now);
  const categoryLabels = resolveCategoryLabels(event);

  return {
    id: event.slug,
    eventId: event.id,
    title: event.title,
    category: categoryLabels[0] ?? event.category,
    categories: categoryLabels,
    date: formatEventDate(event.start_at, event.end_at),
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    location: event.location_name || event.municipality,
    municipality: event.municipality,
    area: getArea(event),
    imageUrl: event.image_url ?? "/images/concert.webp",
    isFree: pricing.isFree,
    priceFrom: pricing.priceFrom,
    isFeatured: event.is_featured,
    happeningNow: status.happeningNow,
    isActiveEvent: status.isActiveEvent,
    statusLabel: status.statusLabel,
    ...engagementFromRow(event),
  };
}

export default async function Home() {
  const supabase = await createClient();
  const now = new Date();
  // Bound the query so homepage SSR does not pull ancient expired rows.
  const lookback = new Date(now);
  lookback.setUTCDate(lookback.getUTCDate() - 120);

  const pageSize = 1000;
  const rows: EventRow[] = [];
  let from = 0;
  let error: { message: string } | null = null;

  while (true) {
    const page = await supabase
      .from("events")
      .select(
        "id, slug, title, category, categories, province, municipality, location_name, start_at, end_at, image_url, is_free, price_from, is_featured, created_at, views_count, favorites_count, shares_count",
      )
      .eq("status", "published")
      .gte("start_at", lookback.toISOString())
      .order("start_at", { ascending: true })
      .range(from, from + pageSize - 1);

    if (page.error) {
      error = page.error;
      break;
    }
    const chunk = (page.data ?? []) as EventRow[];
    rows.push(...chunk);
    if (chunk.length < pageSize) break;
    from += pageSize;
  }

  const favoriteIds = await getCurrentUserFavoriteIds();

  if (error) {
    console.error("Errore nel caricamento della homepage:", error);
  }

  const events = rows
    .filter((event) =>
      isPublicEventActive(event.start_at, event.end_at, now),
    )
    .map((event) => ({
      ...mapEvent(event, now),
      isFavorite: favoriteIds.has(event.id),
    }));

  const weekRows = rows.filter((event) => {
    if (!eventOverlapsRomeWeek(event, now)) {
      return false;
    }

    return isPublicEventActive(event.start_at, event.end_at, now);
  });

  const weekCandidates = weekRows
    .sort((a, b) => {
      const aStatus = resolveEventStatusBadge(a.start_at, a.end_at, now);
      const bStatus = resolveEventStatusBadge(b.start_at, b.end_at, now);
      const aRank = aStatus.happeningNow ? 0 : aStatus.isActiveEvent ? 1 : 2;
      const bRank = bStatus.happeningNow ? 0 : bStatus.isActiveEvent ? 1 : 2;
      if (aRank !== bRank) return aRank - bRank;
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      // Newest listings first so returning visitors see fresh cards.
      const aCreated = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bCreated = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (aCreated !== bCreated) return bCreated - aCreated;
      return (
        new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );
    })
    .map((event) => ({
      ...mapEvent(event, now),
      isFavorite: favoriteIds.has(event.id),
    }));

  const weekEvents = interleaveByArea(weekCandidates);
  const weeklyTownGuides = pickWeeklyTownGuides(weekRows, now);

  const paidAds = await getPaidHomeAdsForDisplay(now);

  return (
    <>
      <Header />

      <main className="min-w-0 max-w-full">
        <Hero />

        <HappeningToday events={weekEvents} />

        <HomeSponsoredSection paidAds={paidAds} />

        <TownGuidesPreview towns={weeklyTownGuides} />

        <AreaSection
          title="Nord Sardegna"
          area="Nord Sardegna"
          description="Dai tramonti di Alghero alle acque cristalline della Pelosa."
          image="/images/nord-sardegna.webp"
          events={events}
        />

        <AreaSection
          title="Centro Sardegna"
          area="Centro Sardegna"
          description="Nel cuore della Sardegna tra montagne, borghi e tradizioni."
          image="/images/centro-sardegna.webp"
          events={events}
        />

        <AreaSection
          title="Sud Sardegna"
          area="Sud Sardegna"
          description="Tra Cagliari, Chia e Villasimius, vivi il meglio del sud dell'isola."
          image="/images/sud-sardegna.webp"
          events={events}
        />

        <CategoriesSection />
      </main>
    </>
  );
}
