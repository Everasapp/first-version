import {
  AuthApiError,
  AuthRetryableFetchError,
  AuthSessionMissingError,
} from "@supabase/auth-js";
import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { config, proxy } from "../../../proxy";
import { updateSession } from "./update-session";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

const createServerClientMock = vi.mocked(createServerClient);

type CookieUpdate = {
  name: string;
  value: string;
  options?: { path?: string; httpOnly?: boolean; sameSite?: "lax"; maxAge?: number };
};

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

function request(pathname: string, cookie?: string) {
  return new NextRequest(`https://www.everas.it${pathname}`, {
    headers: cookie ? { cookie } : {},
  });
}

function stubPublicEnv() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-publishable-key");
}

function mockClaims(
  onClaims: (
    setAll: ((cookies: CookieUpdate[], headers: Record<string, string>) => Promise<void> | void) | undefined,
  ) => Promise<unknown>,
) {
  createServerClientMock.mockImplementation((_url, _key, options) => {
    const setAll = options.cookies.setAll as typeof onClaims extends (
      value: infer Value,
    ) => unknown
      ? Value
      : never;
    return {
      auth: {
        getClaims: vi.fn(() => onClaims(setAll)),
      },
    } as unknown as ReturnType<typeof createServerClient>;
  });
}

describe("session refresh", () => {
  it("does not call Auth for an anonymous public or protected visit", async () => {
    stubPublicEnv();

    for (const pathname of ["/", "/dashboard", "/admin", "/eventi/corso"]) {
      const response = await updateSession(request(pathname, "everas_seen=1"));
      expect(response.headers.get("location")).toBeNull();
      expect(response.cookies.getAll()).toEqual([]);
      expect(response.headers.get("cache-control")).toBeNull();
    }

    expect(createServerClientMock).not.toHaveBeenCalled();
  });

  it("verifies a valid session without rewriting cookies or the public cache", async () => {
    stubPublicEnv();
    mockClaims(async () => ({ data: { claims: { sub: "user-1" } }, error: null }));
    const current = request("/", "sb-example-auth-token=valid-session; theme=light");

    const response = await updateSession(current);

    expect(createServerClientMock).toHaveBeenCalledOnce();
    expect(createServerClientMock.mock.calls[0][0]).toBe("https://example.supabase.co");
    expect(createServerClientMock.mock.calls[0][1]).toBe("test-publishable-key");
    const client = createServerClientMock.mock.results[0].value as {
      auth: { getClaims: ReturnType<typeof vi.fn> };
    };
    expect(client.auth.getClaims).toHaveBeenCalledOnce();
    expect(current.cookies.get("sb-example-auth-token")?.value).toBe("valid-session");
    expect(current.cookies.get("theme")?.value).toBe("light");
    expect(response.cookies.get("sb-example-auth-token")).toBeUndefined();
    expect(response.headers.get("cache-control")).toBeNull();
    expect(response.headers.get("location")).toBeNull();
  });

  it("propagates a refreshed session to the request and the response", async () => {
    stubPublicEnv();
    mockClaims(async (setAll) => {
      await setAll?.([
        {
          name: "sb-example-auth-token",
          value: "refreshed-session",
          options: { path: "/", httpOnly: true, sameSite: "lax" },
        },
      ], {
        "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
        Expires: "0",
        Pragma: "no-cache",
      });
      return { data: { claims: { sub: "user-1" } }, error: null };
    });
    const current = request(
      "/dashboard",
      "sb-example-auth-token.0=expired-session; theme=light",
    );

    const response = await proxy(current);
    const forwarded = response.headers.get("x-middleware-request-cookie") ?? "";

    expect(current.cookies.get("sb-example-auth-token")?.value).toBe("refreshed-session");
    expect(current.cookies.get("theme")?.value).toBe("light");
    expect(response.cookies.get("sb-example-auth-token")?.value).toBe("refreshed-session");
    expect(response.headers.get("cache-control")).toBe(
      "private, no-cache, no-store, must-revalidate, max-age=0",
    );
    expect(response.headers.get("expires")).toBe("0");
    expect(response.headers.get("pragma")).toBe("no-cache");
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(forwarded).toContain("theme=light");
    expect(forwarded).toContain("sb-example-auth-token=refreshed-session");
    expect(response.headers.get("location")).toBeNull();
  });

  it("keeps every cookie and header across repeated setAll calls", async () => {
    stubPublicEnv();
    mockClaims(async (setAll) => {
      await setAll?.([
        { name: "sb-example-auth-token", value: "first", options: { path: "/" } },
      ], { "Cache-Control": "private, no-store" });
      await setAll?.([
        { name: "sb-example-auth-token.1", value: "second", options: { path: "/" } },
      ], { Pragma: "no-cache" });
      return { data: { claims: { sub: "user-1" } }, error: null };
    });
    const current = request("/", "sb-example-auth-token=old; theme=light");

    const response = await updateSession(current);
    const forwarded = response.headers.get("x-middleware-request-cookie") ?? "";

    expect(response.cookies.get("sb-example-auth-token")?.value).toBe("first");
    expect(response.cookies.get("sb-example-auth-token.1")?.value).toBe("second");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("pragma")).toBe("no-cache");
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-middleware-override-headers")).toContain("cookie");
    expect(forwarded).toContain("theme=light");
    expect(forwarded).toContain("sb-example-auth-token=first");
    expect(forwarded).toContain("sb-example-auth-token.1=second");
  });

  it("removes a cleared cookie from the forwarded request and the response", async () => {
    stubPublicEnv();
    mockClaims(async (setAll) => {
      await setAll?.([
        { name: "sb-example-auth-token", value: "", options: { path: "/", maxAge: 0 } },
      ], { "Cache-Control": "private, no-store" });
      return { data: { claims: { sub: "user-1" } }, error: null };
    });
    const current = request("/dashboard", "sb-example-auth-token=old; theme=light");

    const response = await updateSession(current);
    const forwarded = response.headers.get("x-middleware-request-cookie") ?? "";

    expect(current.cookies.get("sb-example-auth-token")).toBeUndefined();
    expect(current.cookies.get("theme")?.value).toBe("light");
    expect(response.cookies.get("sb-example-auth-token")?.value).toBe("");
    expect(forwarded).toContain("theme=light");
    expect(forwarded).not.toContain("sb-example-auth-token=");
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("keeps previous cookies when Auth reports a retryable network failure", async () => {
    stubPublicEnv();
    mockClaims(async (setAll) => {
      await setAll?.([
        { name: "sb-example-auth-token", value: "", options: { path: "/", maxAge: 0 } },
      ], { "Cache-Control": "private, no-store" });
      return {
        data: null,
        error: new AuthRetryableFetchError("Service temporarily unavailable", 503),
      };
    });
    const current = request("/eventi/corso", "sb-example-auth-token=still-valid; theme=light");

    const response = await updateSession(current);
    const forwarded = response.headers.get("x-middleware-request-cookie") ?? "";

    expect(current.cookies.get("sb-example-auth-token")?.value).toBe("still-valid");
    expect(current.cookies.get("theme")?.value).toBe("light");
    expect(response.cookies.getAll()).toEqual([]);
    expect(response.headers.get("cache-control")).toBeNull();
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(forwarded).toContain("sb-example-auth-token=still-valid");
    expect(forwarded).toContain("theme=light");
  });

  it("keeps previous cookies when the Auth request throws a network error", async () => {
    stubPublicEnv();
    mockClaims(async (setAll) => {
      await setAll?.([
        { name: "sb-example-auth-token", value: "", options: { path: "/", maxAge: 0 } },
      ], { "Cache-Control": "private, no-store" });
      throw new AuthRetryableFetchError("Failed to fetch", 0);
    });
    const current = request("/", "sb-example-auth-token.0=still-valid; theme=light");

    const response = await updateSession(current);
    const forwarded = response.headers.get("x-middleware-request-cookie") ?? "";

    expect(current.cookies.get("sb-example-auth-token.0")?.value).toBe("still-valid");
    expect(response.cookies.getAll()).toEqual([]);
    expect(response.headers.get("cache-control")).toBeNull();
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(forwarded).toContain("sb-example-auth-token.0=still-valid");
  });

  it("keeps previous cookies for a generic Auth error", async () => {
    stubPublicEnv();
    mockClaims(async (setAll) => {
      await setAll?.([
        { name: "sb-example-auth-token", value: "", options: { path: "/", maxAge: 0 } },
      ], { "Cache-Control": "private, no-store" });
      return {
        data: null,
        error: new AuthApiError("unexpected failure", 400, "unexpected_failure"),
      };
    });
    const current = request("/dashboard", "sb-example-auth-token=still-valid; theme=light");

    const response = await updateSession(current);

    expect(current.cookies.get("sb-example-auth-token")?.value).toBe("still-valid");
    expect(current.cookies.get("theme")?.value).toBe("light");
    expect(response.cookies.getAll()).toEqual([]);
    expect(response.headers.get("cache-control")).toBeNull();
    expect(response.headers.get("location")).toBeNull();
  });

  it.each([
    ["refresh_token_not_found", new AuthApiError("refresh token not found", 400, "refresh_token_not_found")],
    ["refresh_token_already_used", new AuthApiError("refresh token already used", 400, "refresh_token_already_used")],
    ["session_expired", new AuthApiError("session expired", 401, "session_expired")],
    ["session_not_found", new AuthApiError("session not found", 400, "session_not_found")],
    ["AuthSessionMissingError", new AuthSessionMissingError()],
  ] as const)("keeps library removals when the session cannot be renewed (%s)", async (_label, error) => {
    stubPublicEnv();
    mockClaims(async (setAll) => {
      await setAll?.([
        { name: "sb-example-auth-token", value: "", options: { path: "/", maxAge: 0 } },
      ], { "Cache-Control": "private, no-store" });
      return { data: null, error };
    });
    const current = request("/dashboard", "sb-example-auth-token=dead; theme=light");

    const response = await updateSession(current);
    const forwarded = response.headers.get("x-middleware-request-cookie") ?? "";

    expect(current.cookies.get("sb-example-auth-token")).toBeUndefined();
    expect(current.cookies.get("theme")?.value).toBe("light");
    expect(response.cookies.get("sb-example-auth-token")?.value).toBe("");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("location")).toBeNull();
    expect(forwarded).toContain("theme=light");
    expect(forwarded).not.toContain("sb-example-auth-token=");
  });

  it("ignores a PKCE verifier that is not a session", async () => {
    const response = await updateSession(
      request("/", "sb-example-auth-token-code-verifier=verifier"),
    );

    expect(createServerClientMock).not.toHaveBeenCalled();
    expect(response.cookies.getAll()).toEqual([]);
  });
});

