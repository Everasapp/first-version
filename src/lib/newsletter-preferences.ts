import { learningDisciplines } from "@/src/data/learning-disciplines";
import { eventMatchesCategoryFilter } from "@/src/lib/event-categories";
import { areaFromProvince, type GeoArea } from "@/src/lib/geo-area";
import { findCityByName } from "@/src/utils/nearby-city";

export const NEWSLETTER_ZONES = [
  "Nord Sardegna",
  "Centro Sardegna",
  "Sud Sardegna",
] as const satisfies readonly GeoArea[];

export const MAX_NEWSLETTER_DISCIPLINES = 5;

const ZONE_SET = new Set<string>(NEWSLETTER_ZONES);
const DISCIPLINE_SLUGS = learningDisciplines.map((discipline) => discipline.slug);
const DISCIPLINE_SET = new Set(DISCIPLINE_SLUGS);

/** Old single categories that correspond to one current discipline. */
const LEGACY_DISCIPLINE_MAP: Record<string, string> = {
  "natura-saperi": "natura-saperi",
  "famiglie-bambini": "laboratori-bambini",
  "musica-concerti": "musica",
  spettacoli: "musica",
};

export type NewsletterCourse = {
  id: string;
  title: string;
  municipality: string;
  province?: string | null;
  slug?: string | null;
  category: string;
  categories?: string[] | null;
  subcategory?: string | null;
};

export type NewsletterSelection = {
  areas: GeoArea[];
  disciplines: string[];
};

function uniqueInOrder(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    return value.split(",");
  }
  return [];
}

export function disciplineName(slug: string) {
  return learningDisciplines.find((discipline) => discipline.slug === slug)?.name ?? slug;
}

export function formatDisciplineList(slugs: readonly string[]) {
  const labels = slugs.map(disciplineName);
  if (labels.length === 0) return "Tutte le discipline";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} e ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
}

export function areaFromCity(city: string | null | undefined): GeoArea | null {
  const match = findCityByName(city ?? "");
  return match?.area ?? null;
}

export function disciplinesFromLegacyCategory(category: string | null | undefined) {
  const mapped = (category ?? "")
    .split(",")
    .map((part) => LEGACY_DISCIPLINE_MAP[part.trim()] ?? "")
    .filter((slug) => DISCIPLINE_SET.has(slug));
  return uniqueInOrder(mapped).slice(0, MAX_NEWSLETTER_DISCIPLINES);
}

export function sanitizeNewsletterSelection(
  areasInput: unknown,
  disciplinesInput: unknown,
): { ok: true; selection: NewsletterSelection } | { ok: false; error: string } {
  const areas = uniqueInOrder(
    asStringList(areasInput).map((area) => area.trim()).filter((area) => ZONE_SET.has(area)),
  ) as GeoArea[];
  const requestedDisciplines = asStringList(disciplinesInput).map((slug) => slug.trim()).filter(Boolean);
  const invalidDiscipline = requestedDisciplines.find((slug) => !DISCIPLINE_SET.has(slug));
  if (invalidDiscipline) {
    return { ok: false, error: "Scegli solo discipline presenti nel catalogo." };
  }
  const disciplines = uniqueInOrder(requestedDisciplines);

  if (areas.length < 1) {
    return { ok: false, error: "Scegli almeno una zona." };
  }
  if (areas.length > NEWSLETTER_ZONES.length) {
    return { ok: false, error: "Puoi scegliere al massimo tre zone." };
  }
  if (disciplines.length < 1) {
    return { ok: false, error: "Scegli almeno una disciplina." };
  }
  if (disciplines.length > MAX_NEWSLETTER_DISCIPLINES) {
    return { ok: false, error: "Puoi scegliere al massimo 5 discipline." };
  }

  return { ok: true, selection: { areas, disciplines } };
}

/** Keeps an existing subscriber even when the old category has no discipline equivalent. */
export function resolveStoredNewsletterPreferences(input: {
  areas?: readonly string[] | null;
  disciplines?: readonly string[] | null;
  city?: string | null;
  category?: string | null;
  municipality?: string | null;
  province?: string | null;
}): NewsletterSelection {
  const storedAreas = uniqueInOrder(
    (input.areas ?? []).map((area) => area.trim()).filter((area) => ZONE_SET.has(area)),
  ) as GeoArea[];
  const fallbackArea =
    areaFromCity(input.city) ??
    areaFromCity(input.municipality) ??
    areaFromProvince(input.province);
  const areas = storedAreas.length
    ? storedAreas
    : fallbackArea
      ? [fallbackArea]
      : [...NEWSLETTER_ZONES];

  const storedDisciplines = uniqueInOrder(
    (input.disciplines ?? []).map((slug) => slug.trim()).filter((slug) => DISCIPLINE_SET.has(slug)),
  ).slice(0, MAX_NEWSLETTER_DISCIPLINES);
  const disciplines = input.disciplines?.length
    ? storedDisciplines
    : disciplinesFromLegacyCategory(input.category);

  return { areas, disciplines };
}

function eventZone(event: NewsletterCourse): GeoArea | null {
  return findCityByName(event.municipality)?.area ?? areaFromProvince(event.province);
}

/** Courses in at least one selected zone and, when set, at least one discipline. One row per course. */
export function selectNewsletterCourses<T extends NewsletterCourse>(
  events: readonly T[],
  areas: readonly string[],
  disciplines: readonly string[],
): T[] {
  const zones = new Set(areas);
  const seen = new Set<string>();
  const selected: T[] = [];

  for (const event of events) {
    if (/^copia di\b/i.test(event.title.trim())) continue;
    const zone = eventZone(event);
    if (zones.size > 0 && (!zone || !zones.has(zone))) continue;
    if (
      disciplines.length > 0 &&
      !disciplines.some((slug) => eventMatchesCategoryFilter(event, slug))
    ) {
      continue;
    }
    if (seen.has(event.id)) continue;
    seen.add(event.id);
    selected.push(event);
  }

  return selected;
}

export const NEWSLETTER_DISCIPLINE_OPTIONS = DISCIPLINE_SLUGS.map((slug) => ({
  slug,
  name: disciplineName(slug),
}));
