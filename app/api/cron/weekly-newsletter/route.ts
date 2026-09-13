import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/src/lib/cron/auth";
import { logCronRun } from "@/src/lib/cron/run-log";
import { runWeeklyNewsletter } from "@/src/lib/newsletter-week";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const JOB_NAME = "weekly-newsletter";

function isAuthorized(request: Request) {
  return isCronAuthorized(request);
}

export async function GET(request: Request) {
  const startedAt = new Date();

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
