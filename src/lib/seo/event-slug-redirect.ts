import type { SupabaseClient } from "@supabase/supabase-js";

/** Suffisso da import/createSlug: Date.now().toString(36). */
const IMPORT_SUFFIX = /-[a-z0-9]{6,12}$/i;

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
  const stem = eventSlugStem(requestedSlug);
  if (stem === requestedSlug || stem.length < 8) {
    return null;
  }

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

  return matches[0]?.slug ?? null;
}
