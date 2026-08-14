import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_HOSTS = new Set([
  "pxybrwkbbcghegcezxbn.supabase.co",
  "images.unsplash.com",
]);

/**
 * Proxy same-origin per immagini remote (Story Instagram / canvas).
 * Evita canvas tainted da CORS su Supabase/Unsplash.
 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url")?.trim();
  if (!raw) {
    return NextResponse.json({ error: "Parametro url mancante." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "URL non valido." }, { status: 400 });
  }

  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return NextResponse.json({ error: "Protocollo non consentito." }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: "Host non consentito." }, { status: 403 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: { Accept: "image/*" },
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Immagine non disponibile (${upstream.status}).` },
        { status: 502 },
      );
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Risorsa non immagine." }, { status: 415 });
    }

    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("[share/image] proxy failed:", error);
    return NextResponse.json({ error: "Proxy immagine fallito." }, { status: 502 });
  }
}
