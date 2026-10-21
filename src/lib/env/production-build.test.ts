import { afterEach, describe, expect, it, vi } from "vitest";

import { assertProductionBuildConfig } from "./production-build";

afterEach(() => vi.unstubAllEnvs());

const complete = {
  VERCEL_ENV: "production",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
};

describe("production build configuration", () => {
  it("ignores missing public configuration outside a production deployment", () => {
    expect(() => assertProductionBuildConfig({})).not.toThrow();
    expect(() =>
      assertProductionBuildConfig({ VERCEL_ENV: "preview" }),
    ).not.toThrow();
  });

  it("stops a production build when an inlined value is missing, without repeating that value", () => {
    expect(() =>
      assertProductionBuildConfig({
        ...complete,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "  ",
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
    expect(() =>
      assertProductionBuildConfig({
        ...complete,
        NEXT_PUBLIC_SUPABASE_URL: undefined,
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("allows a production build when only runtime secrets are absent", () => {
    expect(() => assertProductionBuildConfig(complete)).not.toThrow();
  });
});
