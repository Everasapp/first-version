import {
  isAuthApiError,
  isAuthRetryableFetchError,
  isAuthSessionMissingError,
} from "@supabase/auth-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Chunked session cookies end in .0, .1, … The PKCE verifier does not. */
const SESSION_COOKIE = /-auth-token(?:\.\d+)?$/;

/**
 * Codes that mean the refresh token or server session can no longer be renewed.
 * `session_not_found` is also surfaced as AuthSessionMissingError by this client.
 */
const TERMINAL_SESSION_CODES: ReadonlySet<string> = new Set([
  "refresh_token_not_found",
  "refresh_token_already_used",
  "session_expired",
  "session_not_found",
]);

function sessionCannotBeRenewed(error: unknown) {
  if (isAuthRetryableFetchError(error)) return false;
  if (isAuthSessionMissingError(error)) return true;
  return isAuthApiError(error) && !!error.code && TERMINAL_SESSION_CODES.has(error.code);
}

type PendingCookie = {
  name: string;
  value: string;
  options?: {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
  };
};

export function hasSupabaseSessionCookie(names: Iterable<string>) {
  for (const name of names) {
    if (SESSION_COOKIE.test(name)) return true;
  }
  return false;
}

function clearsCookie(cookie: PendingCookie) {
  if (cookie.value === "") return true;
  const options = cookie.options;
  if (!options) return false;
  if (typeof options.maxAge === "number" && options.maxAge <= 0) return true;
  if (options.expires != null && options.expires.getTime() <= Date.now()) return true;
  return false;
}

/**
 * Refreshes an existing Supabase session and copies the new cookies onto the
 * forwarded request and the response. Anonymous requests skip Auth entirely.
 * A retryable Auth or network failure keeps the cookies already on the request.
 * A session the client reports as unrenewable keeps the removals from setAll.
 * Authorization stays in the route that needs it.
 */
export async function updateSession(request: NextRequest) {
  if (!hasSupabaseSessionCookie(request.cookies.getAll().map((cookie) => cookie.name))) {
    return NextResponse.next();
  }

  const originalCookies = request.cookies.getAll().map(({ name, value }) => ({ name, value }));
  const appliedCookies: PendingCookie[] = [];
  const appliedHeaders: [string, string][] = [];
  let supabaseResponse = NextResponse.next({ request });

  function rememberCookie(cookie: PendingCookie) {
    const index = appliedCookies.findIndex((item) => item.name === cookie.name);
    if (index >= 0) appliedCookies.splice(index, 1);
    appliedCookies.push(cookie);
  }

  function rememberHeader(key: string, value: string) {
    const index = appliedHeaders.findIndex(([name]) => name.toLowerCase() === key.toLowerCase());
    if (index >= 0) appliedHeaders.splice(index, 1);
    appliedHeaders.push([key, value]);
  }

  function writeRequestCookie(cookie: PendingCookie) {
    if (clearsCookie(cookie)) {
      request.cookies.delete(cookie.name);
      return;
    }
    request.cookies.set(cookie.name, cookie.value);
  }

  function rebuildResponse() {
    const response = NextResponse.next({ request });
    for (const cookie of appliedCookies) {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    }
    for (const [key, value] of appliedHeaders) {
      response.headers.set(key, value);
    }
    return response;
  }

  function restoreRequestCookies() {
    const keep = new Set(originalCookies.map((cookie) => cookie.name));
    for (const cookie of request.cookies.getAll()) {
      if (!keep.has(cookie.name)) request.cookies.delete(cookie.name);
    }
    for (const cookie of originalCookies) {
      request.cookies.set(cookie.name, cookie.value);
    }
  }

  function passThrough() {
    restoreRequestCookies();
    return NextResponse.next({ request });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return supabaseResponse;

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const cookie of cookiesToSet) {
          writeRequestCookie(cookie);
          rememberCookie(cookie);
        }
        for (const [key, value] of Object.entries(headers)) {
          rememberHeader(key, value);
        }
        supabaseResponse = rebuildResponse();
      },
    },
  });

  try {
    const { error } = await supabase.auth.getClaims();
    if (error && !sessionCannotBeRenewed(error)) return passThrough();
  } catch (error) {
    if (!sessionCannotBeRenewed(error)) return passThrough();
  }

  return supabaseResponse;
}
