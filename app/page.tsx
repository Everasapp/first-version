import { Suspense } from "react";

import Header from "@/src/components/home/Header";
import Hero from "@/src/components/home/Hero";
import EditorialGuides from "@/src/components/home/EditorialGuides";
import HappeningToday from "@/src/components/home/HappeningToday";
import TownGuidesPreview from "@/src/components/home/TownGuidesPreview";
import HomeSponsoredSection from "@/src/components/ads/HomeSponsoredSection";
import CategoriesSection from "@/src/components/home/CategoriesSection";
import AreaSection from "@/src/components/home/AreaSection";
import type { EventCardData } from "@/src/components/home/EventCard";
import JsonLd from "@/src/components/seo/JsonLd";
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
import { selectHomepageEventSections } from "@/src/lib/seo/homepage-event-selection";
import { eventsItemListSchema } from "@/src/lib/seo/schema";
import { loadHomeEventRows, type HomeEventRow as EventRow } from "@/src/lib/home/load-events";
import { engagementFromRow } from "@/src/lib/event-engagement";

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
    createdAt: event.created_at ?? undefined,
    ...engagementFromRow(event),
  };
}

async function HomeContent() {
  const [{ rows, error }, favoriteIds] = await Promise.all([
    loadHomeEventRows(),
    getCurrentUserFavoriteIds(),
  ]);
  const now = new Date();

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
      // Nuovi caricamenti per primi nel carosello Hot this week.
      const aCreated = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bCreated = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (aCreated !== bCreated) return bCreated - aCreated;

      const aStatus = resolveEventStatusBadge(a.start_at, a.end_at, now);
      const bStatus = resolveEventStatusBadge(b.start_at, b.end_at, now);
      const aRank = aStatus.happeningNow ? 0 : aStatus.isActiveEvent ? 1 : 2;
      const bRank = bStatus.happeningNow ? 0 : bStatus.isActiveEvent ? 1 : 2;
      if (aRank !== bRank) return aRank - bRank;
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (
        new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );
    })
    .map((event) => ({
      ...mapEvent(event, now),
      isFavorite: favoriteIds.has(event.id),
    }));

  // Ordine = più recenti prima (niente interleave per area: altrimenti i nuovi non restano in testa).
  const weeklyTownGuides = pickWeeklyTownGuides(weekRows, now);

  const sections = selectHomepageEventSections({
    hotCandidates: weekCandidates,
    allEvents: events,
  });

  const homepageItemList = eventsItemListSchema({
    name: "Eventi in Sardegna",
    path: "/",
    events: sections.ssrCards,
    limit: sections.ssrCards.length,
  });

  const paidAds = await getPaidHomeAdsForDisplay(now);

  return (
    <>
      {homepageItemList ? <JsonLd data={homepageItemList} /> : null}

      <HappeningToday events={sections.hot} />

      <EditorialGuides />

      <HomeSponsoredSection paidAds={paidAds} />

      <TownGuidesPreview towns={weeklyTownGuides} />

      <AreaSection
        title="Nord Sardegna"
        area="Nord Sardegna"
        description="Dai tramonti di Alghero alle acque cristalline della Pelosa."
        image="/images/nord-sardegna.webp"
        events={sections.north}
        totalCount={sections.northTotalCount}
      />

      <AreaSection
        title="Centro Sardegna"
        area="Centro Sardegna"
        description="Nel cuore della Sardegna tra montagne, borghi e tradizioni."
        image="/images/centro-sardegna.webp"
        events={sections.center}
        totalCount={sections.centerTotalCount}
      />

      <AreaSection
        title="Sud Sardegna"
        area="Sud Sardegna"
        description="Tra Cagliari, Chia e Villasimius, vivi il meglio del sud dell'isola."
        image="/images/sud-sardegna.webp"
        events={sections.south}
        totalCount={sections.southTotalCount}
      />

      <CategoriesSection />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      {/* Keep the footer below the viewport while event sections stream in. */}
      <main className="min-h-screen min-w-0 max-w-full">
        <Hero />
        <Suspense
          fallback={
            <div
              role="status"
              className="min-h-48 bg-white px-5 py-10 text-center text-slate-600"
            >
              Caricamento degli eventi…
            </div>
          }
        >
          <HomeContent />
        </Suspense>
      </main>
    </>
  );
}
