import { NextResponse } from "next/server";

import { discoverAndImportEventDrafts } from "@/src/lib/admin/discover-event-drafts";
import { createAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return false;
  }

  const header = request.headers.get("authorization");
  return header === `Bearer ${cronSecret}`;
}

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
    process.env.EVENT_DISCOVERY_DAILY_LIMIT || "20",
    10,
  );
  const limit = Number.isFinite(limitRaw)
    ? Math.min(40, Math.max(1, limitRaw))
    : 20;

  return discoverAndImportEventDrafts({
    supabase,
    adminUserId,
    limit,
    publish: true,
  });
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDiscovery();
    return NextResponse.json({ ok: true, published: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
