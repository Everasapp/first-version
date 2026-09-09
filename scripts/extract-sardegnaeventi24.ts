/**
 * Estrae le schede dalla lista SardegnaEventi24 (senza DB).
 *   npx tsx scripts/extract-sardegnaeventi24.ts
 */
import { draftToEditable } from "../src/lib/admin/event-import";
import { extractEventFromUrl } from "../src/lib/admin/event-page-extractor";

const LISTING = "https://sardegnaeventi24.it/eventi-in-sardegna/";

async function main() {
  const listing = await extractEventFromUrl(LISTING);
  if (!listing.listing?.candidates.length) {
    console.error(listing.error || "listing vuoto");
    process.exit(1);
  }

  const items = [];
  for (const candidate of listing.listing.candidates) {
    const extracted = await extractEventFromUrl(candidate.url);
    if (!extracted.ok || !extracted.draft) {
      items.push({ url: candidate.url, title: candidate.title, error: extracted.error || "fail" });
      continue;
    }
    const e = draftToEditable(extracted.draft);
    items.push({
      url: candidate.url,
      title: e.title,
      municipality: e.municipality,
      province: e.province,
      locationName: e.locationName,
      address: e.address,
      startDate: e.startDate,
      startTime: e.startTime,
      endDate: e.endDate,
      endTime: e.endTime,
      category: e.category,
      imageUrl: e.imageUrl,
      organizerName: e.organizerName,
      isFree: e.isFree,
      descriptionChars: e.description.length,
      descriptionPreview: e.description.replace(/<[^>]+>/g, " ").slice(0, 220),
      description: e.description,
    });
  }

  console.log(
    JSON.stringify(
      { listingCount: listing.listing.candidates.length, items },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
