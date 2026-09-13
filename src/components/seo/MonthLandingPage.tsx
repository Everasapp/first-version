import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { sagreExploreLinks, type CalendarMonth, monthLanding } from "@/src/lib/seo/calendar";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { buildLandingStats } from "@/src/lib/seo/landing-copy";
import { absoluteUrl, defaultOgImages, landingRobots } from "@/src/lib/seo/site";

function adjacentMonthLanding(month: CalendarMonth, offset: number) {
  const cursor = new Date(month.year, month.monthIndex + offset, 1);
  return monthLanding(cursor.getFullYear(), cursor.getMonth());
}

export function buildMonthLandingMetadata(
  month: CalendarMonth,
  eventCount: number,
): Metadata {
  return {
    title: month.title,
    description: month.description,
    robots: landingRobots(eventCount),
    alternates: { canonical: month.path },
    openGraph: {
      title: `${month.title} | EVERAS`,
      description: month.description,
      url: month.path,
      type: "website",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${month.title} | EVERAS`,
      description: month.description,
      images: defaultOgImages().map((image) => image.url),
    },
  };
}

export default async function MonthLandingPage({
  month,
}: {
  month: CalendarMonth;
}) {
  const { events, error } = await loadFilteredPublishedEvents({
    month: { year: month.year, monthIndex: month.monthIndex },
  });
  const stats = buildLandingStats(events);
  const prev = adjacentMonthLanding(month, -1);
  const next = adjacentMonthLanding(month, 1);

  const dynamicIntro =
    stats.total === 0
      ? `Per ${month.name.toLocaleLowerCase("it")} ${month.year} non ci sono ancora eventi pubblicati su EVERAS. Torna tra poco oppure esplora il weekend e le guide alle feste.`
      : `A ${month.name.toLocaleLowerCase("it")} ${month.year} trovi ${stats.total} ${stats.total === 1 ? "evento" : "eventi"} pubblicati in Sardegna${
          stats.topCities.length > 0
            ? `, con più presenza a ${stats.topCities
                .slice(0, 3)
                .map((city) => city.name)
                .join(", ")}`
            : ""
        }.`;

  const faqs = [
    {
      question: `Cosa fare in Sardegna a ${month.name.toLocaleLowerCase("it")}?`,
      answer:
        stats.total > 0
          ? `In questa pagina: ${stats.total} appuntamenti a ${month.name} ${month.year}. Apri la scheda per orario, comune e ingresso.`
          : `Quando sono pubblicati compaiono qui. Intanto guarda weekend, oggi e le categorie su EVERAS.`,
    },
    {
      question: "Come è organizzato il calendario?",
      answer:
        "Gli eventi sono ordinati per data. Apri la scheda per orario, luogo e locandina, oppure passa al weekend e alle sagre.",
    },
  ];

  const quickLinks = [
    ...stats.topCities.slice(0, 4).map((city) => ({
      href: city.href,
      label: city.name,
    })),
    ...stats.topCategories.slice(0, 4).map((category) => ({
      href: category.href,
      label: category.name,
    })),
  ];

  return (
    <EventLandingView
      eyebrow="Calendario eventi"
      h1={month.h1}
      intro={dynamicIntro}
      paragraphs={month.paragraphs}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi e sagre", href: "/eventi-sardegna" },
        { name: `${month.name} ${month.year}` },
      ]}
      faqs={faqs}
      quickLinks={quickLinks}
      relatedLinks={[
        { href: "/eventi-oggi", label: "Eventi oggi" },
        { href: "/eventi-weekend", label: "Eventi weekend" },
        { href: prev.path, label: `${prev.name} ${prev.year}` },
        { href: next.path, label: `${next.name} ${next.year}` },
        ...sagreExploreLinks(),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
      ].filter(
        (link, index, list) =>
          link.href !== month.path &&
          list.findIndex((item) => item.href === link.href) === index,
      )}
      jsonLd={[
        collectionPageSchema({
          name: month.h1,
          description: month.description,
          url: absoluteUrl(month.path),
        }),
        eventsItemListSchema({
          name: month.h1,
          path: month.path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi e sagre", path: "/eventi-sardegna" },
          { name: `${month.name} ${month.year}`, path: month.path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
