import { readFileSync } from "node:fs";
import path from "node:path";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants";
import { afterEach, describe, expect, it, vi } from "vitest";

import createNextConfig from "../../../next.config";

afterEach(() => vi.unstubAllEnvs());

function blankPublicConfig() {
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
}

describe("next config phase", () => {
  it("checks public configuration only while building a production deployment", () => {
    blankPublicConfig();

    expect(() => createNextConfig(PHASE_PRODUCTION_BUILD)).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("leaves server start and development alone even when production env is set", () => {
    blankPublicConfig();

    expect(() => createNextConfig(PHASE_PRODUCTION_SERVER)).not.toThrow();
    expect(() => createNextConfig(PHASE_DEVELOPMENT_SERVER)).not.toThrow();
  });

  it("keeps the production-environment guard during the build phase", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");

    expect(() => createNextConfig(PHASE_PRODUCTION_BUILD)).not.toThrow();
  });

  it("returns the same image and redirect settings outside the guard", () => {
    const config = createNextConfig(PHASE_DEVELOPMENT_SERVER);

    expect(config.images?.remotePatterns).toHaveLength(3);
    expect(config.headers).toEqual(expect.any(Function));
    expect(config.redirects).toEqual(expect.any(Function));
  });

  it("revalidates the sitemap route every 900 seconds and keeps the shared data cache", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "app/sitemap.ts"),
      "utf8",
    );

    expect(source).toContain("export const revalidate = 900;");
    expect(source).toContain("revalidate: PUBLISHED_EVENTS_CACHE_SECONDS");
  });
});
