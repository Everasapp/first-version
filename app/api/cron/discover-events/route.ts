import { NextResponse } from "next/server";

import { discoverAndImportEventDrafts } from "@/src/lib/admin/discover-event-drafts";
import { isCronAuthorized } from "@/src/lib/cron/auth";
import { logCronRun } from "@/src/lib/cron/run-log";
import { createAdminClient, tryCreateAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const JOB_NAME = "discover-events";

// vercel.json schedule "0 6 * * *" = 08:00 Europe/Rome during CEST.

async function runDiscovery() {
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
      throw new Error("Nessun profilo admin trovato per l'import automatico.");
    }
    adminUserId = adminProfile.id as string;
  }

  const limitRaw = Number.parseInt(
    process.env.EVENT_DISCOVERY_DAILY_LIMIT || "30",
    10,
  );
  const limit = Number.isFinite(limitRaw)
    ? Math.min(50, Math.max(1, limitRaw))
    : 30;

  return discoverAndImportEventDrafts({
    supabase,
    adminUserId,
    limit,
    publish: true,
  });
}

export async function GET(request: Request) {
  const startedAt = new Date();
  const adminClient = tryCreateAdminClient();

  if (!isCronAuthorized(request)) {
    await logCronRun({
      supabase: adminClient,
      jobName: JOB_NAME,
      status: "unauthorized",
      startedAt,
      summary: {
        hasCronSecret: Boolean(process.env.CRON_SECRET?.trim()),
        hasServiceRole: Boolean(adminClient),
        hasVercelCronHeader:
          request.headers.get("x-vercel-cron") === "1",
        hasAuthorization: Boolean(request.headers.get("authorization")),
      },
      errorMessage: "Unauthorized",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await logCronRun({
    supabase: adminClient,
    jobName: JOB_NAME,
    status: "started",
    startedAt,
    summary: {
      hasServiceRole: Boolean(adminClient),
      hasCronSecret: Boolean(process.env.CRON_SECRET?.trim()),
      hasAdminUserId: Boolean(
        process.env.EVENT_DISCOVERY_ADMIN_USER_ID?.trim(),
      ),
    },
  });

  try {
    const result = await runDiscovery();
    await logCronRun({
      supabase: adminClient ?? tryCreateAdminClient(),
      jobName: JOB_NAME,
      status: "success",
      startedAt,
      summary: {
        published: true,
        discoveredNew: result.discoveredNew,
        processed: result.processed,
        importedCount: result.importedCount,
        skippedCount: result.skippedCount,
        errorCount: result.errorCount,
        importedTitles: result.imported.map((row) => row.title),
        skippedSample: result.skipped.slice(0, 10),
      },
    });
    return NextResponse.json({ ok: true, published: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    await logCronRun({
      supabase: adminClient ?? tryCreateAdminClient(),
      jobName: JOB_NAME,
      status: "error",
      startedAt,
      summary: {
        hasServiceRole: Boolean(
          process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
            process.env.SUPABASE_SECRET_KEY?.trim(),
        ),
      },
      errorMessage: message,
    });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
