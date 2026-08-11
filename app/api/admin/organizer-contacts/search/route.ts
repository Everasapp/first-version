import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import { crawlOrganizerContacts } from "@/src/lib/admin/contact-crawler";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let body: { website?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON non valido" }, { status: 400 });
  }

  const website = typeof body.website === "string" ? body.website.trim() : "";
  if (!website) {
    return NextResponse.json({ error: "URL del sito obbligatorio" }, { status: 400 });
  }

  const result = await crawlOrganizerContacts(website);

  return NextResponse.json({
    ...result,
    name: typeof body.name === "string" ? body.name.trim() : "",
  });
}
