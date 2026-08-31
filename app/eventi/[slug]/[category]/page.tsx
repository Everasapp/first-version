import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CityCategoryLandingPage,
  buildCityCategoryLandingMetadata,
} from "@/src/components/seo/GeoCategoryLandings";
import { findCategoryBySlug, findCityBySlug } from "@/src/lib/seo/paths";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";

type CityCategoryPageProps = {
  params: Promise<{
    slug: string;
    category: string;
  }>;
};

export async function generateMetadata({
  params,
}: CityCategoryPageProps): Promise<Metadata> {
  const { slug, category: categorySlug } = await params;
  const city = findCityBySlug(slug);
  const category = findCategoryBySlug(categorySlug);

  if (!city || !category) {
    return {
      title: "Pagina non trovata",
      robots: { index: false, follow: false },
    };
  }

  const { events } = await loadFilteredPublishedEvents({
    city: city.city,
    categorySlug: category.slug,
  });

  return buildCityCategoryLandingMetadata(city, category, events.length);
}

export default async function CityCategoryPage({
  params,
}: CityCategoryPageProps) {
  const { slug, category: categorySlug } = await params;
  const city = findCityBySlug(slug);
  const category = findCategoryBySlug(categorySlug);

  if (!city || !category) {
    notFound();
  }

  return <CityCategoryLandingPage city={city} category={category} />;
}
