import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { collectOrganizerEmails } from "@/src/lib/admin/export-emails";

export const runtime = "nodejs";

export async function GET() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("organizer_directory")
    .select("email, email_cultura, email_turismo, email_eventi");

  if (error) {
    return NextResponse.json(
      { error: `Impossibile caricare la rubrica: ${error.message}` },
      { status: 500 },
    );
  }

  const emails = collectOrganizerEmails(data || []);

  return NextResponse.json({
    ok: true,
    emails,
    count: emails.length,
  });
}
