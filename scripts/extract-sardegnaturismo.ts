/**
 * Estrae le schede SardegnaTurismo (senza DB) e stampa JSON.
 *   npx tsx scripts/extract-sardegnaturismo.ts
 */
import { extractEventFromUrl } from "../src/lib/admin/event-page-extractor";
import { draftToEditable } from "../src/lib/admin/event-import";

const URLS = [
  "https://www.sardegnaturismo.it/it/eventi/festa-manna-di-gaddura",
  "https://www.sardegnaturismo.it/it/eventi/futurama",
  "https://www.sardegnaturismo.it/it/eventi/tutankhamon-la-tomba-il-tesoro-la-scoperta",
  "https://www.sardegnaturismo.it/it/eventi/maxi-yacht-rolex-cup",
];

async function main() {
  const items = [];
  for (const url of URLS) {
    const extracted = await extractEventFromUrl(url);
    if (!extracted.ok || !extracted.draft) {
      items.push({ url, error: extracted.error || "fail" });
      continue;
    }
    const e = draftToEditable(extracted.draft);
    items.push({
      url,
      title: e.title,
      municipality: e.municipality,
      province: e.province,
      locationName: e.locationName,
      startDate: e.startDate,
      startTime: e.startTime,
      endDate: e.endDate,
      endTime: e.endTime,
      category: e.category,
      imageUrl: e.imageUrl,
      organizerName: e.organizerName,
      descriptionChars: e.description.length,
      descriptionPreview: e.description.slice(0, 220),
      description: e.description,
    });
  }
  console.log(JSON.stringify(items, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
