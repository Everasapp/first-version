import { NextResponse } from "next/server";
import { createPublicClient } from "@/src/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const configuredProject = (() => {
      try { return new URL(url).hostname.split(".")[0]; }
      catch { return "invalid-url"; }
    })();
    const supabase = createPublicClient();
    const [all, published, learning] = await Promise.all([
      supabase.from("events").select("id").limit(3),
      supabase.from("events").select("id").eq("status", "published").limit(3),
      supabase.from("events").select("id,subcategory").eq("status", "published").like("subcategory", "imparare-%").limit(3),
    ]);
    const errors = [all.error, published.error, learning.error].filter(Boolean).map(e => ({ code: e?.code, message: e?.message }));
    const result = {
      ok: errors.length === 0,
      configuredProject,
      expectedProjectMatches: configuredProject === "pxybrwkbbcghegcezxbn",
      sampleVisibleEvents: all.data?.length ?? null,
      samplePublishedEvents: published.data?.length ?? null,
      sampleLearningCourses: learning.data?.length ?? null,
      responseDataMissing: [all.data, published.data, learning.data].some(data => data === null),
      errors,
    };
    return NextResponse.json(result, { status: result.ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, stage: "supabase-client", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
