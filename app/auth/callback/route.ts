import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

function safeInternalPath(next: string | null): string {
  const fallback = "/accedi";

  if (!next) {
    return fallback;
  }

  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return fallback;
  }

  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeInternalPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/accedi?error=conferma`);
}
