const STRING_FIELDS = [
  "title",
  "description",
  "category",
  "subcategory",
  "province",
  "municipality",
  "location_name",
  "address",
  "start_at",
  "end_at",
  "schedule_mode",
  "image_url",
  "ticket_url",
  "youtube_url",
  "organizer_display_name",
  "organizer_directory_id",
  "updated_at",
  "slug",
] as const;

const NULLABLE_STRINGS = new Set<string>([
  "description",
  "subcategory",
  "province",
  "location_name",
  "address",
  "end_at",
  "schedule_mode",
  "image_url",
  "ticket_url",
  "youtube_url",
  "organizer_display_name",
  "organizer_directory_id",
]);

const STATUSES = new Set(["draft", "pending", "published", "rejected"]);

export type AdminEventUpdate = Record<string, string | number | boolean | string[] | null>;

function invalid(): never {
  throw new Error("Richiesta non valida.");
}

/** Keeps the editable event fields and never copies ownership columns. */
export function sanitizeAdminEventUpdate(input: unknown): AdminEventUpdate {
  if (!input || typeof input !== "object" || Array.isArray(input)) invalid();
  const source = input as Record<string, unknown>;
  const patch: AdminEventUpdate = {};

  for (const key of STRING_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    const value = source[key];
    if (value === null && NULLABLE_STRINGS.has(key)) {
      patch[key] = null;
      continue;
    }
    if (typeof value !== "string") invalid();
    if (key === "title" && !value.trim()) invalid();
    patch[key] = value;
  }

  if (Object.prototype.hasOwnProperty.call(source, "categories")) {
    const categories = source.categories;
    if (
      !Array.isArray(categories) ||
      categories.some((item) => typeof item !== "string")
    ) {
      invalid();
    }
    patch.categories = categories;
  }

  if (Object.prototype.hasOwnProperty.call(source, "is_free")) {
    if (typeof source.is_free !== "boolean") invalid();
    patch.is_free = source.is_free;
  }

  for (const key of ["price_from", "price"] as const) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    const value = source[key];
    if (value === null && key === "price_from") {
      patch[key] = null;
      continue;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) invalid();
    patch[key] = value;
  }

  if (Object.prototype.hasOwnProperty.call(source, "status")) {
    if (typeof source.status !== "string" || !STATUSES.has(source.status)) invalid();
    patch.status = source.status;
  }

  if (Object.keys(patch).length === 0) invalid();
  return patch;
}
