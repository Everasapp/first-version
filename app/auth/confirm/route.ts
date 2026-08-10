import { NextResponse } from "next/server";

/**
 * Avoid verifying on GET: email scanners often prefetch links and burn the token.
 * Forward users (and params) to a page that confirms only on explicit click.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const forward = new URLSearchParams();

  for (const key of ["token_hash", "type", "next", "redirect_to", "confirmation_url"]) {
    const value = searchParams.get(key);
    if (value) {
      forward.set(key === "redirect_to" ? "next" : key, value);
    }
  }

  const query = forward.toString();
  return NextResponse.redirect(
    `${origin}/conferma-email${query ? `?${query}` : ""}`,
  );
}
