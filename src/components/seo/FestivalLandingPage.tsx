import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { sagreExploreLinks } from "@/src/lib/seo/calendar";
import {
  festivalHubLinks,
  type FestivalHub,
} from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";

export function buildFestivalLandingMetadata(hub: FestivalHub): Metadata {
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: hub.path },
    openGraph: {
      title: `${hub.title} | EVERAS`,
      description: hub.description,
      url: hub.path,
      type: "website",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${hub.title} | EVERAS`,
      description: hub.description,
      images: defaultOgImages().map((image) => image.url),
    },
  };
}

export default async function FestivalLandingPage({ hub }: { hub: FestivalHub }) {
  const { events, error } = await loadFilteredPublishedEvents({
    titleIncludes: hub.titleIncludes,
  });

  return (
    <EventLandingView
      eyebrow="Feste e sagre"
      h1={hub.h1}
      intro={hub.description}
      paragraphs={hub.paragraphs}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi e sagre", href: "/eventi-sardegna" },
        { name: hub.h1 },
      ]}
      faqs={hub.faqs}
      relatedLinks={[
        ...sagreExploreLinks(),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
      ].filter((link) => link.href !== hub.path)}
      jsonLd={[
        collectionPageSchema({
          name: hub.h1,
          description: hub.description,
          url: absoluteUrl(hub.path),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi e sagre", path: "/eventi-sardegna" },
          { name: hub.h1, path: hub.path },
        ]),
        faqPageSchema(hub.faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
