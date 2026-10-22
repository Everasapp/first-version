import { CONSOLIDATED_EVENT_SLUGS } from "./consolidated-event-slugs";

/** Verified old event URLs. Each value is the published card that replaces it. */
export const EVENT_SLUG_ALIASES: Readonly<Record<string, string>> = {
  ...CONSOLIDATED_EVENT_SLUGS,
  "nuracque-a-nurachi-2026-p8": "nuraque-mudp855p",
  "festival-internazionale-di-musiche-polifoniche-voci-d-europa-mus8doo3":
    "voci-deuropa-tallis-scholars-porto-torres-2026-10-24",
  "paolo-ehrenheim-festival-nessun-dorma-iii-edizione-mu6kmbef":
    "recital-paolo-ehrenheim-teatro-civico-sassari-2026-10-27",
  "passeggiata-belle-epoque-sassarese-2026-10-09":
    "passeggiata-nella-memoria-festival-nessun-dorma-iii-edizione-1a09065a709",
  "festival-dell-aerospazio-a-olbia-dal-1-al-3-ottobre-2026-il-programma-mul70cgv":
    "festival-dell-aerospazio-olbia-mueac5aa",
  "festa-del-gusto": "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
  "festa-del-gusto-santa-teresa":
    "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
  "festa-del-gusto-santa-teresa-gallura":
    "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
  "festa-del-gusto-santa-teresa-gallura-turismo":
    "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
};

/** One hop to a verified replacement. Unknown slugs stay unresolved. */
export function verifiedEventRedirectSlug(slug: string): string | null {
  const target = EVENT_SLUG_ALIASES[slug];
  if (!target || target === slug || EVENT_SLUG_ALIASES[target]) return null;
  return target;
}
