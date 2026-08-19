import { cities, type City } from "@/src/data/cities";
import { resolveCategoryLabels } from "@/src/lib/event-categories";
import { stripHtml } from "@/src/lib/sanitizeHtml";

/** Coordinate approssimative dei comuni (centro abitato) per «Vicino a me». */
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // Nord — principali e capoluoghi di zona
  Aggius: { lat: 40.9297, lng: 9.0653 },
  Aglientu: { lat: 41.0794, lng: 9.1006 },
  "Alà dei Sardi": { lat: 40.65, lng: 9.3281 },
  Alghero: { lat: 40.5589, lng: 8.3193 },
  Anela: { lat: 40.4419, lng: 9.0575 },
  Ardara: { lat: 40.6244, lng: 8.8106 },
  Arzachena: { lat: 41.0806, lng: 9.3873 },
  Badesi: { lat: 40.965, lng: 8.8842 },
  Banari: { lat: 40.5703, lng: 8.7006 },
  Benetutti: { lat: 40.4564, lng: 9.1681 },
  Berchidda: { lat: 40.7853, lng: 9.1647 },
  Bessude: { lat: 40.5536, lng: 8.725 },
  Bonnanaro: { lat: 40.5331, lng: 8.7642 },
  Bono: { lat: 40.4153, lng: 9.0292 },
  Bonorva: { lat: 40.4181, lng: 8.7681 },
  Bortigiadas: { lat: 40.8925, lng: 9.0481 },
  Borutta: { lat: 40.5225, lng: 8.7431 },
  Bottidda: { lat: 40.3919, lng: 9.0092 },
  Buddusò: { lat: 40.5781, lng: 9.2581 },
  Budoni: { lat: 40.7078, lng: 9.7031 },
  Bultei: { lat: 40.4569, lng: 9.0656 },
  Bulzi: { lat: 40.8972, lng: 8.8306 },
  Burgos: { lat: 40.3906, lng: 8.995 },
  Calangianus: { lat: 40.9211, lng: 9.1947 },
  Cargeghe: { lat: 40.6689, lng: 8.6142 },
  Castelsardo: { lat: 40.9144, lng: 8.7136 },
  Cheremule: { lat: 40.5069, lng: 8.7256 },
  Chiaramonti: { lat: 40.7489, lng: 8.8192 },
  Codrongianos: { lat: 40.6569, lng: 8.6811 },
  Cossoine: { lat: 40.4306, lng: 8.7156 },
  Erula: { lat: 40.7925, lng: 8.9411 },
  Esporlatu: { lat: 40.3856, lng: 8.9906 },
  Florinas: { lat: 40.6506, lng: 8.6369 },
  Giave: { lat: 40.4519, lng: 8.7511 },
  "Golfo Aranci": { lat: 41.0075, lng: 9.6155 },
  Illorai: { lat: 40.3569, lng: 9.0025 },
  "Isola dell'Asinara": { lat: 41.0611, lng: 8.2656 },
  Ittireddu: { lat: 40.5436, lng: 8.9011 },
  Ittiri: { lat: 40.5919, lng: 8.5681 },
  "La Maddalena": { lat: 41.2133, lng: 9.405 },
  Laerru: { lat: 40.8469, lng: 8.8342 },
  "Loiri Porto San Paolo": { lat: 40.8431, lng: 9.4975 },
  Luogosanto: { lat: 41.0519, lng: 9.205 },
  Luras: { lat: 40.9356, lng: 9.1756 },
  Mara: { lat: 40.4097, lng: 8.6381 },
  Martis: { lat: 40.7781, lng: 8.8081 },
  "Monteleone Rocca Doria": { lat: 40.4719, lng: 8.5606 },
  Monti: { lat: 40.8069, lng: 9.3256 },
  Mores: { lat: 40.5481, lng: 8.8311 },
  Muros: { lat: 40.6781, lng: 8.6169 },
  "Nughedu San Nicolò": { lat: 40.5569, lng: 9.0211 },
  Nule: { lat: 40.5056, lng: 9.1906 },
  Nulvi: { lat: 40.7856, lng: 8.7431 },
  Olbia: { lat: 40.9234, lng: 9.498 },
  Olmedo: { lat: 40.6519, lng: 8.3806 },
  Oschiri: { lat: 40.7181, lng: 9.1006 },
  Osilo: { lat: 40.7436, lng: 8.6711 },
  Ossi: { lat: 40.6769, lng: 8.5911 },
  Ozieri: { lat: 40.5856, lng: 9.0011 },
  Padria: { lat: 40.3956, lng: 8.6331 },
  Padru: { lat: 40.7669, lng: 9.5211 },
  Palau: { lat: 41.1803, lng: 9.3814 },
  Pattada: { lat: 40.5819, lng: 9.1125 },
  Perfugas: { lat: 40.8331, lng: 8.8842 },
  Ploaghe: { lat: 40.6656, lng: 8.7411 },
  "Porto Torres": { lat: 40.8353, lng: 8.405 },
  Pozzomaggiore: { lat: 40.3981, lng: 8.66 },
  Putifigari: { lat: 40.5619, lng: 8.4606 },
  Romana: { lat: 40.4831, lng: 8.5256 },
  "San Teodoro": { lat: 40.7711, lng: 9.6711 },
  "Sant'Antonio di Gallura": { lat: 40.9919, lng: 9.3011 },
  "Santa Maria Coghinas": { lat: 40.9031, lng: 8.8681 },
  "Santa Teresa Gallura": { lat: 41.2386, lng: 9.1888 },
  Sassari: { lat: 40.7259, lng: 8.5557 },
  Sedini: { lat: 40.8519, lng: 8.8156 },
  Semestene: { lat: 40.3981, lng: 8.7256 },
  Sennori: { lat: 40.7881, lng: 8.5931 },
  Siligo: { lat: 40.5756, lng: 8.7281 },
  Sorso: { lat: 40.7994, lng: 8.5757 },
  Stintino: { lat: 40.9389, lng: 8.2289 },
  Telti: { lat: 40.8769, lng: 9.3531 },
  "Tempio Pausania": { lat: 40.9006, lng: 9.1047 },
  Tergu: { lat: 40.8669, lng: 8.7181 },
  Thiesi: { lat: 40.5256, lng: 8.7169 },
  Tissi: { lat: 40.6781, lng: 8.5681 },
  Torralba: { lat: 40.514, lng: 8.7663 },
  "Trinità d'Agultu e Vignola": { lat: 40.9836, lng: 8.9156 },
  Tula: { lat: 40.7319, lng: 8.9831 },
  Uri: { lat: 40.6381, lng: 8.4881 },
  Usini: { lat: 40.6631, lng: 8.5406 },
  Valledoria: { lat: 40.9281, lng: 8.8642 },
  Viddalba: { lat: 40.9119, lng: 8.8969 },
  "Villanova Monteleone": { lat: 40.5031, lng: 8.4706 },

  // Centro
  Aritzo: { lat: 39.9578, lng: 9.1975 },
  Atzara: { lat: 39.9917, lng: 9.0764 },
  Austis: { lat: 40.0714, lng: 9.1203 },
  Belvì: { lat: 39.9608, lng: 9.1856 },
  Bitti: { lat: 40.4794, lng: 9.3819 },
  Bosa: { lat: 40.2992, lng: 8.4983 },
  Desulo: { lat: 40.0136, lng: 9.2264 },
  Dorgali: { lat: 40.2925, lng: 9.5911 },
  Fonni: { lat: 40.1192, lng: 9.2522 },
  Gadoni: { lat: 39.9136, lng: 9.1089 },
  Gavoi: { lat: 40.1619, lng: 9.1947 },
  Lanusei: { lat: 39.8789, lng: 9.5414 },
  Lodine: { lat: 40.1497, lng: 9.2186 },
  Lollove: { lat: 40.2794, lng: 9.3828 },
  Lula: { lat: 40.4706, lng: 9.4869 },
  Macomer: { lat: 40.2667, lng: 8.7833 },
  Mamoiada: { lat: 40.2142, lng: 9.2814 },
  "Meana Sardo": { lat: 39.9453, lng: 9.0706 },
  Nuoro: { lat: 40.3211, lng: 9.3297 },
  Oliena: { lat: 40.2711, lng: 9.4028 },
  Ollolai: { lat: 40.1689, lng: 9.1792 },
  Olzai: { lat: 40.1836, lng: 9.1486 },
  Onanì: { lat: 40.4853, lng: 9.4431 },
  Oniferi: { lat: 40.2731, lng: 9.1714 },
  Orani: { lat: 40.2506, lng: 9.1775 },
  Orgosolo: { lat: 40.1925, lng: 9.3514 },
  Oristano: { lat: 39.9036, lng: 8.5919 },
  Orosei: { lat: 40.3786, lng: 9.6925 },
  Orotelli: { lat: 40.3042, lng: 9.1192 },
  Ortueri: { lat: 40.0361, lng: 8.9864 },
  Orune: { lat: 40.4072, lng: 9.3692 },
  Ottana: { lat: 40.2336, lng: 9.0786 },
  Ovodda: { lat: 40.0953, lng: 9.1614 },
  "Santa Maria Navarrese": { lat: 39.9906, lng: 9.6903 },
  Sarule: { lat: 40.2286, lng: 9.1664 },
  Siniscola: { lat: 40.5734, lng: 9.697 },
  Sorgono: { lat: 40.0264, lng: 9.1031 },
  Tiana: { lat: 40.0681, lng: 9.1486 },
  Tonara: { lat: 40.0247, lng: 9.1714 },
  Tortolì: { lat: 39.9264, lng: 9.6556 },

  // Sud — Città metropolitana di Cagliari
  Armungia: { lat: 39.5217, lng: 9.3818 },
  Assemini: { lat: 39.2915, lng: 9.0015 },
  Ballao: { lat: 39.5497, lng: 9.3615 },
  Barrali: { lat: 39.4753, lng: 9.1013 },
  Burcei: { lat: 39.3426, lng: 9.3595 },
  Cagliari: { lat: 39.2238, lng: 9.1217 },
  Capoterra: { lat: 39.1753, lng: 8.972 },
  Castiadas: { lat: 39.2364, lng: 9.4993 },
  Decimomannu: { lat: 39.3117, lng: 8.9688 },
  Decimoputzu: { lat: 39.3352, lng: 8.9152 },
  Dolianova: { lat: 39.3782, lng: 9.1786 },
  "Domus de Maria": { lat: 38.944, lng: 8.8635 },
  Donori: { lat: 39.4318, lng: 9.1272 },
  Elmas: { lat: 39.2681, lng: 9.0496 },
  Escalaplano: { lat: 39.6266, lng: 9.3571 },
  Escolca: { lat: 39.6984, lng: 9.1215 },
  Esterzili: { lat: 39.7791, lng: 9.2847 },
  Genoni: { lat: 39.7946, lng: 9.008 },
  Gergei: { lat: 39.6996, lng: 9.1004 },
  Gesico: { lat: 39.6163, lng: 9.1065 },
  Goni: { lat: 39.5781, lng: 9.2859 },
  Guamaggiore: { lat: 39.5686, lng: 9.074 },
  Guasila: { lat: 39.5618, lng: 9.0454 },
  Isili: { lat: 39.7404, lng: 9.1086 },
  Mandas: { lat: 39.6563, lng: 9.1298 },
  Maracalagonis: { lat: 39.2853, lng: 9.2294 },
  Monastir: { lat: 39.3847, lng: 9.0448 },
  Monserrato: { lat: 39.2539, lng: 9.1432 },
  Muravera: { lat: 39.4209, lng: 9.5736 },
  Nuragus: { lat: 39.7762, lng: 9.0381 },
  Nurallao: { lat: 39.7903, lng: 9.0807 },
  Nuraminis: { lat: 39.4429, lng: 9.0147 },
  Nurri: { lat: 39.712, lng: 9.2298 },
  Orroli: { lat: 39.6935, lng: 9.2503 },
  Ortacesus: { lat: 39.5391, lng: 9.0835 },
  Pimentel: { lat: 39.4855, lng: 9.0655 },
  Pula: { lat: 39.0092, lng: 9.0011 },
  "Quartu Sant'Elena": { lat: 39.2294, lng: 9.1889 },
  Quartucciu: { lat: 39.2541, lng: 9.1788 },
  Sadali: { lat: 39.8132, lng: 9.2719 },
  Samatzai: { lat: 39.4832, lng: 9.0346 },
  "San Basilio": { lat: 39.5371, lng: 9.1982 },
  "San Nicolò Gerrei": { lat: 39.4974, lng: 9.3071 },
  "San Sperate": { lat: 39.3587, lng: 9.0067 },
  "San Vito": { lat: 39.4432, lng: 9.5408 },
  "Sant'Andrea Frius": { lat: 39.4779, lng: 9.1703 },
  Sarroch: { lat: 39.0656, lng: 9.0108 },
  Selargius: { lat: 39.257, lng: 9.1676 },
  Selegas: { lat: 39.5678, lng: 9.1041 },
  Senorbì: { lat: 39.535, lng: 9.1301 },
  Serdiana: { lat: 39.3742, lng: 9.1589 },
  Serri: { lat: 39.7017, lng: 9.1441 },
  Sestu: { lat: 39.2999, lng: 9.0926 },
  Seulo: { lat: 39.8072, lng: 9.2364 },
  "Settimo San Pietro": { lat: 39.2917, lng: 9.1851 },
  Siliqua: { lat: 39.3002, lng: 8.8087 },
  Silius: { lat: 39.5167, lng: 9.2935 },
  Sinnai: { lat: 39.3042, lng: 9.2035 },
  "Siurgus Donigala": { lat: 39.6003, lng: 9.189 },
  Soleminis: { lat: 39.348, lng: 9.1817 },
  Suelli: { lat: 39.5627, lng: 9.1321 },
  Ussana: { lat: 39.3946, lng: 9.0732 },
  Uta: { lat: 39.291, lng: 8.9543 },
  Vallermosa: { lat: 39.3644, lng: 8.7963 },
  "Villa San Pietro": { lat: 39.034, lng: 8.9955 },
  "Villanova Tulo": { lat: 39.7803, lng: 9.2132 },
  Villaputzu: { lat: 39.441, lng: 9.574 },
  Villasalto: { lat: 39.4921, lng: 9.393 },
  Villasimius: { lat: 39.1436, lng: 9.5183 },
  Villasor: { lat: 39.3804, lng: 8.9428 },
  Villaspeciosa: { lat: 39.3122, lng: 8.9251 },

  // Sulcis
  Carbonia: { lat: 39.1672, lng: 8.5222 },
  Carloforte: { lat: 39.145, lng: 8.3056 },
  Gonnesa: { lat: 39.2653, lng: 8.4711 },
  Iglesias: { lat: 39.3106, lng: 8.535 },
  "Sant'Antioco": { lat: 39.0653, lng: 8.4542 },
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

