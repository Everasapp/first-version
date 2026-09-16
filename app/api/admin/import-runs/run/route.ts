import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { getSiteUrl } from "@/src/lib/notifications/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return NextResponse.json(
      { error: "Manca CRON_SECRET su Vercel." },
      { status: 500 },
    );
  }

  const response = await fetch(`${getSiteUrl()}/api/cron/discover-events`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      "x-everas-triggered-by": "admin",
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  return NextResponse.json(data, { status: response.status });
}
