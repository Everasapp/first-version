import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { sagreExploreLinks } from "@/src/lib/seo/calendar";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import {
  formatEventHighlightList,
  weekendExploreLinks,
  type CalendarWeekend,
} from "@/src/lib/seo/weekends";
import { absoluteUrl, landingRobots } from "@/src/lib/seo/site";
import { DATED_WEEKEND_POLICY } from "@/src/lib/seo/landing-intents";
import { temporalExploreLinks, dedupeLinks } from "@/src/lib/seo/internal-links";
import {
  pickWeekendPosterUrls,
  WEEKEND_MOSAIC_MIN_POSTERS,
  WEEKEND_OG_SIZE,
  WEEKEND_OG_TYPE,
  weekendOgPath,
} from "@/src/lib/seo/weekend-mosaic";
import { buildLandingStats } from "@/src/lib/seo/landing-copy";

export function buildWeekendLandingMetadata(
  weekend: CalendarWeekend,
  eventCount: number,
): Metadata {
  const mosaicPath = weekendOgPath(weekend.slug, eventCount);
  const ogImage = {
    url: mosaicPath,
    width: WEEKEND_OG_SIZE.width,
    height: WEEKEND_OG_SIZE.height,
    alt: `Locandine del weekend ${weekend.dateLabel} in Sardegna`,
    type: WEEKEND_OG_TYPE,
  };

  return {
    title: weekend.title,
    description: weekend.description,
    robots: landingRobots(eventCount),
    alternates: { canonical: weekend.path },
    openGraph: {
      title: `${weekend.title} | EVERAS`,
      description: weekend.description,
      url: weekend.path,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${weekend.title} | EVERAS`,
      description: weekend.description,
      images: [ogImage.url],
    },
  };
}

export default async function WeekendLandingPage({
  weekend,
}: {
  weekend: CalendarWeekend;
}) {
  const { events, error } = await loadFilteredPublishedEvents({
    range: { start: weekend.start, end: weekend.end },
  });

  const stats = buildLandingStats(events);
  const highlights = formatEventHighlightList(
    events.slice(0, 4).map((event) => event.title),
  );
  const posterUrls = pickWeekendPosterUrls(events);
  const mosaicSrc = weekendOgPath(weekend.slug, events.length);

  const intro =
    stats.total === 0
      ? `Per il weekend ${weekend.dateLabel} non ci sono ancora eventi pubblicati. Per il fine settimana in corso apri ${DATED_WEEKEND_POLICY.evergreenLabel}.`
      : `Nel weekend ${weekend.dateLabel} trovi ${stats.total} ${stats.total === 1 ? "evento" : "eventi"} in Sardegna su EVERAS${
          stats.topCities.length
            ? `, con più presenza a ${stats.topCities
                .slice(0, 3)
                .map((city) => city.name)
                .join(", ")}`
            : ""
        }.`;

  const paragraphs = [
    weekend.paragraphs[0],
    ...(highlights
      ? [`Tra gli appuntamenti in programma: ${highlights}.`]
      : []),
    weekend.paragraphs[1],
    weekend.paragraphs[2],
  ];

  const faqs = [
    {
      question: `Cosa fare in Sardegna nel weekend ${weekend.dateLabel}?`,
      answer:
        stats.total > 0
          ? `In questa pagina: ${stats.total} appuntamenti con date fisse ${weekend.shortLabel}. Apri la scheda per comune, orario e ingresso.`
          : `Quando sono pubblicati compaiono qui. Per il weekend attuale usa ${DATED_WEEKEND_POLICY.evergreenLabel}.`,
    },
    {
      question: "Questa pagina è diversa da Eventi weekend?",
      answer: `${DATED_WEEKEND_POLICY.evergreenLabel} mostra sempre il fine settimana in corso. Questa pagina resta legata a ${weekend.shortLabel}, così puoi consultarla anche come riferimento datato.`,
    },
  ];

  return (
    <EventLandingView
      eyebrow="Fine settimana datato"
      h1={weekend.h1}
      intro={intro}
      paragraphs={paragraphs}
      events={events}
      errorMessage={error?.message}
      cover={
        posterUrls.length >= WEEKEND_MOSAIC_MIN_POSTERS
          ? {
              src: mosaicSrc,
              alt: `Locandine degli eventi del weekend ${weekend.dateLabel} in Sardegna`,
            }
          : undefined
      }
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi e sagre", href: "/eventi-sardegna" },
        { name: weekend.shortLabel },
      ]}
      faqs={faqs}
      quickLinks={[
        {
          href: DATED_WEEKEND_POLICY.evergreenHref,
          label: DATED_WEEKEND_POLICY.evergreenLabel,
        },
        ...stats.topCities.slice(0, 4).map((city) => ({
          href: city.href,
          label: city.name,
        })),
      ]}
      relatedLinks={dedupeLinks([
        {
          href: DATED_WEEKEND_POLICY.evergreenHref,
          label: DATED_WEEKEND_POLICY.evergreenLabel,
        },
        ...temporalExploreLinks(weekend.path),
        ...sagreExploreLinks(),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
      ]).filter((link) => link.href !== weekend.path)}
      jsonLd={[
        collectionPageSchema({
          name: weekend.h1,
          description: weekend.description,
          url: absoluteUrl(weekend.path),
        }),
        eventsItemListSchema({
          name: weekend.h1,
          path: weekend.path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi e sagre", path: "/eventi-sardegna" },
          { name: weekend.shortLabel, path: weekend.path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
