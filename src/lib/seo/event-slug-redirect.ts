import type { SupabaseClient } from "@supabase/supabase-js";

import { stripDraftSlugSuffix } from "@/src/lib/slug";
import { EVENT_SLUG_ALIASES } from "./event-slug-aliases";

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
  const alias = EVENT_SLUG_ALIASES[requestedSlug];
  if (alias && alias !== requestedSlug) {
    const { data: target } = await supabase
      .from("events")
      .select("slug")
      .eq("status", "published")
      .eq("slug", alias)
      .maybeSingle();
    if (target?.slug === alias) return alias;
  }

  const withoutDraft = stripDraftSlugSuffix(requestedSlug);
  if (withoutDraft !== requestedSlug && withoutDraft.length >= 8) {
    const { data: exact } = await supabase
      .from("events")
      .select("slug")
      .eq("status", "published")
      .eq("slug", withoutDraft)
      .maybeSingle();
    if (typeof exact?.slug === "string") return exact.slug;
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
