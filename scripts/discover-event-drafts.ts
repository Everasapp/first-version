/**
 * Scansiona elenchi eventi da fonti note, importa come bozze (status: pending).
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/discover-event-drafts.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/discover-event-drafts.ts --limit=20
 */
import { discoverAndImportEventDrafts } from "../src/lib/admin/discover-event-drafts";
import { createAdminClient } from "../src/lib/supabase/admin";

function parseArg(name: string, fallback: string) {
  const match = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.split("=").slice(1).join("=") : fallback;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

async function main() {
  const dryRun = hasFlag("dry-run");
  const limit = Number.parseInt(parseArg("limit", "20"), 10);
  const supabase = createAdminClient();

  const { data: adminProfile, error: adminError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();

  if (adminError || !adminProfile?.id) {
    throw new Error("Nessun profilo admin trovato");
  }

  if (dryRun) {
    const { discoverAndImportEventDrafts: _unused, ...rest } = await import(
      "../src/lib/admin/discover-event-drafts"
    );
    void _unused;
    const { extractEventFromUrl } = await import(
      "../src/lib/admin/event-page-extractor"
    );
    const sources = [
      "https://www.sassaritoday.it/eventi/",
      "https://www.cagliaritoday.it/eventi/",
      "https://www.comune.santateresagallura.ss.it/it/eventi",
    ];
    const { data: existing } = await supabase
      .from("events")
      .select("source_url")
      .not("source_url", "is", null);
    const existingUrls = new Set(
      (existing || []).map((row) => row.source_url as string),
    );
    const preview: Array<{ title: string; url: string }> = [];
    for (const url of sources) {
      const result = await extractEventFromUrl(url);
      for (const item of result.listing?.candidates || []) {
        if (!existingUrls.has(item.url)) {
          preview.push({ title: item.title, url: item.url });
        }
      }
    }
    console.log(
      JSON.stringify(
        { dryRun: true, newCandidates: preview.length, preview: preview.slice(0, limit) },
        null,
        2,
      ),
    );
    return;
  }

  const result = await discoverAndImportEventDrafts({
    supabase,
    adminUserId: adminProfile.id as string,
    limit,
  });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
