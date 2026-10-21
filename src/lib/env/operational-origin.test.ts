import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/src/lib/notifications/config";
import { SITE_URL } from "@/src/lib/seo/site";
import { getOperationalOrigin, importCronUrl } from "./operational-origin";

const root = path.resolve(__dirname, "../../..");

afterEach(() => vi.unstubAllEnvs());

describe("public and operational origins", () => {
  it("keeps the canonical site on www.everas.it", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(SITE_URL).toBe("https://www.everas.it");
    expect(getSiteUrl()).toBe("https://www.everas.it");
  });

  it("uses the public origin for production operations", () => {
    const env = { VERCEL_ENV: "production" };
    expect(getOperationalOrigin(env)).toBe("https://www.everas.it");
    expect(importCronUrl(env)).toBe(
      "https://www.everas.it/api/cron/discover-events",
    );
  });

  it("keeps an explicit production site url, without a trailing slash", () => {
    const env = {
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://www.everas.it/",
    };
    expect(getOperationalOrigin(env)).toBe("https://www.everas.it");
    expect(importCronUrl(env)).toBe(
      "https://www.everas.it/api/cron/discover-events",
    );
  });

  it("does not send a preview import to www.everas.it", () => {
    const env = {
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_SITE_URL: "https://www.everas.it",
      HOST: "attacker.example",
      "x-forwarded-host": "attacker.example",
    };
    expect(getOperationalOrigin(env)).toBeNull();
    expect(importCronUrl(env)).toBeNull();
  });

  it("does not call the preview deployment either", () => {
    const env = {
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_SITE_URL: "https://preview.example.test",
      VERCEL_URL: "everas-git-preview.vercel.app",
    };
    expect(importCronUrl(env)).toBeNull();
  });

  it("uses a non-production configured site before the deployment host", () => {
    const env = {
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_SITE_URL: "https://preview.example.test/",
      VERCEL_URL: "everas-git-preview.vercel.app",
    };
    expect(getOperationalOrigin(env)).toBe("https://preview.example.test");
  });

  it("stays unavailable when no environment is configured", () => {
    expect(getOperationalOrigin({})).toBeNull();
    expect(importCronUrl({ VERCEL_ENV: "development" })).toBeNull();
  });

  it("does not build the import call from a host header", () => {
    const route = readFileSync(
      path.join(root, "app/api/admin/import-runs/run/route.ts"),
      "utf8",
    );
    const auth = readFileSync(path.join(root, "app/(auth)/actions.ts"), "utf8");
    expect(route).toContain("importCronUrl");
    expect(route).not.toContain("getSiteUrl");
    expect(route).not.toContain("x-forwarded-host");
    expect(auth).not.toContain("x-forwarded-host");
    expect(auth).not.toContain('get("host")');
  });

  it("records that preview still shares the configured database and does not auto-deploy", () => {
    const note = readFileSync(
      path.join(root, "src/lib/env/operational-origin.ts"),
      "utf8",
    );
    const vercel = JSON.parse(
      readFileSync(path.join(root, "vercel.json"), "utf8"),
    ) as {
      git: { deploymentEnabled: Record<string, boolean> };
    };

    expect(note).toContain(
      "Authentication, session refresh, and admin panels still use the Supabase",
    );
    expect(note).toContain("Preview is not fully isolated.");
    expect(
      vercel.git.deploymentEnabled["revision/homepage-learning-handoff-20261021"],
    ).toBe(false);
  });
});
