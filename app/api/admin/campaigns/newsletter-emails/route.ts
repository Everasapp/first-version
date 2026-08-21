import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { parseEmailList } from "@/src/lib/admin/email-campaigns";

export const runtime = "nodejs";

type NewsletterRecipientRow = {
  email: string | null;
  email_confirmed?: boolean | null;
  role?: string | null;
};

export async function GET() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase.rpc("admin_newsletter_recipients");

  if (error) {
    return NextResponse.json(
      { error: `Impossibile caricare gli iscritti newsletter: ${error.message}` },
      { status: 500 },
    );
  }

  const rows = (data || []) as NewsletterRecipientRow[];
  const confirmed = rows.filter(
    (row) => row.email_confirmed !== false && Boolean(row.email?.trim()),
  );
  const emails = parseEmailList(
    confirmed.map((row) => row.email || "").join("\n"),
  );

  return NextResponse.json({
    ok: true,
    emails,
    count: emails.length,
    totalOptIn: rows.length,
  });
}
