import { afterEach, describe, expect, it, vi } from "vitest";
import { isCronAuthorized } from "./auth";

afterEach(() => vi.unstubAllEnvs());

const request = (authorization?: string, cron = false) => new Request("https://example.test/cron", {
  headers: {
    ...(authorization ? { authorization } : {}),
    ...(cron ? { "x-vercel-cron": "1" } : {}),
  },
});

describe("cron authorization", () => {
  it("requires a configured nonempty secret even with the cron header", () => {
    vi.stubEnv("CRON_SECRET", undefined);
    expect(isCronAuthorized(request("Bearer undefined", true))).toBe(false);
    vi.stubEnv("CRON_SECRET", "");
    expect(isCronAuthorized(request(undefined, true))).toBe(false);
  });
  it("rejects missing or wrong bearer tokens even with the cron header", () => {
    vi.stubEnv("CRON_SECRET", "MixedCase-test-secret");
    expect(isCronAuthorized(request(undefined, true))).toBe(false);
    expect(isCronAuthorized(request("Bearer wrong", true))).toBe(false);
    expect(isCronAuthorized(request("Bearer mixedcase-test-secret"))).toBe(false);
  });
  it("accepts only the exact bearer value, without depending on the cron header", () => {
    vi.stubEnv("CRON_SECRET", "MixedCase-test-secret");
    expect(isCronAuthorized(request("Bearer MixedCase-test-secret"))).toBe(true);
    expect(isCronAuthorized(request("Bearer MixedCase-test-secret", true))).toBe(true);
    expect(isCronAuthorized(request("bearer MixedCase-test-secret"))).toBe(false);
  });
});
