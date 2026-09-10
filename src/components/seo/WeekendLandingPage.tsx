import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { sagreExploreLinks } from "@/src/lib/seo/calendar";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import {
  formatEventHighlightList,
  weekendExploreLinks,
  type CalendarWeekend,
} from "@/src/lib/seo/weekends";
import { absoluteUrl, defaultOgImages, landingRobots } from "@/src/lib/seo/site";

export function buildWeekendLandingMetadata(
  weekend: CalendarWeekend,
  eventCount: number,
): Metadata {
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
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${weekend.title} | EVERAS`,
      description: weekend.description,
      images: defaultOgImages().map((image) => image.url),
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

  const highlights = formatEventHighlightList(
    events.slice(0, 4).map((event) => event.title),
  );
  const paragraphs = highlights
    ? [
        weekend.paragraphs[0],
        `Tra gli appuntamenti in programma: ${highlights}.`,
        weekend.paragraphs[2],
      ]
    : weekend.paragraphs;

  const faqs = [
    {
      question: `Cosa fare in Sardegna nel weekend ${weekend.dateLabel}?`,
      answer: `Su EVERAS trovi sagre, concerti e feste paese in programma da venerdì a domenica, con comune, orario e locandina.`,
    },
    {
      question: "Questa pagina è diversa da Eventi weekend?",
      answer:
        "Eventi weekend mostra sempre il fine settimana in corso. Questa pagina resta legata a queste date, così puoi aprirla anche nei giorni prima.",
    },
  ];

  return (
    <EventLandingView
      eyebrow="Fine settimana"
      h1={weekend.h1}
      intro={weekend.description}
      paragraphs={paragraphs}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi e sagre", href: "/eventi-sardegna" },
        { name: weekend.shortLabel },
      ]}
      faqs={faqs}
      relatedLinks={[
        ...sagreExploreLinks(),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
      ].filter((link) => link.href !== weekend.path)}
      jsonLd={[
        collectionPageSchema({
          name: weekend.h1,
          description: weekend.description,
          url: absoluteUrl(weekend.path),
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