function normalizePlaceName(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function findCityByName(municipality: string | null | undefined) {
  if (!municipality?.trim()) return null;

  const needle = normalizePlaceName(municipality);

  const exact = cities.find(
    (city) => normalizePlaceName(city.city) === needle,
  );
  if (exact) return exact;

  // Match parziale (es. "Quartu Sant'Elena (CA)" / sottostringhe)
  return (
    cities.find((city) => {
      const name = normalizePlaceName(city.city);
      return needle.includes(name) || name.includes(needle);
    }) ?? null
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

type PlaceEvent = {
  municipality?: string;
  location?: string;
  startDate?: string;
};

function eventPlaceName(event: PlaceEvent) {
  return event.municipality || event.location || null;
}

/** Ordina gli eventi dal più vicino al più lontano (poi per data). */
export function sortEventsByProximity<T extends PlaceEvent>(
  events: T[],
  lat: number,
  lng: number,
): T[] {
  return [...events].sort((a, b) => {
    const distanceA =
      distanceToMunicipalityKm(lat, lng, eventPlaceName(a)) ??
      Number.POSITIVE_INFINITY;
    const distanceB =
      distanceToMunicipalityKm(lat, lng, eventPlaceName(b)) ??
      Number.POSITIVE_INFINITY;

    if (distanceA !== distanceB) {
      return distanceA - distanceB;
    }

    const startA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const startB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return startA - startB;
  });
}

/** Solo data: dal più vicino a oggi in avanti. */
export function sortEventsByUpcomingDate<T extends { startDate?: string }>(
  events: T[],
): T[] {
  return [...events].sort((a, b) => {
    const startA = a.startDate
      ? new Date(a.startDate).getTime()
      : Number.POSITIVE_INFINITY;
    const startB = b.startDate
      ? new Date(b.startDate).getTime()
      : Number.POSITIVE_INFINITY;
    return startA - startB;
  });
}

/**
 * Esplora / ricerca: con posizione → prima i più vicini, poi data;
 * senza posizione → solo data (dal più vicino a oggi).
 */
export function sortEventsForExplore<T extends PlaceEvent>(
  events: T[],
  lat?: number | null,
  lng?: number | null,
): T[] {
  const hasLocation =
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng);

  if (hasLocation) {
    return sortEventsByProximity(events, lat, lng);
  }

  return sortEventsByUpcomingDate(events);
}

/**
 * @deprecated Preferire sortEventsForExplore
 */
export function sortEventsByDateThenProximity<T extends PlaceEvent>(
  events: T[],
  lat?: number | null,
  lng?: number | null,
): T[] {
  return sortEventsForExplore(events, lat, lng);
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
    categories?: string[] | null;
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

  const categoryLabels = resolveCategoryLabels(event);

  const haystack = [
    event.title,
    event.description ? stripHtml(event.description) : null,
    event.municipality,
    event.location_name,
    event.category,
    ...categoryLabels,
    event.category ? categoryNameBySlug.get(event.category) : null,
    ...(event.categories ?? []).map(
      (slug) => categoryNameBySlug.get(slug) ?? null,
    ),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("it");

  return haystack.includes(normalized);
}
