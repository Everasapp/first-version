import {
  WEEKLY_NEWSLETTER_PAUSED,
  WEEKLY_NEWSLETTER_PAUSED_MESSAGE,
} from "@/src/lib/newsletter-availability";
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
  const body = (await request.json().catch(() => ({}))) as {
    dryRun?: boolean;
    testEmail?: string | null;
  };
  const dryRun = body.dryRun === true;
  if (WEEKLY_NEWSLETTER_PAUSED && !dryRun) {
    return NextResponse.json(
      { error: WEEKLY_NEWSLETTER_PAUSED_MESSAGE },
      { status: 503 },
    );
  }

  if (!dryRun && !realEmailDeliveryAllowed()) {
    return NextResponse.json(
      { error: REAL_EMAIL_DISABLED_MESSAGE },
      { status: 503 },
    );
  }

  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  try {
    const summary = await runWeeklyNewsletter({
      dryRun,
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
