import { cities } from "@/src/data/cities";
import { findCultureAreaByName } from "@/src/lib/seo/cultura-areas";
import {
  CULTURE_TOWNS,
  isEditorialCultureTown,
} from "@/src/lib/seo/cultura-towns";

export type WeeklyTownGuideCard = {
  town: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  eventCount: number;
  areaLabel: string;
};

type WeekEventLike = {
  municipality: string;
  start_at: string;
  end_at?: string | null;
};

function formatRomeDayKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function addDayKeys(dayKey: string, days: number) {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

/** Lunedì–domenica della settimana corrente (Europe/Rome). */
export function getRomeMondaySundayKeys(now: Date = new Date()) {
  const todayKey = formatRomeDayKey(now);
  const [year, month, day] = todayKey.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
  const offsetFromMonday = weekday === 0 ? 6 : weekday - 1;
  const mondayKey = addDayKeys(todayKey, -offsetFromMonday);
  const sundayKey = addDayKeys(mondayKey, 6);
  return { mondayKey, sundayKey };
}

export function eventOverlapsRomeWeek(
  event: WeekEventLike,
  now: Date = new Date(),
) {
  const { mondayKey, sundayKey } = getRomeMondaySundayKeys(now);
  const startKey = formatRomeDayKey(new Date(event.start_at));
  const endKey = formatRomeDayKey(new Date(event.end_at || event.start_at));
  return startKey <= sundayKey && endKey >= mondayKey;
}

function hashWeekSeed(mondayKey: string) {
  let hash = 0;
  for (let i = 0; i < mondayKey.length; i += 1) {
    hash = (hash * 31 + mondayKey.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function findCity(municipality: string) {
  return cities.find(
    (city) =>
      city.city.localeCompare(municipality, "it", { sensitivity: "base" }) ===
      0,
  );
}

/** Solo guide CULTURE_TOWNS editoriali (sources > 0); le D non entrano in homepage. */
function findEditorialGuide(townName: string) {
  return CULTURE_TOWNS.find(
    (article) =>
      article.town.localeCompare(townName, "it", { sensitivity: "base" }) ===
        0 && isEditorialCultureTown(article),
  );
}

type TownCandidate = {
  town: string;
  areaLabel: string;
  eventCount: number;
};

/**
 * Tre comuni con almeno 2 eventi nella settimana corrente, ruotati ogni lunedì.
 * Solo comuni con guida Cultura editoriale (non schede directory D).
 */
export function pickWeeklyTownGuides(
  weekEvents: WeekEventLike[],
  now: Date = new Date(),
): WeeklyTownGuideCard[] {
  const { mondayKey } = getRomeMondaySundayKeys(now);
  const byTown = new Map<string, TownCandidate>();

  for (const event of weekEvents) {
    const city = findCity(event.municipality);
    if (!city) continue;

    const area = findCultureAreaByName(city.area);
    if (!area?.townPagesLive) continue;

    const key = city.city.toLocaleLowerCase("it");
    const existing = byTown.get(key);
    if (existing) {
      existing.eventCount += 1;
      continue;
    }

    byTown.set(key, {
      town: city.city,
      areaLabel: city.area,
      eventCount: 1,
    });
  }

  const candidates = [...byTown.values()]
    .filter((candidate) => candidate.eventCount >= 2)
    .filter((candidate) => findEditorialGuide(candidate.town))
    .sort((a, b) => {
      if (b.eventCount !== a.eventCount) return b.eventCount - a.eventCount;
      return a.town.localeCompare(b.town, "it");
    });

  if (candidates.length === 0) return [];

  const seed = hashWeekSeed(mondayKey);
  const rotated = [
    ...candidates.slice(seed % candidates.length),
    ...candidates.slice(0, seed % candidates.length),
  ];

  const picked: TownCandidate[] = [];
  const usedAreas = new Set<string>();

  for (const candidate of rotated) {
    if (picked.length >= 3) break;
    if (usedAreas.has(candidate.areaLabel)) continue;
    picked.push(candidate);
    usedAreas.add(candidate.areaLabel);
  }

  for (const candidate of rotated) {
    if (picked.length >= 3) break;
    if (picked.some((item) => item.town === candidate.town)) continue;
    picked.push(candidate);
  }

  return picked.slice(0, 3).map((candidate) => {
    const guide = findEditorialGuide(candidate.town)!;

    return {
      town: candidate.town,
      href: guide.path,
      imageSrc: guide.hero.src,
      imageAlt: guide.hero.alt,
      eventCount: candidate.eventCount,
      areaLabel: candidate.areaLabel,
    };
  });
}
