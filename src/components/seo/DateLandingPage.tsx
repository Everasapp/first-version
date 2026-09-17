import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import {
  DATE_LANDING_META,
  getDateLandingContext,
  type DateLandingKey,
} from "@/src/lib/seo/dateRange";
import {
  buildDateLandingEditorial,
  buildDateLandingFaqs,
  buildDateLandingLinks,
  buildLandingStats,
} from "@/src/lib/seo/landing-copy";
import {
  absoluteUrl,
  defaultOgImages,
  landingRobots,
} from "@/src/lib/seo/site";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { dedupeLinks, temporalExploreLinks } from "@/src/lib/seo/internal-links";

type DateLandingPageProps = {
  dateKey: Exclude<DateLandingKey, "settimana">;
};

export function buildDateLandingMetadata(
  dateKey: Exclude<DateLandingKey, "settimana">,
  eventCount?: number,
): Metadata {
  const meta = DATE_LANDING_META[dateKey];
  const context = getDateLandingContext(dateKey);
  const title = context.title ?? meta.title;
  const description = context.metaDescription;
  return {
    title,
    description,
    robots:
      eventCount === undefined ? undefined : landingRobots(eventCount),
    alternates: { canonical: meta.path },
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: meta.path,
      type: "website",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EVERAS`,
      description,
      images: defaultOgImages().map((image) => image.url),
    },
  };
}

export default async function DateLandingPage({ dateKey }: DateLandingPageProps) {
  const meta = DATE_LANDING_META[dateKey];
  const context = getDateLandingContext(dateKey);
  const { events, error } = await loadFilteredPublishedEvents({
    date: dateKey,
  });
  const stats = buildLandingStats(events);
  const highlightTitles =
    dateKey === "weekend"
      ? events.slice(0, 5).map((event) => event.title)
      : [];
  const editorial = buildDateLandingEditorial({
    dateKey,
    stats,
    datePhrase: context.datePhrase,
    highlightTitles,
  });
  const faqs = buildDateLandingFaqs(dateKey, stats, context.datePhrase);
  const { quickLinks, relatedLinks } = buildDateLandingLinks(dateKey, stats);
  const h1 = context.h1 ?? meta.h1;

  return (
    <EventLandingView
      h1={h1}
      subtitle={editorial.subtitle}
      intro={editorial.intro}
      paragraphs={editorial.paragraphs}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: h1 },
      ]}
      faqs={faqs}
      quickLinks={quickLinks}
      relatedLinks={dedupeLinks([
        ...temporalExploreLinks(meta.path),
        ...relatedLinks,
        ...(dateKey === "weekend" ? [] : weekendExploreLinks(2)),
      ])}
      jsonLd={[
        collectionPageSchema({
          name: h1,
          description: context.metaDescription,
          url: absoluteUrl(meta.path),
        }),
        eventsItemListSchema({
          name: h1,
          path: meta.path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: h1, path: meta.path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
