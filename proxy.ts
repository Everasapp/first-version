import type { NextRequest } from "next/server";

import { updateSession } from "@/src/lib/supabase/update-session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api(?:/|$)|auth(?:/|$)|og(?:/|$)|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|woff2?)$).*)",
      has: [
        {
          type: "header",
          key: "cookie",
          // Whole Cookie header. Session names are sb-<ref>-auth-token and .0, .1, …
          // The PKCE verifier ends in -auth-token-code-verifier, so it does not match.
          value:
            ".*(?:^|;)\\s*sb-[^=;\\s]+-auth-token(?:\\.\\d+)?=[^;]*.*",
        },
      ],
    },
  ],
};
