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

type DateLandingPageProps = {
  dateKey: Exclude<DateLandingKey, "settimana">;
};

export function buildDateLandingMetadata(
  dateKey: Exclude<DateLandingKey, "settimana">,
  eventCount?: number,
): Metadata {
  const meta = DATE_LANDING_META[dateKey];
  const context = getDateLandingContext(dateKey);
  return {
    title: meta.title,
    description: context.metaDescription,
    robots:
      eventCount === undefined ? undefined : landingRobots(eventCount),
    alternates: { canonical: meta.path },
    openGraph: {
      title: `${meta.title} | EVERAS`,
      description: context.metaDescription,
      url: meta.path,
      type: "website",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | EVERAS`,
      description: context.metaDescription,
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
  const editorial = buildDateLandingEditorial({
    dateKey,
    stats,
    datePhrase: context.datePhrase,
  });
  const faqs = buildDateLandingFaqs(dateKey, stats, context.datePhrase);
  const { quickLinks, relatedLinks } = buildDateLandingLinks(dateKey, stats);

  return (
    <EventLandingView
      h1={meta.h1}
      subtitle={editorial.subtitle}
      intro={editorial.intro}
      paragraphs={editorial.paragraphs}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: meta.h1 },
      ]}
      faqs={faqs}
      quickLinks={quickLinks}
      relatedLinks={[
        ...relatedLinks,
        ...weekendExploreLinks(3),
      ].filter(
        (link, index, list) =>
          list.findIndex((item) => item.href === link.href) === index,
      )}
      jsonLd={[
        collectionPageSchema({
          name: meta.h1,
          description: context.metaDescription,
          url: absoluteUrl(meta.path),
        }),
        eventsItemListSchema({
          name: meta.h1,
          path: meta.path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: meta.h1, path: meta.path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
