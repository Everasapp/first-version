import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { discoverAndImportEventDrafts } from "@/src/lib/admin/discover-event-drafts";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let limit = 20;
  try {
    const body = (await request.json().catch(() => ({}))) as {
      limit?: number;
    };
    if (typeof body.limit === "number" && body.limit > 0 && body.limit <= 40) {
      limit = body.limit;
    }
  } catch {
    // default limit
  }

  try {
    const result = await discoverAndImportEventDrafts({
      supabase: auth.supabase,
      adminUserId: auth.user.id,
      limit,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Discovery eventi non riuscita",
      },
      { status: 500 },
    );
  }
}
