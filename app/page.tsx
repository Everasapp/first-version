import type { Metadata } from "next";
import { Suspense } from "react";
import { isLearningTopic, learningAreaForTopic, LEARNING_AREAS, LEARNING_PATH } from "@/src/lib/learning-courses";
import { mixWeekEvents } from "@/src/lib/home/mix-week-events";

import Header from "@/src/components/home/Header";
import Link from "next/link";
import CareerPathCards from "@/src/components/seo/CareerPathCards";
import EditorialPathCards from "@/src/components/seo/EditorialPathCards";
import { PASSION_PATH } from "@/src/lib/editorial-learning-paths";
import Hero from "@/src/components/home/Hero";
import HappeningToday from "@/src/components/home/HappeningToday";
import HomeSponsoredSection from "@/src/components/ads/HomeSponsoredSection";
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
import { eventsItemListSchema } from "@/src/lib/seo/schema";
import { loadHomeEventRows, type HomeEventRow as EventRow } from "@/src/lib/home/load-events";
import { engagementFromRow } from "@/src/lib/event-engagement";

const homeTitle = "EVERAS | Formazione, corsi ed esperienze in Sardegna";
const homeDescription =
  "Formazione per il lavoro oppure corsi, workshop ed esperienze per coltivare una passione: scegli cosa imparare in Sardegna.";

const homeOgImage = {
  url: "/images/learning/imparare-sardegna-og.jpg",
  width: 1200,
  height: 630,
  alt: "Corsi, laboratori e workshop in Sardegna",
  type: "image/jpeg" as const,
};

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
    images: [homeOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [homeOgImage.url],
  },
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

function mapEvent(event: EventRow, now: Date = new Date()): EventCardData {
  const pricing = resolveEventPricing(event.is_free, event.price_from);
  const status = resolveEventStatusBadge(event.start_at, event.end_at, now);
  const categoryLabels = resolveCategoryLabels(event);

  return {
    id: event.slug,
    eventId: event.id,
    title: event.title,
    category: categoryLabels[0] ?? event.category,
    learningTopic: isLearningTopic(event.subcategory) ? event.subcategory : undefined,
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

  const learningEvents = mixWeekEvents(rows.filter((event) =>
    isLearningTopic(event.subcategory) &&
    isPublicEventActive(event.start_at, event.end_at, now),
  ).map((event) => ({
    ...mapEvent(event, now), isFavorite: favoriteIds.has(event.id),
  })), now);
  const homepageItemList = eventsItemListSchema({
    name: "Formazione, corsi e workshop in Sardegna",
    path: "/",
    events: learningEvents.slice(0, 6),
    limit: 6,
  });

  const paidAds = await getPaidHomeAdsForDisplay(now);

  return (
    <>
      {homepageItemList ? <JsonLd data={homepageItemList} /> : null}

      {LEARNING_AREAS.map((area) => {
        const proposals = learningEvents.filter((event) => learningAreaForTopic(event.learningTopic) === area.key);
        return <HappeningToday
          key={area.key}
          showIntroLink
          events={proposals}
          title={area.title}
          eyebrow={area.subtitle}
          description={area.description}
          itemLabel="proposte"
          exploreHref={`${LEARNING_PATH}#${area.anchor}`}
          exploreLabel={`Esplora ${area.title.toLocaleLowerCase("it")}`}
        />;
      })}
      <HomeSponsoredSection paidAds={paidAds} />
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
              Caricamento dei corsi e delle esperienze…
            </div>
          }
        >
          <HomeContent />
        </Suspense>
        <section aria-labelledby="idee-percorsi-title" className="border-t border-slate-200 bg-slate-50 py-12">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 id="idee-percorsi-title" className="text-2xl font-bold text-slate-900">Idee e percorsi</h2>
            <p className="mb-6 mt-3 max-w-3xl leading-relaxed text-slate-600">Vuoi cambiare lavoro? Scegli una professione, scopri le tappe per formarti e costruisci un progetto da mostrare. Nella sezione trovi sei percorsi professionali, corsi collegati e idee per coltivare un interesse.</p>
            <CareerPathCards featured />
            <Link href="/idee-e-percorsi" prefetch={false} className="mt-6 inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Esplora idee e percorsi →</Link>
            <div className="mt-12 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-bold text-slate-900">Per passione: arte, materiali e territorio</h2>
              <p className="mb-6 mt-3 max-w-3xl leading-relaxed text-slate-600">Sperimenta con le mani, osserva il territorio e coltiva un interesse. Parti da un esercizio semplice e scegli un corso da approfondire.</p>
              <EditorialPathCards featured />
              <Link href={PASSION_PATH} prefetch={false} className="mt-6 inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Tutti i percorsi per passione →</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
