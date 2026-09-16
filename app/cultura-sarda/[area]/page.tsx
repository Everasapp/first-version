import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CultureAreaView from "@/src/components/seo/CultureAreaView";
import {
  citiesForCultureArea,
  CULTURE_AREAS,
  CULTURE_HUB_PATH,
  findCultureArea,
} from "@/src/lib/seo/cultura-areas";
import { CULTURE_TOWNS } from "@/src/lib/seo/cultura-towns";
import { NORD_REMAINING_CULTURE_TOWNS } from "@/src/lib/seo/cultura-nord-remaining";
import {
  CENTRO_CULTURE_TOWNS,
  CENTRO_FEATURED_CULTURE_SLUGS,
  CENTRO_FEATURED_SLUG_SET,
} from "@/src/lib/seo/cultura-centro-towns";
import {
  SUD_CULTURE_TOWNS,
  SUD_FEATURED_CULTURE_SLUGS,
  SUD_FEATURED_SLUG_SET,
} from "@/src/lib/seo/cultura-sud-towns";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";

type CulturaAreaPageProps = {
  params: Promise<{ area: string }>;
};

const DIRECTORY_TOWN_SLUGS = new Set([
  ...NORD_REMAINING_CULTURE_TOWNS.map((article) => article.slug),
  ...CENTRO_CULTURE_TOWNS.filter(
    (article) => !CENTRO_FEATURED_SLUG_SET.has(article.slug),
  ).map((article) => article.slug),
  ...SUD_CULTURE_TOWNS.filter(
    (article) => !SUD_FEATURED_SLUG_SET.has(article.slug),
  ).map((article) => article.slug),
]);

export function generateStaticParams() {
  return CULTURE_AREAS.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({
  params,
}: CulturaAreaPageProps): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const area = findCultureArea(areaSlug);
  if (!area) {
    return {};
  }

  const ogImage = {
    url: area.image,
    alt: area.imageAlt,
  };

  return {
    title: area.title,
    description: area.description,
    alternates: { canonical: area.path },
    openGraph: {
      title: `${area.title} | EVERAS`,
      description: area.description,
      url: area.path,
      type: "website",
      images: [ogImage, ...defaultOgImages()],
    },
    twitter: {
      card: "summary_large_image",
      title: `${area.title} | EVERAS`,
      description: area.description,
      images: [ogImage.url],
    },
  };
}

export default async function CulturaAreaPage({ params }: CulturaAreaPageProps) {
  const { area: areaSlug } = await params;
  const area = findCultureArea(areaSlug);
  if (!area) {
    notFound();
  }

  const cities = citiesForCultureArea(area);
  // Schede “in evidenza”: Nord editoriali; Centro/Sud = liste curate da 18.
  const featured = (
    area.slug === "centro-sardegna"
      ? CENTRO_FEATURED_CULTURE_SLUGS.map(
          (slug) => CULTURE_TOWNS.find((article) => article.slug === slug),
        )
      : area.slug === "sud-sardegna"
        ? SUD_FEATURED_CULTURE_SLUGS.map(
            (slug) => CULTURE_TOWNS.find((article) => article.slug === slug),
          )
        : CULTURE_TOWNS.filter((article) => {
            if (DIRECTORY_TOWN_SLUGS.has(article.slug)) return false;
            return cities.some(
              (city) =>
                city.city.toLocaleLowerCase("it") ===
                article.town.toLocaleLowerCase("it"),
            );
          })
  ).filter((article): article is NonNullable<typeof article> => Boolean(article));

  return (
    <CultureAreaView
      area={area}
      cities={cities}
      featured={featured}
      jsonLd={[
        collectionPageSchema({
          name: area.h1,
          description: area.description,
          url: absoluteUrl(area.path),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Scopri la Sardegna", path: CULTURE_HUB_PATH },
          { name: area.h1, path: area.path },
        ]),
        faqPageSchema(area.faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
