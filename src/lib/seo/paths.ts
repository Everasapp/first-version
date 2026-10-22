import { cities, type City } from "@/src/data/cities";
import { allCategories as categories, type Category } from "@/src/data/categories";
import { isLearningDiscipline } from "@/src/data/learning-disciplines";
import { createSlug } from "@/src/lib/slug";

export function cityToSlug(cityName: string) {
  return createSlug(cityName);
}

export function findCityBySlug(slug: string): City | undefined {
  const needle = createSlug(slug);
  return cities.find((city) => cityToSlug(city.city) === needle);
}

export function findCategoryBySlug(slug: string): Category | undefined {
  const needle = createSlug(slug);
  if (needle === "spettacoli") {
    return categories.find((category) => category.slug === "musica-concerti");
  }
  return categories.find((category) => category.slug === needle);
}

/** Reserved path segments under /eventi that are never event slugs. */
export function isReservedEventPathSegment(slug: string) {
  return Boolean(findCityBySlug(slug) || findCategoryBySlug(slug));
}

export function cityEventsPath(cityName: string) {
  return `/eventi/${cityToSlug(cityName)}`;
}

export function categoryEventsPath(categorySlug: string) {
  if (isLearningDiscipline(categorySlug)) return `/imparare-e-fare-in-sardegna?disciplina=${encodeURIComponent(categorySlug)}#ricerca`;
  return `/eventi/${categorySlug}`;
}

/** Hubs that still resolve. Legacy concert and festival indexes do not. */
export function publicCategoryHref(categorySlug: string | null | undefined): string | null {
  if (!categorySlug) return null;
  if (isLearningDiscipline(categorySlug) || categorySlug === "workshop-corsi") {
    return categoryEventsPath(categorySlug);
  }
  return null;
}

export function cityCategoryEventsPath(cityName: string, categorySlug: string) {
  if (isLearningDiscipline(categorySlug)) return `/imparare-e-fare-in-sardegna?city=${encodeURIComponent(cityName)}&disciplina=${encodeURIComponent(categorySlug)}#ricerca`;
  return `/eventi/${cityToSlug(cityName)}/${categorySlug}`;
}
