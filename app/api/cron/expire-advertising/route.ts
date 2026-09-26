import { NextResponse } from "next/server";

import { expireAdvertisingOrders } from "@/src/lib/ads/orders";
import { isCronAuthorized } from "@/src/lib/cron/auth";
import { logCronRun } from "@/src/lib/cron/run-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const JOB_NAME = "expire-advertising";

export async function GET(request: Request) {
  const startedAt = new Date();

  if (!isCronAuthorized(request)) {
    await logCronRun({
      jobName: JOB_NAME,
      status: "unauthorized",
      startedAt,
      errorMessage: "Unauthorized",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const expiredCount = await expireAdvertisingOrders();
    await logCronRun({
      jobName: JOB_NAME,
      status: "success",
      startedAt,
      summary: { expiredCount },
    });
    return NextResponse.json({ ok: true, expiredCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await logCronRun({
      jobName: JOB_NAME,
      status: "error",
      startedAt,
      errorMessage: message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
