import type { City } from "@/src/data/cities";
import { areaToSlug, findCityByName } from "@/src/utils/nearby-city";

export type GeoArea = City["area"];

export type GeoSource =
  | "newsletter_city"
  | "municipality"
  | "province"
  | "none";

export type ResolvedGeo = {
  city: string | null;
  area: GeoArea | null;
  source: GeoSource;
};

function normalizeKey(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

const PROVINCE_TO_AREA: Record<string, GeoArea> = {
  ss: "Nord Sardegna",
  sassari: "Nord Sardegna",
  ot: "Nord Sardegna",
  "olbia-tempio": "Nord Sardegna",
  "olbia tempio": "Nord Sardegna",
  nu: "Centro Sardegna",
  nuoro: "Centro Sardegna",
  or: "Centro Sardegna",
  oristano: "Centro Sardegna",
  og: "Centro Sardegna",
  ogliastra: "Centro Sardegna",
  ca: "Sud Sardegna",
  cagliari: "Sud Sardegna",
  su: "Sud Sardegna",
  "sud sardegna": "Sud Sardegna",
  ci: "Sud Sardegna",
  vs: "Sud Sardegna",
};

export function areaFromProvince(
  province: string | null | undefined,
): GeoArea | null {
  if (!province?.trim()) return null;
  return PROVINCE_TO_AREA[normalizeKey(province)] ?? null;
}

export function resolveGeoPreference(input: {
  newsletterCity?: string | null;
  municipality?: string | null;
  province?: string | null;
}): ResolvedGeo {
  const newsletterCity = input.newsletterCity?.trim() || null;
  const municipality = input.municipality?.trim() || null;

  if (newsletterCity) {
    const city = findCityByName(newsletterCity);
    if (city) {
      return {
        city: city.city,
        area: city.area,
        source: "newsletter_city",
      };
    }
  }

  if (municipality) {
    const city = findCityByName(municipality);
    if (city) {
      return {
        city: city.city,
        area: city.area,
        source: "municipality",
      };
    }
  }

  const area = areaFromProvince(input.province);
  if (area) {
    return {
      city: newsletterCity || municipality,
      area,
      source: "province",
    };
  }

  return {
    city: newsletterCity || municipality,
    area: null,
    source: "none",
  };
}

export function areaExplorePath(area: GeoArea | null) {
  if (!area) return "/eventi?date=settimana";
  return `/eventi?area=${areaToSlug(area)}&date=settimana`;
}
