import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CultureArticleView from "@/src/components/seo/CultureArticleView";
import {
  CULTURE_HUB_PATH,
  CULTURE_TOWNS,
  findCultureTown,
} from "@/src/lib/seo/cultura-towns";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  articleSchema,
  breadcrumbListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

type CulturaTownPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CULTURE_TOWNS.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: CulturaTownPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findCultureTown(slug);
  if (!article) {
    return {};
  }

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

export default async function CulturaTownPage({ params }: CulturaTownPageProps) {
  const { slug } = await params;
  const article = findCultureTown(slug);
  if (!article) {
    notFound();
  }

  const { events } = await loadFilteredPublishedEvents({ city: article.town });

  return (
    <CultureArticleView
      article={article}
      events={events}
      jsonLd={[
        articleSchema({
          headline: article.title,
          description: article.description,
          url: absoluteUrl(article.path),
          imageUrl: article.hero.src,
          datePublished: article.publishedAt,
          aboutName: article.town,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Cultura sarda", path: CULTURE_HUB_PATH },
          { name: article.town, path: article.path },
        ]),
        faqPageSchema(article.faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
