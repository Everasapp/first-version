import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { sagreExploreLinks, type CalendarMonth } from "@/src/lib/seo/calendar";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import { absoluteUrl, defaultOgImages, landingRobots } from "@/src/lib/seo/site";

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

  const faqs = [
    {
      question: `Cosa fare in Sardegna a ${month.name.toLocaleLowerCase("it")}?`,
      answer: `Su EVERAS trovi sagre, concerti e feste paese in programma a ${month.name} ${month.year}, da Nord a Sud.`,
    },
    {
      question: "Come è organizzato il calendario?",
      answer:
        "Gli eventi sono ordinati per data. Apri la scheda per orario, luogo e locandina, oppure passa al weekend e alle sagre.",
    },
  ];

  return (
    <EventLandingView
      eyebrow="Calendario eventi"
      h1={month.h1}
      intro={month.description}
      paragraphs={month.paragraphs}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi e sagre", href: "/eventi-sardegna" },
        { name: `${month.name} ${month.year}` },
      ]}
      faqs={faqs}
      relatedLinks={[...sagreExploreLinks(), ...festivalHubLinks()].filter(
        (link) => link.href !== month.path,
      )}
      jsonLd={[
        collectionPageSchema({
          name: month.h1,
          description: month.description,
          url: absoluteUrl(month.path),
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
