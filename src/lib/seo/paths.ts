import { cities, type City } from "@/src/data/cities";
import { categories, type Category } from "@/src/data/categories";
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
  return `/eventi/${categorySlug}`;
}

export function cityCategoryEventsPath(cityName: string, categorySlug: string) {
  return `/eventi/${cityToSlug(cityName)}/${categorySlug}`;
}
