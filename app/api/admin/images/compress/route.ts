import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { optimizeImageToWebp } from "@/src/lib/images/optimizeToWebp";
import {
  getEventImageStoragePath,
  isAlreadyWebpUrl,
} from "@/src/lib/images/storagePath";
import { createAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Lotti piccoli: evita timeout Vercel su immagini remote grandi. */
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

function tryCreateAdminClient(): SupabaseClient | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

async function downloadImageBuffer(imageUrl: string) {
  let lastError: Error | null = null;
  const origin = (() => {
    try {
      return new URL(imageUrl).origin + "/";
    } catch {
      return undefined;
    }
  })();

  // Alcuni CDN (es. WordPress/WAF) rispondono 403 a UA “browser-like”
  // ma accettano richieste semplici — proviamo più strategie.
  const attempts: Array<HeadersInit> = [
    {
      Accept: "image/*,*/*;q=0.8",
      "User-Agent": "EverasBot/1.0 (+https://www.everas.it)",
    },
    {
      Accept: "image/*,*/*;q=0.8",
      "User-Agent": "curl/8.4.0",
      ...(origin ? { Referer: origin } : {}),
    },
    {
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (compatible; EverasImageOptimize/1.0; +https://www.everas.it)",
      ...(origin ? { Referer: origin } : {}),
    },
  ];

  for (const headers of attempts) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);
    try {
      const response = await fetch(imageUrl, {
        signal: controller.signal,
        redirect: "follow",
        headers,
      });
      if (!response.ok) {
        lastError = new Error(`Download fallito (${response.status})`);
        continue;
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
      if (buffer.byteLength < 64) {
        lastError = new Error("Download vuoto o non valido");
        continue;
      }
      return buffer;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        lastError = new Error("Download scaduto (timeout)");
        continue;
      }
      if (
        err instanceof Error &&
        err.message.startsWith("Immagine troppo grande")
      ) {
        throw err;
      }
      lastError =
        err instanceof Error ? err : new Error("Download non riuscito");
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError ?? new Error("Download non riuscito");
}

export async function GET() {
  try {
    const auth = await getAdminApiContext();
    if (!auth.ok) return auth.response;

    const { data, error } = await auth.supabase
      .from("events")
      .select("id, image_url, organizer_id")
      .not("image_url", "is", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data ?? []) as {
      id: string;
      image_url: string | null;
      organizer_id: string;
    }[];
    const withImage = rows.filter((row) => row.image_url?.trim());
    const pending = withImage.filter(
      (row) => row.image_url && !isAlreadyWebpUrl(row.image_url),
    );
    const pendingOwn = pending.filter(
      (row) => row.organizer_id === auth.user.id,
    );

    return NextResponse.json({
      totalWithImage: withImage.length,
      alreadyWebp: withImage.length - pending.length,
      pending: pending.length,
      pendingOwn: pendingOwn.length,
      hasServiceRole: Boolean(tryCreateAdminClient()),
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

    const adminClient = tryCreateAdminClient();

    const candidates = ((data ?? []) as EventImageRow[])
      .filter((row) => row.image_url?.trim() && !isAlreadyWebpUrl(row.image_url))
      .sort((a, b) => {
        // Prima gli eventi dell’admin loggato (sempre aggiornabili via RLS)
        const aOwn = a.organizer_id === auth.user.id ? 0 : 1;
        const bOwn = b.organizer_id === auth.user.id ? 0 : 1;
        return aOwn - bOwn;
      });

    const batch: EventImageRow[] = [];
    const results: Array<{
      id: string;
      slug: string;
      ok: boolean;
      error?: string;
      publicUrl?: string;
    }> = [];
    const skippedFailures: Array<{
      id: string;
      slug: string;
      ok: false;
      error: string;
    }> = [];

    // Continua a scorrere i candidati finché non hai `limit` successi
    // (o finiscono), così un 403 non blocca per sempre lo stesso lotto.
    const maxAttempts = Math.min(candidates.length, Math.max(limit * 4, 8));

    for (let i = 0; i < maxAttempts && batch.length < limit; i += 1) {
      const event = candidates[i];
      if (!event) break;

      const previousUrl = event.image_url;
      const previousPath = getEventImageStoragePath(previousUrl);
      const db = auth.supabase;
      const storage = adminClient ?? auth.supabase;

      try {
        const path = `${auth.user.id}/optimized-${event.id}.webp`;

        const input = await downloadImageBuffer(previousUrl);
        const webp = await optimizeImageToWebp(input);

        const { error: uploadError } = await storage.storage
          .from("event-images")
          .upload(path, webp, {
            cacheControl: "31536000",
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrlData } = storage.storage
          .from("event-images")
          .getPublicUrl(path);

        const publicUrl = publicUrlData.publicUrl;

        const { data: updated, error: updateError } = await db
          .from("events")
          .update({ image_url: publicUrl })
          .eq("id", event.id)
          .select("id")
          .maybeSingle();

        if (updateError) {
          await storage.storage.from("event-images").remove([path]);
          throw new Error(updateError.message);
        }

        if (!updated) {
          await storage.storage.from("event-images").remove([path]);
          throw new Error(
            "Aggiornamento non consentito (evento di un altro organizzatore).",
          );
        }

        if (
          previousPath &&
          previousPath !== path &&
          previousPath.startsWith(`${auth.user.id}/`)
        ) {
          const { count } = await db
            .from("events")
            .select("id", { count: "exact", head: true })
            .eq("image_url", previousUrl)
            .neq("id", event.id);

          if ((count ?? 0) === 0) {
            await storage.storage.from("event-images").remove([previousPath]);
          }
        }

        batch.push(event);
        results.push({
          id: event.id,
          slug: event.slug,
          ok: true,
          publicUrl,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Errore sconosciuto";
        skippedFailures.push({
          id: event.id,
          slug: event.slug,
          ok: false,
          error: message,
        });
      }
    }

    // Mostra fino a 6 fallimenti del passaggio (es. 403 esterni)
    results.push(...skippedFailures.slice(0, 6));

    const converted = results.filter((item) => item.ok).length;
    const failed = results.filter((item) => !item.ok).length;

    return NextResponse.json({
      processed: results.length,
      converted,
      failed,
      remaining: Math.max(0, candidates.length - converted),
      results,
      hasServiceRole: Boolean(adminClient),
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
