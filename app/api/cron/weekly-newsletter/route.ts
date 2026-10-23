import {
  WEEKLY_NEWSLETTER_PAUSED,
  WEEKLY_NEWSLETTER_PAUSED_MESSAGE,
} from "@/src/lib/newsletter-availability";
import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/src/lib/cron/auth";
import { logCronRun } from "@/src/lib/cron/run-log";
import { runWeeklyNewsletter } from "@/src/lib/newsletter-week";
import {
  REAL_EMAIL_DISABLED_MESSAGE,
  realEmailDeliveryAllowed,
} from "@/src/lib/notifications/resend-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const JOB_NAME = "weekly-newsletter";

// Hobby allows one cron run per day, so this stays daily and not more often.
// Seven runs, Monday through Sunday at 07:00 UTC, fall in the same Rome week
// and can deliver 20 new emails each (140 in that week). The next Monday
// starts a new week and does not finish the previous queue.
// A row still "sending" when the next day runs is past the 24 hour Resend
// window, becomes "uncertain", and is not emailed again.

function isAuthorized(request: Request) {
  return isCronAuthorized(request);
}

export async function GET(request: Request) {
  if (WEEKLY_NEWSLETTER_PAUSED) {
    return NextResponse.json(
      { error: WEEKLY_NEWSLETTER_PAUSED_MESSAGE },
      { status: 503 },
    );
  }

  if (!realEmailDeliveryAllowed()) {
    return NextResponse.json(
      { error: REAL_EMAIL_DISABLED_MESSAGE },
      { status: 503 },
    );
  }

  const startedAt = new Date();
  // Vercel schedules are UTC: two Monday invocations account for DST.
  // Only the request in the 09:00 Europe/Rome hour is allowed to send.
  if ((request.headers.get("user-agent") || "").includes("vercel-cron")) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome",
      weekday: "long",
      hour: "2-digit",
      hourCycle: "h23",
    }).formatToParts(startedAt);
    if (parts.find(p => p.type === "weekday")?.value !== "Monday" ||
        parts.find(p => p.type === "hour")?.value !== "09") {
      return NextResponse.json({ ok: true, skipped: "Outside Monday 09:00 Europe/Rome" });
    }
  }

  if (!isAuthorized(request)) {
    await logCronRun({
      jobName: JOB_NAME,
      status: "unauthorized",
      startedAt,
      errorMessage: "Unauthorized",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runWeeklyNewsletter();
    await logCronRun({
      jobName: JOB_NAME,
      status: "success",
      startedAt,
      summary: summary as unknown as Record<string, unknown>,
    });
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    await logCronRun({
      jobName: JOB_NAME,
      status: "error",
      startedAt,
      errorMessage: message,
    });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
