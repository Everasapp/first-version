import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { listComuneEventCampaignRecipients } from "@/src/lib/admin/organizer-event-campaign";

export const runtime = "nodejs";

export async function GET() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  try {
    const { recipients, skipped } =
      await listComuneEventCampaignRecipients(auth.supabase);

    return NextResponse.json({
      ok: true,
      recipients,
      skipped,
      count: recipients.length,
      emails: recipients.map((row) => row.email),
      eventLinks: Object.fromEntries(
        recipients.map((row) => [
          row.email,
          { url: row.url, title: row.title },
        ]),
      ),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossibile caricare i Comuni con eventi",
      },
      { status: 500 },
    );
  }
}
