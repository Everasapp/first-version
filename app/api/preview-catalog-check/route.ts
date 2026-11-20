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
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "published").like("subcategory", "imparare-%"),
    ]);
    const result = {
      ok: !all.error && !published.error && !learning.error,
      configuredProject,
      expectedProjectMatches: configuredProject === "pxybrwkbbcghegcezxbn",
      visibleEvents: all.count,
      publishedEvents: published.count,
      publishedLearningCourses: learning.count,
      errors: [all.error, published.error, learning.error].filter(Boolean).map(e => ({ code: e?.code, message: e?.message })),
    };
    return NextResponse.json(result, { status: result.ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, stage: "supabase-client", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
