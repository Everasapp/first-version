import type { Metadata } from "next";

import CulturaArticlesHubView from "@/src/components/seo/CulturaArticlesHubView";
import {
  CULTURA_ARTICLES,
  CULTURA_ARTICLES_HUB,
  CULTURA_ARTICLES_HUB_PATH,
} from "@/src/lib/seo/cultura-articles";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
} from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: CULTURA_ARTICLES_HUB.title,
  description: CULTURA_ARTICLES_HUB.description,
  alternates: { canonical: CULTURA_ARTICLES_HUB.path },
  openGraph: {
    title: `${CULTURA_ARTICLES_HUB.title} | EVERAS`,
    description: CULTURA_ARTICLES_HUB.description,
    url: CULTURA_ARTICLES_HUB.path,
    type: "website",
    images: [
      {
        url: "/images/cultura/cultura-sarda-tradizioni-hero.webp",
        width: 1600,
        height: 1067,
        alt: "Cultura sarda: storia, tradizioni e identità",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CULTURA_ARTICLES_HUB.title} | EVERAS`,
    description: CULTURA_ARTICLES_HUB.description,
    images: ["/images/cultura/cultura-sarda-tradizioni-hero.webp"],
  },
};

export default async function CulturaPage() {
  let events: Awaited<
    ReturnType<typeof loadFilteredPublishedEvents>
  >["events"] = [];
  try {
    const loaded = await loadFilteredPublishedEvents({
      categorySlug: "sagre-tradizioni",
    });
    events = loaded.events;
  } catch {
    events = [];
  }
  const otherArticles = CULTURA_ARTICLES.filter(
    (article) => article.kind !== "guide",
  );

  return (
    <CulturaArticlesHubView
      events={events.slice(0, 9)}
      otherArticles={otherArticles}
      jsonLd={[
        collectionPageSchema({
          name: CULTURA_ARTICLES_HUB.h1,
          description: CULTURA_ARTICLES_HUB.description,
          url: absoluteUrl(CULTURA_ARTICLES_HUB_PATH),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Cultura sarda", path: CULTURA_ARTICLES_HUB_PATH },
        ]),
      ]}
    />
  );
}

