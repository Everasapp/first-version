import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CultureArticleView from "@/src/components/seo/CultureArticleView";
import CultureTownStubView from "@/src/components/seo/CultureTownStubView";
import { citiesInArea } from "@/src/data/cities";
import {
  citiesForCultureArea,
  CULTURE_HUB_PATH,
  cultureTownPath,
  findCultureArea,
  nearbyCities,
  provinceLabel,
} from "@/src/lib/seo/cultura-areas";
import {
  CULTURE_TOWNS,
  findCultureTown,
} from "@/src/lib/seo/cultura-towns";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { cityToSlug, findCityBySlug } from "@/src/lib/seo/paths";
import {
  articleSchema,
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { absoluteUrl, landingRobots } from "@/src/lib/seo/site";

type CulturaTownPageProps = {
  params: Promise<{ area: string; slug: string }>;
};

export function generateStaticParams() {
  return citiesInArea("Nord Sardegna").map((city) => ({
    area: "nord-sardegna",
    slug: cityToSlug(city.city),
  }));
}

export async function generateMetadata({
  params,
}: CulturaTownPageProps): Promise<Metadata> {
  const { area: areaSlug, slug } = await params;
  const area = findCultureArea(areaSlug);
  const city = findCityBySlug(slug);
  if (!area || !city || city.area !== area.name || !area.townPagesLive) {
    return {};
  }

  const article = findCultureTown(slug);
  if (article) {
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

  const { events } = await loadFilteredPublishedEvents({ city: city.city });
  const path = cultureTownPath(area.slug, slug);
  const title = `${city.city}: cultura ed eventi in ${area.name}`;
  const description = `${city.city} in ${area.name}: eventi in programma e scheda del comune in provincia di ${provinceLabel(city.province)}.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: landingRobots(events.length),
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EVERAS`,
      description,
    },
  };
}

export default async function CulturaTownPage({ params }: CulturaTownPageProps) {
  const { area: areaSlug, slug } = await params;
  const area = findCultureArea(areaSlug);
  const city = findCityBySlug(slug);
  if (!area || !city || city.area !== area.name || !area.townPagesLive) {
    notFound();
  }

  const article = findCultureTown(slug);
  const { events } = await loadFilteredPublishedEvents({ city: city.city });

  if (article) {
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
            { name: area.h1, path: area.path },
            { name: article.town, path: article.path },
          ]),
          faqPageSchema(article.faqs),
        ].filter((item): item is Record<string, unknown> => item != null)}
      />
    );
  }

  const areaCities = citiesForCultureArea(area);
  const nearby = nearbyCities(areaCities, city);
  const featured = CULTURE_TOWNS.filter((item) =>
    areaCities.some(
      (areaCity) =>
        areaCity.city.toLocaleLowerCase("it") ===
        item.town.toLocaleLowerCase("it"),
    ),
  );
  const path = cultureTownPath(area.slug, slug);
  const description = `${city.city} in ${area.name}: eventi in programma e scheda del comune in provincia di ${provinceLabel(city.province)}.`;

  return (
    <CultureTownStubView
      area={area}
      city={city}
      nearby={nearby}
      featured={featured}
      events={events}
      jsonLd={[
        collectionPageSchema({
          name: city.city,
          description,
          url: absoluteUrl(path),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Cultura sarda", path: CULTURE_HUB_PATH },
          { name: area.h1, path: area.path },
          { name: city.city, path },
        ]),
      ]}
    />
  );
}
