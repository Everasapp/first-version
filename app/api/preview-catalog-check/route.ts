import { NextResponse } from "next/server";
import { createPublicClient } from "@/src/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
    const configuredUrl = new URL(rawUrl);
    const supabase = createPublicClient();
    const sdk = await supabase.from("events").select("id").limit(1);
    const directUrl = new URL("/rest/v1/events?select=id&limit=1", configuredUrl.origin);
    const directResponse = await fetch(directUrl, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
      cache: "no-store",
    });
    const directBody = await directResponse.text();
    let directCount: number | null = null;
    let directErrorCode: string | null = null;
    try {
      const parsed = JSON.parse(directBody);
      if (Array.isArray(parsed)) directCount = parsed.length;
      else directErrorCode = typeof parsed?.code === "string" ? parsed.code : null;
    } catch {}
    return NextResponse.json({
      configuredProject: configuredUrl.hostname.split(".")[0],
      configuredPathname: configuredUrl.pathname,
      configuredSearchPresent: Boolean(configuredUrl.search),
      configuredHashPresent: Boolean(configuredUrl.hash),
      sdk: { ok: !sdk.error, rows: sdk.data?.length ?? null, errorCode: sdk.error?.code ?? null, errorMessage: sdk.error?.message ?? null },
      directRest: { status: directResponse.status, rows: directCount, errorCode: directErrorCode },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Unknown error" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
