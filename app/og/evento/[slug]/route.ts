import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  loadEventImageBytes,
  renderEventOgJpeg,
} from "@/src/lib/seo/event-og-image";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";
export const revalidate = 86400;

const IMAGE_HEADERS = {
  "Content-Type": "image/jpeg",
  "Cache-Control":
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
};

type EventOgContext = {
  params: Promise<{ slug: string }>;
};

function jpegResponse(bytes: Buffer) {
  return new Response(new Uint8Array(bytes), {
    headers: {
      ...IMAGE_HEADERS,
      "Content-Length": String(bytes.byteLength),
    },
  });
}

async function defaultOgResponse() {
  const file = await readFile(path.join(process.cwd(), "public/og.jpg"));
  return jpegResponse(file);
}

export async function GET(_request: Request, context: EventOgContext) {
  try {
    const { slug } = await context.params;
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("image_url")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    const imageUrl = data?.image_url?.trim();
    if (!imageUrl) return defaultOgResponse();

    const source = await loadEventImageBytes(imageUrl);
    if (!source) return defaultOgResponse();

    return jpegResponse(await renderEventOgJpeg(source));
  } catch (error) {
    console.error("[og/evento] failed:", error);
    return defaultOgResponse();
  }
}
