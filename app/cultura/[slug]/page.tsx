import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CulturaArticleView from "@/src/components/seo/CulturaArticleView";
import {
  CULTURA_ARTICLES,
  CULTURA_ARTICLES_HUB_PATH,
  findCulturaArticle,
} from "@/src/lib/seo/cultura-articles";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  articleSchema,
  breadcrumbListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

type CulturaArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CULTURA_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: CulturaArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findCulturaArticle(slug);
  if (!article) return {};

  const ogImage = {
    url: article.hero.src,
    width: 1600,
    height: 1067,
    alt: article.hero.alt,
    type: "image/webp" as const,
  };

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: article.path },
    openGraph: {
      title: `${article.title} | EVERAS`,
      description: article.description,
      url: article.path,
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | EVERAS`,
      description: article.description,
      images: [ogImage.url],
    },
  };
}

export default async function CulturaArticlePage({
  params,
}: CulturaArticlePageProps) {
  const { slug } = await params;
  const article = findCulturaArticle(slug);
  if (!article) notFound();

  const faqSchema = faqPageSchema(article.faqs);
  const events: Awaited<
    ReturnType<typeof loadFilteredPublishedEvents>
  >["events"] = [];
  const seen = new Set<string>();

  const eventQueries: Array<
    Promise<Awaited<ReturnType<typeof loadFilteredPublishedEvents>>>
  > = [];

  if (article.relatedEventSlugs && article.relatedEventSlugs.length > 0) {
    eventQueries.push(
      loadFilteredPublishedEvents({
        slugs: article.relatedEventSlugs,
        includeExpired: true,
      }),
    );
  }

  for (const categorySlug of article.relatedCategorySlugs ?? []) {
    eventQueries.push(loadFilteredPublishedEvents({ categorySlug }));
  }

  if (eventQueries.length > 0) {
    try {
      const loaded = await Promise.all(eventQueries);
      for (const batch of loaded) {
        for (const event of batch.events) {
          if (seen.has(event.eventId)) continue;
          seen.add(event.eventId);
          events.push(event);
        }
      }
    } catch {
      events.length = 0;
    }
  }

  return (
    <CulturaArticleView
      article={article}
      events={events.slice(0, 9)}
      jsonLd={[
        articleSchema({
          headline: article.title,
          description: article.description,
          url: absoluteUrl(article.path),
          imageUrl: article.hero.src,
          datePublished: article.publishedAt,
          aboutName: "Sardegna",
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Cultura sarda", path: CULTURA_ARTICLES_HUB_PATH },
          { name: article.h1, path: article.path },
        ]),
        ...(faqSchema ? [faqSchema] : []),
      ]}
    />
  );
}
