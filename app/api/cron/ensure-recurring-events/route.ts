import { NextResponse } from "next/server";

import { ensureRecurringSundayEvents } from "@/src/lib/admin/recurring-sunday-events";
import { isCronAuthorized } from "@/src/lib/cron/auth";
import { logCronRun } from "@/src/lib/cron/run-log";
import { createAdminClient, tryCreateAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const JOB_NAME = "ensure-recurring-events";

// vercel.json schedule "15 5 * * *" ≈ 07:15 Europe/Rome during CEST.

async function runEnsure() {
  const supabase = createAdminClient();
  const configuredAdminId = process.env.EVENT_DISCOVERY_ADMIN_USER_ID?.trim();

  let adminUserId = configuredAdminId || "";
  if (!adminUserId) {
    const { data: adminProfile, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();

    if (error || !adminProfile?.id) {
      throw new Error("Nessun profilo admin trovato per le ricorrenze.");
    }
    adminUserId = adminProfile.id as string;
  }

  return ensureRecurringSundayEvents({ supabase, adminUserId });
}

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
    const result = await runEnsure();
    await logCronRun({
      supabase: tryCreateAdminClient(),
      jobName: JOB_NAME,
      status: "success",
      startedAt,
      summary: result as unknown as Record<string, unknown>,
    });
    return NextResponse.json({ ok: true, ...result });
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
