import { categories } from "@/src/data/categories";
import {
  CALENDAR_YEAR_MIN,
  currentMonthLanding,
  currentYearLanding,
  monthLanding,
} from "@/src/lib/seo/calendar";
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
  return temporalExploreLinks(excludeHref);
}

/**
 * Anchor text descrittivi per il cluster temporale (CTR + chiarezza intent).
 * Non include landing tipicamente noindex a zero eventi: i link puntano a hub evergreen.
 */
export function temporalExploreLinks(excludeHref?: string): LandingLink[] {
  const month = currentMonthLanding();
  const year = currentYearLanding();
  return dedupeLinks(
    [
      {
        href: "/eventi-oggi",
        label: "Eventi Sardegna oggi",
      },
      {
        href: "/eventi-domani",
        label: "Eventi Sardegna domani",
      },
      {
        href: "/eventi-weekend",
        label: "Eventi Sardegna questo weekend",
      },
      {
        href: "/eventi-domenica",
        label: "Eventi Sardegna domenica",
      },
      {
        href: "/eventi-sud-sardegna-oggi",
        label: "Eventi Sud Sardegna oggi",
      },
      {
        href: month.path,
        label: month.title,
      },
      {
        href: year.path,
        label: year.title,
      },
      {
        href: "/eventi-gratuiti",
        label: "Eventi gratuiti in Sardegna",
      },
      {
        href: "/eventi-sardegna",
        label: "Calendario eventi in Sardegna",
      },
      {
        href: "/eventi-sardegna/sagre",
        label: "Sagre in Sardegna",
      },
      {
        href: "/eventi/musica-concerti",
        label: "Concerti e spettacoli in Sardegna",
      },
      {
        href: "/eventi",
        label: "Cerca e filtra tutti gli eventi",
      },
    ].filter((link) => link.href !== excludeHref),
  );
}


export type EventContextLinkInput = {
  municipality: string;
  categorySlug: string;
  categoryLabel: string;
  startAt: string;
};

function eventMonthLink(startAt: string, from: Date): LandingLink | null {
  const eventDate = new Date(startAt);
  if (Number.isNaN(eventDate.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(eventDate);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const currentYear = currentMonthLanding(from).year;

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    year < CALENDAR_YEAR_MIN ||
    year > currentYear + 1
  ) {
    return null;
  }

  const landing = monthLanding(year, month - 1);
  return { href: landing.path, label: landing.title };
}

/**
 * Link contestuali dalle schede evento alle landing SEO stabili.
 * Usa solo URL canonici e la data civile Europe/Rome dell'evento.
 */
export function eventContextLinks(
  input: EventContextLinkInput,
  from = new Date(),
): LandingLink[] {
  const month = eventMonthLink(input.startAt, from);
  const categoryLabel = /sardegna/i.test(input.categoryLabel)
    ? input.categoryLabel
    : `${input.categoryLabel} in Sardegna`;

  return dedupeLinks(
    [
      {
        href: cityEventsPath(input.municipality),
        label: `Eventi a ${input.municipality}`,
      },
      {
        href: categoryEventsPath(input.categorySlug),
        label: categoryLabel,
      },
      month,
      {
        href: "/eventi-weekend",
        label: "Eventi Sardegna questo weekend",
      },
      {
        href: "/eventi-sardegna",
        label: "Tutti gli eventi in Sardegna",
      },
    ].filter((link): link is LandingLink => link !== null),
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
): {
  quickLinks: LandingLink[];
  relatedCityLinks: LandingLink[];
  relatedCategoryLinks: LandingLink[];
} {
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
