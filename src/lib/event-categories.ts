import { categories } from "@/src/data/categories";

export const MAX_EVENT_CATEGORIES = 3;

const validSlugs = new Set(categories.map((category) => category.slug));

function slugToName(slug: string) {
  return (
    categories.find((category) => category.slug === slug)?.name ?? slug
  );
}

function nameToSlug(value: string) {
  const needle = value.toLocaleLowerCase("it");
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

    const asSlug = nameToSlug(trimmed) ?? trimmed;
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

  const needle = filterSlug.toLocaleLowerCase("it");
  const meta = categories.find((item) => item.slug === filterSlug);
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
