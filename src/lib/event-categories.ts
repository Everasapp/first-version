import { categories } from "@/src/data/categories";

export const MAX_EVENT_CATEGORIES = 3;

/** Old slugs still stored on events or used in old URLs. */
const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  spettacoli: "musica-concerti",
  "musica e concerti": "musica-concerti",
};

const validSlugs = new Set(categories.map((category) => category.slug));

function canonicalCategorySlug(slug: string) {
  return LEGACY_CATEGORY_ALIASES[slug] ?? slug;
}

function slugToName(slug: string) {
  const canonical = canonicalCategorySlug(slug);
  return (
    categories.find((category) => category.slug === canonical)?.name ?? slug
  );
}

function nameToSlug(value: string) {
  const needle = value.toLocaleLowerCase("it");
  if (LEGACY_CATEGORY_ALIASES[needle]) {
    return LEGACY_CATEGORY_ALIASES[needle];
  }
  return (
    categories.find(
      (category) =>
        category.slug === needle ||
        category.name.toLocaleLowerCase("it") === needle,
    )?.slug ?? null
  );
}

/** Dedupe, keep order, keep only known slugs (or passthrough legacy), max 3. */
export function normalizeEventCategories(slugs: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of slugs) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const asSlug = canonicalCategorySlug(nameToSlug(trimmed) ?? trimmed);
    if (seen.has(asSlug)) continue;
    // Prefer known slugs; keep unknown legacy values so old rows still display
    if (!validSlugs.has(asSlug) && !nameToSlug(trimmed)) {
      // allow legacy display-name-only values already stored
      if (!trimmed) continue;
    }

    seen.add(asSlug);
    result.push(asSlug);
    if (result.length >= MAX_EVENT_CATEGORIES) break;
  }

  return result;
}

export function eventCategorySlugs(event: {
  category?: string | null;
  categories?: string[] | null;
}): string[] {
  if (event.categories?.length) {
    return normalizeEventCategories(event.categories);
  }
  if (event.category?.trim()) {
    return normalizeEventCategories([event.category]);
  }
  return [];
}

/** Display labels for UI (card, detail). */
export function resolveCategoryLabels(event: {
  category?: string | null;
  categories?: string[] | null;
}): string[] {
  const slugs = eventCategorySlugs(event);
  if (!slugs.length) {
    return event.category?.trim() ? [event.category.trim()] : ["Evento"];
  }
  return slugs.map(slugToName);
}

export function primaryCategorySlug(event: {
  category?: string | null;
  categories?: string[] | null;
}): string | null {
  return eventCategorySlugs(event)[0] ?? null;
}

export function eventMatchesCategoryFilter(
  event: {
    category?: string | null;
    categories?: string[] | null;
  },
  filterSlug: string,
): boolean {
  if (!filterSlug) return true;

  const resolvedFilter = canonicalCategorySlug(filterSlug.toLocaleLowerCase("it"));
  const needle = resolvedFilter;
  const meta = categories.find((item) => item.slug === resolvedFilter);
  const nameNeedle = meta?.name.toLocaleLowerCase("it");

  for (const slug of eventCategorySlugs(event)) {
    const normalized = slug.toLocaleLowerCase("it");
    const label = slugToName(slug).toLocaleLowerCase("it");
    if (
      normalized === needle ||
      label === needle ||
      (nameNeedle && (normalized === nameNeedle || label === nameNeedle))
    ) {
      return true;
    }
  }

  const legacy = event.category?.toLocaleLowerCase("it") ?? "";
  return (
    legacy === needle || Boolean(nameNeedle && legacy === nameNeedle)
  );
}

export function toggleCategorySlug(
  current: string[],
  slug: string,
  max = MAX_EVENT_CATEGORIES,
): string[] {
  if (current.includes(slug)) {
    return current.filter((item) => item !== slug);
  }
  if (current.length >= max) {
    return current;
  }
  return [...current, slug];
}
