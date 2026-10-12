import { resolveCategoryLabels } from "@/src/lib/event-categories";
import { loadEventImageBytes } from "@/src/lib/seo/event-og-image";
import { formatStoryDate, formatStoryTime } from "@/src/lib/share/formatStory";
import { buildInstagramStoryJpeg } from "@/src/lib/share/storyCard";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";
export const revalidate = 86400;

type StoryContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: StoryContext) {
  try {
    const { slug } = await context.params;
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("title, image_url, municipality, start_at, category, categories")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!data?.title) {
      return new Response("Evento non trovato", { status: 404 });
    }

    const imageUrl = data.image_url?.trim();
    const poster = imageUrl ? await loadEventImageBytes(imageUrl) : null;
    const jpeg = await buildInstagramStoryJpeg({
      title: data.title,
      category: resolveCategoryLabels(data)[0] ?? "Evento",
      city: data.municipality || "Sardegna",
      dateLabel: data.start_at ? formatStoryDate(data.start_at) : "",
      timeLabel: data.start_at ? formatStoryTime(data.start_at) : "",
      poster,
    });

    return new Response(new Uint8Array(jpeg), {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(jpeg.byteLength),
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("[og/story] failed:", error);
    return new Response("Story non disponibile", { status: 500 });
  }
}
