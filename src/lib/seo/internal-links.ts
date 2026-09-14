import { categories } from "@/src/data/categories";
import { currentMonthLanding } from "@/src/lib/seo/calendar";
import type { LandingLink, LandingStats } from "@/src/lib/seo/landing-copy";
import {
  categoryEventsPath,
  cityCategoryEventsPath,
  cityEventsPath,
} from "@/src/lib/seo/paths";

export function dedupeLinks(links: LandingLink[]): LandingLink[] {
  return links.filter(
    (link, index, list) =>
      list.findIndex((item) => item.href === link.href) === index,
  );
}

/** Hub temporali e calendario — sempre sicuri da linkare. */
export function coreDateLinks(excludeHref?: string): LandingLink[] {
  const month = currentMonthLanding();
  return dedupeLinks(
    [
      { href: "/eventi-oggi", label: "Eventi oggi" },
      { href: "/eventi-domani", label: "Eventi domani" },
      { href: "/eventi-weekend", label: "Eventi weekend" },
      { href: "/eventi-gratuiti", label: "Eventi gratuiti" },
      { href: month.path, label: `Eventi ${month.name} ${month.year}` },
      { href: "/eventi-sardegna", label: "Calendario eventi Sardegna" },
      { href: "/eventi", label: "Tutti gli eventi" },
      { href: "/categorie", label: "Categorie" },
    ].filter((link) => link.href !== excludeHref),
  );
}

/**
 * Link da stats reali: solo città/categorie presenti nella selezione eventi.
 * Evita link a pagine “vuote” di densità zero in quel contesto.
 */
export function linksFromLandingStats(
  stats: LandingStats,
  options: {
    maxCities?: number;
    maxCategories?: number;
    /** Se impostato, i chip città puntano a /eventi/{city}/{category}. */
    categorySlugForCities?: string;
    /** Se impostato, i chip categoria puntano a /eventi/{city}/{category}. */
    cityNameForCategories?: string;
  } = {},
): { quickLinks: LandingLink[]; relatedCityLinks: LandingLink[]; relatedCategoryLinks: LandingLink[] } {
  const maxCities = options.maxCities ?? 5;
  const maxCategories = options.maxCategories ?? 5;

  const cityQuick = stats.topCities.slice(0, maxCities).map((city) => ({
    href: options.categorySlugForCities
      ? cityCategoryEventsPath(city.name, options.categorySlugForCities)
      : cityEventsPath(city.name),
    label: city.name,
  }));

  const categoryQuick = stats.topCategories
    .slice(0, maxCategories)
    .map((category) => ({
      href: options.cityNameForCategories
        ? cityCategoryEventsPath(options.cityNameForCategories, category.slug)
        : categoryEventsPath(category.slug),
      label: category.name,
    }));

  const relatedCityLinks = stats.topCities.slice(0, maxCities).map((city) => ({
    href: cityEventsPath(city.name),
    label: `Eventi a ${city.name}`,
  }));

  const relatedCategoryLinks =
    stats.topCategories.length > 0
      ? stats.topCategories.slice(0, maxCategories).map((category) => ({
          href: categoryEventsPath(category.slug),
          label: category.name,
        }))
      : categories.slice(0, 4).map((category) => ({
          href: categoryEventsPath(category.slug),
          label: category.name,
        }));

  return {
    quickLinks: dedupeLinks([...cityQuick, ...categoryQuick]),
    relatedCityLinks: dedupeLinks(relatedCityLinks),
    relatedCategoryLinks: dedupeLinks(relatedCategoryLinks),
  };
}