describe("proxy matcher", () => {
  function matches(url: string, cookies?: Record<string, string>) {
    return unstable_doesMiddlewareMatch({
      config,
      url,
      cookies,
      nextConfig: {},
    });
  }

  it("skips anonymous visits and the PKCE verifier", () => {
    expect(matches("/")).toBe(false);
    expect(matches("/dashboard")).toBe(false);
    expect(matches("/eventi/corso", { everas_seen: "1" })).toBe(false);
    expect(matches("/", {
      "sb-example-auth-token-code-verifier": "verifier",
    })).toBe(false);
  });

  it("matches a session cookie and its chunks on pages that can refresh", () => {
    expect(matches("/", { "sb-example-auth-token": "valid" })).toBe(true);
    expect(matches("/eventi/corso", { "sb-example-auth-token.0": "chunk" })).toBe(true);
    expect(matches("/dashboard", { "sb-example-auth-token.1": "chunk" })).toBe(true);
    expect(matches("/admin", {
      "sb-example-auth-token-code-verifier": "verifier",
      "sb-example-auth-token": "valid",
    })).toBe(true);
    expect(matches("/imparare-e-fare-in-sardegna", {
      "sb-example-auth-token": "valid",
    })).toBe(true);
    expect(matches("/organizzatori/mc-design", {
      "sb-example-auth-token.0": "chunk",
    })).toBe(true);
  });

  it("keeps the existing path exclusions even when a session cookie is present", () => {
    const cookies = { "sb-example-auth-token": "valid" };
    expect(matches("/_next/static/chunks/app.js", cookies)).toBe(false);
    expect(matches("/_next/image?url=/images/hero.webp", cookies)).toBe(false);
    expect(matches("/favicon.ico", cookies)).toBe(false);
    expect(matches("/images/learning/imparare-sardegna-hero.webp", cookies)).toBe(false);
    expect(matches("/sitemap.xml", cookies)).toBe(false);
    expect(matches("/robots.txt", cookies)).toBe(false);
    expect(matches("/api/cron/weekly-newsletter", cookies)).toBe(false);
    expect(matches("/api/admin/newsletter/send", cookies)).toBe(false);
    expect(matches("/auth/callback?code=fake", cookies)).toBe(false);
    expect(matches("/og/evento/corso", cookies)).toBe(false);
  });
});
