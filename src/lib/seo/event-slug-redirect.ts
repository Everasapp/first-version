import type { SupabaseClient } from "@supabase/supabase-js";

import { stripDraftSlugSuffix } from "@/src/lib/slug";
import { CONSOLIDATED_EVENT_SLUGS } from "./consolidated-event-slugs";

/** Suffisso da import/createSlug: Date.now().toString(36). */
const IMPORT_SUFFIX = /-[a-z0-9]{6,12}$/i;

/** Vecchie URL evento → slug pubblicato attuale. */
const EVENT_SLUG_ALIASES: Record<string, string> = {
  ...CONSOLIDATED_EVENT_SLUGS,
  "nuracque-a-nurachi-2026-p8":
    "nuraque-mudp855p",
  "festival-internazionale-di-musiche-polifoniche-voci-d-europa-mus8doo3":
    "voci-deuropa-tallis-scholars-porto-torres-2026-10-24",
  "paolo-ehrenheim-festival-nessun-dorma-iii-edizione-mu6kmbef":
    "recital-paolo-ehrenheim-teatro-civico-sassari-2026-10-27",
  "passeggiata-belle-epoque-sassarese-2026-10-09":
    "passeggiata-nella-memoria-festival-nessun-dorma-iii-edizione-1a09065a709",
  "festival-dell-aerospazio-a-olbia-dal-1-al-3-ottobre-2026-il-programma-mul70cgv":
    "festival-dell-aerospazio-olbia-mueac5aa",
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
