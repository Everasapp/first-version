export function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Rimuove il suffisso -draft / -draft2 lasciato dalle bozze importate. */
export function stripDraftSlugSuffix(slug: string) {
  return slug.replace(/-draft\d*$/i, "");
}
