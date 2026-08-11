import { crawlOrganizerContacts } from "../src/lib/admin/contact-crawler";

async function main() {
  const result = await crawlOrganizerContacts("https://www.comune.sassari.it");
  console.log(
    JSON.stringify(
      {
        ok: result.ok,
        error: result.error,
        pagesVisited: result.pagesVisited,
        pagesAnalyzed: result.pagesAnalyzed,
        skippedRobots: result.skippedRobots,
        items: result.items.map((i) => ({
          field: i.field,
          label: i.label,
          value: i.value,
          sourceUrl: i.sourceUrl,
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
