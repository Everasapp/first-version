import { NextResponse } from "next/server";

import { ensureRecurringSundayEvents } from "@/src/lib/admin/recurring-sunday-events";
import { createAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// vercel.json schedule "15 5 * * *" ≈ 07:15 Europe/Rome during CEST.

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return false;
  }

  const header = request.headers.get("authorization");
  return header === `Bearer ${cronSecret}`;
}

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
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runEnsure();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
