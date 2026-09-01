/**
 * Esporta eventi nuovi trovati online (senza DB). Output JSON su stdout.
 *   npx tsx scripts/discover-event-drafts-export.ts > /tmp/new-events.json
 */
import { readFileSync, writeFileSync } from "node:fs";

import {
  draftToEditable,
  type ListingEventCandidate,
} from "../src/lib/admin/event-import";
import { extractEventFromUrl } from "../src/lib/admin/event-page-extractor";

const LISTING_SOURCES = [
  { url: "https://www.sassaritoday.it/eventi/", label: "SassariToday" },
  { url: "https://www.cagliaritoday.it/eventi/", label: "CagliariToday" },
  {
    url: "https://www.comune.santateresagallura.ss.it/it/eventi",
    label: "Comune di Santa Teresa Gallura",
  },
];

function parseArg(name: string, fallback: string) {
  const match = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.split("=").slice(1).join("=") : fallback;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isUpcoming(startAt: string | null) {
  if (!startAt) return true;
  const parsed = new Date(startAt);
  if (Number.isNaN(parsed.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed >= today;
}

function loadExistingUrls(path: string) {
  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as string[] | { source_url: string }[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      if (typeof parsed[0] === "string") {
        return new Set(parsed as string[]);
      }
      return new Set(
        (parsed as { source_url: string }[])
          .map((row) => row.source_url)
          .filter(Boolean),
      );
    }
  } catch {
    // ignore
  }
  return new Set<string>();
}

async function main() {
  const limit = Number.parseInt(parseArg("limit", "20"), 10);
  const existingFile = parseArg("existing", "");
  const existingUrls = existingFile
    ? loadExistingUrls(existingFile)
    : new Set<string>();

  const seen = new Set<string>();
  const candidates: Array<ListingEventCandidate & { listingLabel: string }> = [];

  for (const source of LISTING_SOURCES) {
    process.stderr.write(`Scansione ${source.label}…\n`);
    const result = await extractEventFromUrl(source.url);
    if (!result.listing?.candidates.length) {
      process.stderr.write(`  → skip (${result.error || "vuoto"})\n`);
      continue;
    }
    for (const item of result.listing.candidates) {
      if (existingUrls.has(item.url) || seen.has(item.url)) continue;
      if (!isUpcoming(item.startAt)) continue;
      seen.add(item.url);
      candidates.push({ ...item, listingLabel: source.label });
    }
    process.stderr.write(
      `  → ${result.listing.candidates.length} in elenco\n`,
    );
    await sleep(300);
  }

  candidates.sort((a, b) => {
    const aTime = a.startAt ? new Date(a.startAt).getTime() : 9e15;
    const bTime = b.startAt ? new Date(b.startAt).getTime() : 9e15;
    return aTime - bTime;
  });

  const batch = candidates.slice(0, limit);
  const exported: Array<{
    title: string;
    url: string;
    listingLabel: string;
    editable: ReturnType<typeof draftToEditable> | null;
    skipReason?: string;
  }> = [];

  for (const candidate of batch) {
    process.stderr.write(`Analisi ${candidate.title}…\n`);
    const extracted = await extractEventFromUrl(candidate.url);
    if (!extracted.ok || !extracted.draft) {
      exported.push({
        title: candidate.title,
        url: candidate.url,
        listingLabel: candidate.listingLabel,
        editable: null,
        skipReason: extracted.error || "analisi fallita",
      });
      continue;
    }

    const editable = draftToEditable(extracted.draft);
    if (!editable.startDate.trim() && candidate.startAt) {
      editable.startDate = candidate.startAt.slice(0, 10);
    }

    if (
      !editable.title.trim() ||
      !editable.municipality.trim() ||
      !editable.startDate.trim()
    ) {
      exported.push({
        title: candidate.title,
        url: candidate.url,
        listingLabel: candidate.listingLabel,
        editable: null,
        skipReason: "dati incompleti",
      });
      continue;
    }

    exported.push({
      title: editable.title,
      url: candidate.url,
      listingLabel: candidate.listingLabel,
      editable,
    });
    await sleep(250);
  }

  const outfile = parseArg("out", "");
  const payload = {
    discovered: candidates.length,
    processed: exported.length,
    ready: exported.filter((row) => row.editable).length,
    items: exported,
  };
  const json = JSON.stringify(payload, null, 2);
  if (outfile) writeFileSync(outfile, json);
  else console.log(json);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
