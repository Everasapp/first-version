import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const calls = vi.hoisted(() => ({ auth: vi.fn(), database: vi.fn(), log: vi.fn() }));
vi.mock("@/src/lib/admin/api-auth", () => ({ getAdminApiContext: calls.auth }));
vi.mock("@/src/lib/supabase/admin", () => ({
  createAdminClient: calls.database,
  tryCreateAdminClient: calls.database,
}));
vi.mock("@/src/lib/cron/run-log", () => ({ logCronRun: calls.log }));

import { GET, POST as cronPost } from "../../app/api/cron/weekly-newsletter/route";
import { POST as adminPost } from "../../app/api/admin/newsletter/send/route";
import { runWeeklyNewsletter } from "./newsletter-week";
import { WEEKLY_NEWSLETTER_PAUSED_MESSAGE } from "./newsletter-availability";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("temporary newsletter release pause", () => {
  it("blocks cron GET/POST and admin sends before auth, logs, database or email", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const network = vi.fn();
    vi.stubGlobal("fetch", network);
    for (const handler of [GET, cronPost, adminPost]) {
      const response = await handler(new Request("https://example.test/newsletter", { method: "POST" }));
      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({ error: WEEKLY_NEWSLETTER_PAUSED_MESSAGE });
    }
    expect(calls.auth).not.toHaveBeenCalled();
    expect(calls.database).not.toHaveBeenCalled();
    expect(calls.log).not.toHaveBeenCalled();
    expect(network).not.toHaveBeenCalled();
  });
  it("blocks direct and test-email delivery calls before data access", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const network = vi.fn();
    vi.stubGlobal("fetch", network);
    await expect(runWeeklyNewsletter()).rejects.toThrow(WEEKLY_NEWSLETTER_PAUSED_MESSAGE);
    await expect(runWeeklyNewsletter({ testEmail: "test@example.test" })).rejects.toThrow(WEEKLY_NEWSLETTER_PAUSED_MESSAGE);
    expect(calls.database).not.toHaveBeenCalled();
    expect(network).not.toHaveBeenCalled();
  });
  it("removes only the newsletter schedule while retaining the disabled preview branch", () => {
    const config = JSON.parse(readFileSync(new URL("../../vercel.json", import.meta.url), "utf8"));
    expect(config.crons.some((job: { path: string }) => job.path === "/api/cron/weekly-newsletter")).toBe(false);
    expect(config.crons.some((job: { path: string }) => job.path === "/api/cron/expire-advertising")).toBe(true);
    expect(config.git.deploymentEnabled["revision/homepage-learning-handoff-20261021"]).toBe(false);
  });
});
