import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { runWeeklyNewsletter } from "@/src/lib/newsletter-week";
import {
  REAL_EMAIL_DISABLED_MESSAGE,
  realEmailDeliveryAllowed,
} from "@/src/lib/notifications/resend-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (!realEmailDeliveryAllowed()) {
    return NextResponse.json(
      { error: REAL_EMAIL_DISABLED_MESSAGE },
      { status: 503 },
    );
  }

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
      supabase: auth.supabase,
    });
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
