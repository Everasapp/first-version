import { cities, type City } from "@/src/data/cities";
import { stripHtml } from "@/src/lib/sanitizeHtml";

/** Coordinate approssimative dei comuni (centro abitato) per «Vicino a me». */
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Alghero: { lat: 40.5589, lng: 8.3193 },
  Arzachena: { lat: 41.0806, lng: 9.3873 },
  Budoni: { lat: 40.7078, lng: 9.7031 },
  Castelsardo: { lat: 40.9144, lng: 8.7136 },
  "Golfo Aranci": { lat: 41.0075, lng: 9.6155 },
  "La Maddalena": { lat: 41.2133, lng: 9.405 },
  Olbia: { lat: 40.9234, lng: 9.498 },
  Palau: { lat: 41.1803, lng: 9.3814 },
  "Porto Torres": { lat: 40.8353, lng: 8.405 },
  "San Teodoro": { lat: 40.7711, lng: 9.6711 },
  "Santa Teresa Gallura": { lat: 41.2386, lng: 9.1888 },
  Sassari: { lat: 40.7259, lng: 8.5557 },
  Sorso: { lat: 40.7994, lng: 8.5757 },
  Stintino: { lat: 40.9389, lng: 8.2289 },
  "Tempio Pausania": { lat: 40.9006, lng: 9.1047 },
  Torralba: { lat: 40.514, lng: 8.7663 },
  Bosa: { lat: 40.2992, lng: 8.4983 },
  Dorgali: { lat: 40.2925, lng: 9.5911 },
  Fonni: { lat: 40.1192, lng: 9.2522 },
  Macomer: { lat: 40.2667, lng: 8.7833 },
  Nuoro: { lat: 40.3211, lng: 9.3297 },
  Orgosolo: { lat: 40.1925, lng: 9.3514 },
  Oristano: { lat: 39.9036, lng: 8.5919 },
  Orosei: { lat: 40.3786, lng: 9.6925 },
  Siniscola: { lat: 40.5734, lng: 9.697 },
  Tortolì: { lat: 39.9264, lng: 9.6556 },
  Cagliari: { lat: 39.2238, lng: 9.1217 },
  Carbonia: { lat: 39.1672, lng: 8.5222 },
  Carloforte: { lat: 39.145, lng: 8.3056 },
  Iglesias: { lat: 39.3106, lng: 8.535 },
  Pula: { lat: 39.0092, lng: 9.0011 },
  "Quartu Sant'Elena": { lat: 39.2294, lng: 9.1889 },
  "Sant'Antioco": { lat: 39.0653, lng: 8.4542 },
  Villasimius: { lat: 39.1436, lng: 9.5183 },
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

export function findNearestCity(lat: number, lng: number): City {
  let nearest = cities[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const city of cities) {
    const coords = cityCoordinates[city.city];

    if (!coords) {
      continue;
    }

    const km = distanceKm(lat, lng, coords.lat, coords.lng);

    if (km < minDistance) {
      minDistance = km;
      nearest = city;
    }
  }

  return nearest;
}

function findCityByName(municipality: string | null | undefined) {
  if (!municipality?.trim()) return null;

  return (
    cities.find(
      (city) =>
        city.city.localeCompare(municipality, "it", {
          sensitivity: "base",
        }) === 0,
    ) ?? null
  );
}

export function distanceToMunicipalityKm(
  lat: number,
  lng: number,
  municipality: string | null | undefined,
) {
  const city = findCityByName(municipality);
  if (!city) return null;

  const coords = cityCoordinates[city.city];
  if (!coords) return null;

  return distanceKm(lat, lng, coords.lat, coords.lng);
}

/** Ordina gli eventi dal più vicino al più lontano (poi per data). */
export function sortEventsByProximity<
  T extends { municipality?: string; startDate?: string },
>(events: T[], lat: number, lng: number): T[] {
  return [...events].sort((a, b) => {
    const distanceA =
      distanceToMunicipalityKm(lat, lng, a.municipality) ??
      Number.POSITIVE_INFINITY;
    const distanceB =
      distanceToMunicipalityKm(lat, lng, b.municipality) ??
      Number.POSITIVE_INFINITY;

    if (distanceA !== distanceB) {
      return distanceA - distanceB;
    }

    const startA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const startB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return startA - startB;
  });
}

export function areaToSlug(area: City["area"]) {
  switch (area) {
    case "Nord Sardegna":
      return "nord-sardegna";
    case "Centro Sardegna":
      return "centro-sardegna";
    case "Sud Sardegna":
      return "sud-sardegna";
    default:
      return "";
  }
}

export function eventMatchesQuery(
  event: {
    title: string;
    description: string | null;
    category: string | null;
    municipality: string | null;
    location_name: string | null;
  },
  query: string,
  categoryNameBySlug: Map<string, string>,
) {
  const normalized = query.trim().toLocaleLowerCase("it");

  if (!normalized) {
    return true;
  }

  const haystack = [
    event.title,
    event.description ? stripHtml(event.description) : null,
    event.municipality,
    event.location_name,
    event.category,
    event.category ? categoryNameBySlug.get(event.category) : null,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("it");

  return haystack.includes(normalized);
}
