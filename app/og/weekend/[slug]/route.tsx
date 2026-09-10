import { findWeekend } from "@/src/lib/seo/weekends";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { pickWeekendPosterUrls } from "@/src/lib/seo/weekend-mosaic";
import { buildWeekendOgImage } from "@/src/lib/seo/weekend-og-image";

export const runtime = "nodejs";
export const revalidate = 3600;

type WeekendOgContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: WeekendOgContext) {
  const { slug } = await context.params;
  const weekend = findWeekend(slug);
  if (!weekend) {
    return new Response("Not found", { status: 404 });
  }

  const { events } = await loadFilteredPublishedEvents({
    range: { start: weekend.start, end: weekend.end },
  });

  return buildWeekendOgImage(weekend, pickWeekendPosterUrls(events));
}
