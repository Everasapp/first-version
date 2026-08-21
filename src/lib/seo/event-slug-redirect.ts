import type { SupabaseClient } from "@supabase/supabase-js";

/** Suffisso da import/createSlug: Date.now().toString(36). */
const IMPORT_SUFFIX = /-[a-z0-9]{6,12}$/i;

/** Vecchie URL evento → slug pubblicato attuale. */
const EVENT_SLUG_ALIASES: Record<string, string> = {
  "festa-del-gusto":
    "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
  "festa-del-gusto-santa-teresa":
    "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
  "festa-del-gusto-santa-teresa-gallura":
    "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
  "festa-del-gusto-santa-teresa-gallura-turismo":
    "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
};

export function eventSlugStem(slug: string) {
  return slug.replace(IMPORT_SUFFIX, "");
}

/**
 * Se un evento è stato ricreato con un nuovo suffisso, trova lo slug pubblicato
 * corrispondente al titolo (stesso stem).
 */
export async function findReplacementEventSlug(
  supabase: SupabaseClient,
  requestedSlug: string,
): Promise<string | null> {
  const alias = EVENT_SLUG_ALIASES[requestedSlug];
  if (alias && alias !== requestedSlug) {
    return alias;
  }

  const stem = eventSlugStem(requestedSlug);
  if (stem !== requestedSlug && stem.length >= 8) {
    const { data } = await supabase
      .from("events")
      .select("slug")
      .eq("status", "published")
      .like("slug", `${stem}%`)
      .neq("slug", requestedSlug)
      .not("slug", "is", null)
      .order("start_at", { ascending: false })
      .limit(10);

    const matches = (data ?? []).filter(
      (row): row is { slug: string } =>
        typeof row.slug === "string" &&
        (row.slug === stem || row.slug.startsWith(`${stem}-`)),
    );

    if (matches[0]?.slug) return matches[0].slug;
  }

  if (requestedSlug.length < 12) return null;

  const { data: prefixHits } = await supabase
    .from("events")
    .select("slug")
    .eq("status", "published")
    .like("slug", `${requestedSlug}%`)
    .neq("slug", requestedSlug)
    .not("slug", "is", null)
    .limit(5);

  const unique = (prefixHits ?? []).filter(
    (row): row is { slug: string } => typeof row.slug === "string",
  );
  if (unique.length === 1) return unique[0].slug;

  return null;
}
