import { NextResponse } from "next/server";
import { createPublicClient } from "@/src/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createPublicClient();
    const { count, error } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .like("subcategory", "imparare-%");
    if (error) {
      console.error("[EVERAS preview] Public catalog diagnostic:", error);
      return NextResponse.json(
        { ok: false, stage: "supabase-query", code: error.code ?? null, message: error.message },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { ok: true, publishedLearningCourses: count ?? 0 },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[EVERAS preview] Public catalog diagnostic setup:", error);
    return NextResponse.json(
      { ok: false, stage: "supabase-client", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
