import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { optimizeImageToWebp } from "@/src/lib/images/optimizeToWebp";
import {
  getEventImageStoragePath,
  isAlreadyWebpUrl,
} from "@/src/lib/images/storagePath";
import { createAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Lotti piccoli: su Vercel 8 immagini grandi facevano timeout (risposta vuota). */
const DEFAULT_BATCH = 2;
const MAX_BATCH = 5;
const DOWNLOAD_TIMEOUT_MS = 12_000;
const MAX_DOWNLOAD_BYTES = 16 * 1024 * 1024;

type EventImageRow = {
  id: string;
  slug: string;
  organizer_id: string;
  image_url: string;
};

async function downloadImageBuffer(imageUrl: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);
  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; EverasImageOptimize/1.0; +https://everas.it)",
        Accept: "image/*,*/*;q=0.8",
      },
    });
    if (!response.ok) {
      throw new Error(`Download fallito (${response.status})`);
    }

    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength > MAX_DOWNLOAD_BYTES) {
      throw new Error(
        `Immagine troppo grande (${Math.round(contentLength / 1024)} KB)`,
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > MAX_DOWNLOAD_BYTES) {
      throw new Error(
        `Immagine troppo grande (${Math.round(buffer.byteLength / 1024)} KB)`,
      );
    }
    return buffer;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Download scaduto (timeout)");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  try {
    const auth = await getAdminApiContext();
    if (!auth.ok) return auth.response;

    const { data, error } = await auth.supabase
      .from("events")
      .select("id, image_url")
      .not("image_url", "is", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data ?? []) as { id: string; image_url: string | null }[];
    const withImage = rows.filter((row) => row.image_url?.trim());
    const pending = withImage.filter(
      (row) => row.image_url && !isAlreadyWebpUrl(row.image_url),
    );

    return NextResponse.json({
      totalWithImage: withImage.length,
      alreadyWebp: withImage.length - pending.length,
      pending: pending.length,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Errore nel caricamento stato.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAdminApiContext();
    if (!auth.ok) return auth.response;

    let limit = DEFAULT_BATCH;
    try {
      const body = (await request.json().catch(() => ({}))) as {
        limit?: number;
      };
      if (typeof body.limit === "number" && Number.isFinite(body.limit)) {
        limit = Math.max(1, Math.min(MAX_BATCH, Math.floor(body.limit)));
      }
    } catch {
      // default batch
    }

    const { data, error } = await auth.supabase
      .from("events")
      .select("id, slug, organizer_id, image_url")
      .not("image_url", "is", null)
      .order("created_at", { ascending: true })
      .limit(400);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const candidates = ((data ?? []) as EventImageRow[]).filter(
      (row) => row.image_url?.trim() && !isAlreadyWebpUrl(row.image_url),
    );

    const batch = candidates.slice(0, limit);

    let admin;
    try {
      admin = createAdminClient();
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : "Manca SUPABASE_SERVICE_ROLE_KEY su Vercel.",
        },
        { status: 500 },
      );
    }

    const results: Array<{
      id: string;
      slug: string;
      ok: boolean;
      error?: string;
      publicUrl?: string;
    }> = [];

    for (const event of batch) {
      const previousUrl = event.image_url;
      const previousPath = getEventImageStoragePath(previousUrl);

      try {
        const input = await downloadImageBuffer(previousUrl);
        const webp = await optimizeImageToWebp(input);
        // Path stabile per evento: evita conflitti RLS tra cartelle organizzatore
        const path = `optimized/${event.id}.webp`;

        const { error: uploadError } = await admin.storage
          .from("event-images")
          .upload(path, webp, {
            cacheControl: "31536000",
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrlData } = admin.storage
          .from("event-images")
          .getPublicUrl(path);

        const publicUrl = publicUrlData.publicUrl;

        const { error: updateError } = await admin
          .from("events")
          .update({ image_url: publicUrl })
          .eq("id", event.id);

        if (updateError) {
          await admin.storage.from("event-images").remove([path]);
          throw new Error(updateError.message);
        }

        if (previousPath && previousPath !== path) {
          const { count } = await admin
            .from("events")
            .select("id", { count: "exact", head: true })
            .eq("image_url", previousUrl)
            .neq("id", event.id);

          if ((count ?? 0) === 0) {
            await admin.storage.from("event-images").remove([previousPath]);
          }
        }

        results.push({
          id: event.id,
          slug: event.slug,
          ok: true,
          publicUrl,
        });
      } catch (err) {
        results.push({
          id: event.id,
          slug: event.slug,
          ok: false,
          error: err instanceof Error ? err.message : "Errore sconosciuto",
        });
      }
    }

    const converted = results.filter((item) => item.ok).length;
    const failed = results.filter((item) => !item.ok).length;

    return NextResponse.json({
      processed: results.length,
      converted,
      failed,
      remaining: Math.max(0, candidates.length - converted),
      results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Compressione interrotta sul server.",
      },
      { status: 500 },
    );
  }
}
