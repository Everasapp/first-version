import { categories } from "@/src/data/categories";

const validSlugs = new Set(categories.map((category) => category.slug));

export const MIN_NEWSLETTER_CATEGORIES = 3;

/** Parse stored preference: single slug or comma-separated list. */
export function parseNewsletterCategories(
  value: string | null | undefined,
): string[] {
  if (!value?.trim()) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of value.split(",")) {
    const slug = part.trim();
    if (!slug || seen.has(slug) || !validSlugs.has(slug)) continue;
    seen.add(slug);
    result.push(slug);
  }
  return result;
}

export function serializeNewsletterCategories(slugs: string[]): string {
  const unique = parseNewsletterCategories(slugs.join(","));
  return unique.join(",");
}

export function formatNewsletterCategoryLabels(
  value: string | null | undefined,
): string {
  const slugs = parseNewsletterCategories(value);
  if (slugs.length === 0) return "Tutte le categorie";
  const labels = slugs.map(
    (slug) => categories.find((category) => category.slug === slug)?.name ?? slug,
  );
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} e ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
}
