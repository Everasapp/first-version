import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import type { EventCardData } from "@/src/components/home/EventCard";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import {
  sagreExploreLinks,
  yearMonths,
  type CalendarMonth,
  type CalendarYear,
} from "@/src/lib/seo/calendar";
import { getMonthRange, getYearRange } from "@/src/lib/seo/dateRange";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { buildLandingStats } from "@/src/lib/seo/landing-copy";
import { coreDateLinks, dedupeLinks } from "@/src/lib/seo/internal-links";
import { absoluteUrl, landingRobots } from "@/src/lib/seo/site";

const EVENTS_PER_MONTH = 8;

const YEAR_COVER = {
  src: "/images/seo/eventi-sardegna-cover.webp",
  alt: "Piazza in Sardegna con sagra e concerto all’aperto la sera",
};

function eventsOverlappingMonth(events: EventCardData[], month: CalendarMonth) {
  const { start, end } = getMonthRange(month.year, month.monthIndex);
  return events.filter((event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
    return eventStart < end && eventEnd >= start;
  });
}

export function buildYearLandingMetadata(
  year: CalendarYear,
  eventCount: number,
): Metadata {
  return {
    title: year.title,
    description: year.description,
    robots: landingRobots(eventCount),
    alternates: { canonical: year.path },
    openGraph: {
      title: `${year.title} | EVERAS`,
      description: year.description,
      url: year.path,
      type: "website",
      images: [
        { url: YEAR_COVER.src, width: 1200, height: 630, alt: YEAR_COVER.alt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${year.title} | EVERAS`,
      description: year.description,
      images: [YEAR_COVER.src],
    },
  };
}

export default async function YearLandingPage({
  year,
}: {
  year: CalendarYear;
}) {
  const { events, error } = await loadFilteredPublishedEvents({
    range: getYearRange(year.year),
  });
  const stats = buildLandingStats(events);
  const months = yearMonths(year.year);

  const dynamicIntro =
    stats.total === 0
      ? `Per il ${year.year} non ci sono ancora eventi in programma su EVERAS. Torna tra poco oppure esplora il weekend, le sagre e i singoli mesi.`
      : `Nel calendario ${year.year} in Sardegna trovi ${stats.total} ${stats.total === 1 ? "evento" : "eventi"} ancora in programma${
          stats.topCities.length > 0
            ? `, con più presenza a ${stats.topCities
                .slice(0, 3)
                .map((city) => city.name)
                .join(", ")}`
            : ""
        }${
          stats.topCategories.length > 0
            ? `. Tra le tipologie: ${stats.topCategories
                .slice(0, 3)
                .map((category) => category.name.toLocaleLowerCase("it"))
                .join(", ")}`
            : ""
        }.`;

  const dynamicParagraphs = [
    year.paragraphs[0],
    year.paragraphs[1],
    stats.freeCount > 0
      ? `Nell’anno ${stats.freeCount} ${stats.freeCount === 1 ? "appuntamento è segnalato" : "appuntamenti sono segnalati"} come gratuiti o a ingresso libero dove indicato sulla scheda.`
      : null,
    year.paragraphs[2],
  ].filter(Boolean) as string[];

  const faqs = [
    {
      question: `Dov’è il calendario eventi in Sardegna ${year.year}?`,
      answer:
        stats.total > 0
          ? `È questa pagina: ${stats.total} appuntamenti ancora in programma nel ${year.year}, raggruppati per mese. Apri il mese o la scheda per orario, comune e ingresso.`
          : `Quando sono in calendario compaiono qui, mese per mese. Intanto guarda weekend, oggi e le sagre su EVERAS.`,
    },
    {
      question: "Come è organizzato il calendario?",
      answer: `I dodici mesi del ${year.year} sono in elenco. Ogni mese ha la propria pagina con l’elenco completo; qui vedi una selezione degli appuntamenti ancora in programma.`,
    },
    {
      question: `Quali sagre ci sono in Sardegna nel ${year.year}?`,
      answer:
        "Apri Sagre in Sardegna per le feste di paese, poi i mesi e gli hub (Autunno in Barbagia, Santa Greca) quando sono in stagione.",
    },
  ];

  const monthHighlights = months.map((month) => {
    const count = eventsOverlappingMonth(events, month).length;
    return {
      href: month.path,
      label: `${month.name} ${month.year}`,
      meta:
        count === 0
          ? "In aggiornamento"
          : `${count} ${count === 1 ? "evento" : "eventi"}`,
    };
  });

  const sections = months
    .map((month) => {
      const monthEvents = eventsOverlappingMonth(events, month);
      if (monthEvents.length === 0) return null;
      return {
        id: month.slug,
        title: `${month.name} ${month.year}`,
        events: monthEvents.slice(0, EVENTS_PER_MONTH),
      };
    })
    .filter((section): section is NonNullable<typeof section> => section != null);

  const quickLinks = [
    ...months.map((month) => ({
      href: month.path,
      label: month.name,
    })),
    ...stats.topCities.slice(0, 4).map((city) => ({
      href: city.href,
      label: city.name,
    })),
    ...stats.topCategories.slice(0, 3).map((category) => ({
      href: category.href,
      label: category.name,
    })),
  ];

  return (
    <EventLandingView
      eyebrow="Calendario eventi"
      h1={year.h1}
      subtitle="Sagre, concerti e festival mese per mese"
      intro={dynamicIntro}
      paragraphs={dynamicParagraphs}
      events={events}
      sections={sections}
      errorMessage={error?.message}
      cover={YEAR_COVER}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi e sagre", href: "/eventi-sardegna" },
        { name: String(year.year) },
      ]}
      faqs={faqs}
      quickLinks={quickLinks}
      highlights={monthHighlights}
      highlightsTitle={`Mesi ${year.year}`}
      relatedLinks={dedupeLinks([
        ...coreDateLinks(year.path),
        ...sagreExploreLinks(),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
      ]).filter((link) => link.href !== year.path)}
      jsonLd={[
        collectionPageSchema({
          name: year.h1,
          description: year.description,
          url: absoluteUrl(year.path),
        }),
        eventsItemListSchema({
          name: year.h1,
          path: year.path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi e sagre", path: "/eventi-sardegna" },
          { name: String(year.year), path: year.path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
