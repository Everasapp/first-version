import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { runWeeklyNewsletter } from "@/src/lib/newsletter-week";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => ({}))) as {
    dryRun?: boolean;
    testEmail?: string | null;
  };

  try {
    const summary = await runWeeklyNewsletter({
      dryRun: Boolean(body.dryRun),
      testEmail: body.testEmail ?? null,
    });
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
