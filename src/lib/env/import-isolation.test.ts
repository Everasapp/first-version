import { afterEach, describe, expect, it, vi } from "vitest";

const probes = vi.hoisted(() => ({
  discover: vi.fn(),
  tryCreateAdminClient: vi.fn(),
  createAdminClient: vi.fn(),
  diagnostics: vi.fn(),
  logCronRun: vi.fn(),
  getAdminApiContext: vi.fn(),
  ensureRecurring: vi.fn(),
  expireAdvertising: vi.fn(),
  revalidate: vi.fn(),
}));

vi.mock("@/src/lib/admin/discover-event-drafts", () => ({
  discoverAndImportEventDrafts: (...args: unknown[]) => probes.discover(...args),
}));
vi.mock("@/src/lib/supabase/admin", () => ({
  tryCreateAdminClient: () => probes.tryCreateAdminClient(),
  createAdminClient: () => probes.createAdminClient(),
  getAdminKeyDiagnostics: () => probes.diagnostics(),
}));
vi.mock("@/src/lib/cron/run-log", () => ({
  logCronRun: (...args: unknown[]) => probes.logCronRun(...args),
}));
vi.mock("@/src/lib/admin/api-auth", () => ({
  getAdminApiContext: () => probes.getAdminApiContext(),
}));
vi.mock("@/src/lib/admin/recurring-sunday-events", () => ({
  ensureRecurringSundayEvents: (...args: unknown[]) => probes.ensureRecurring(...args),
}));
vi.mock("@/src/lib/ads/orders", () => ({
  expireAdvertisingOrders: (...args: unknown[]) => probes.expireAdvertising(...args),
}));
vi.mock("@/src/lib/seo/revalidate-published-events", () => ({
  revalidatePublishedEvents: () => probes.revalidate(),
}));

import { POST as runImport } from "@/app/api/admin/import-runs/run/route";
import { POST as discoverDrafts } from "@/app/api/admin/events/discover-drafts/route";
import { GET as discoverCron, POST as discoverCronPost } from "@/app/api/cron/discover-events/route";
import { GET as ensureRecurring, POST as ensureRecurringPost } from "@/app/api/cron/ensure-recurring-events/route";
import { GET as expireAdvertising } from "@/app/api/cron/expire-advertising/route";
import { NextResponse } from "next/server";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  probes.discover.mockReset();
  probes.tryCreateAdminClient.mockReset();
  probes.createAdminClient.mockReset();
  probes.diagnostics.mockReset();
  probes.logCronRun.mockReset();
  probes.getAdminApiContext.mockReset();
  probes.ensureRecurring.mockReset();
  probes.expireAdvertising.mockReset();
  probes.revalidate.mockReset();
});

function armProbes() {
  probes.discover.mockImplementation(() => {
    throw new Error("import called");
  });
  probes.tryCreateAdminClient.mockImplementation(() => {
    throw new Error("database client created");
  });
  probes.createAdminClient.mockImplementation(() => {
    throw new Error("database client created");
  });
  probes.diagnostics.mockImplementation(() => {
    throw new Error("diagnostics read");
  });
  probes.logCronRun.mockImplementation(() => {
    throw new Error("cron log written");
  });
  probes.getAdminApiContext.mockImplementation(() => {
    throw new Error("admin auth called");
  });
  probes.ensureRecurring.mockImplementation(() => {
    throw new Error("recurring write called");
  });
  probes.expireAdvertising.mockImplementation(() => {
    throw new Error("advertising expiry called");
  });
  probes.revalidate.mockImplementation(() => {
    throw new Error("revalidate called");
  });
}

describe("import isolation", () => {
  it("stops the admin cron action before auth and fetch", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("CRON_SECRET", "test-cron-secret");
    const fetchSpy = vi.fn(() => {
      throw new Error("cron fetch called");
    });
    vi.stubGlobal("fetch", fetchSpy);
    armProbes();

    const response = await runImport();

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Importazione non disponibile fuori produzione.",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(probes.getAdminApiContext).not.toHaveBeenCalled();
    expect(probes.discover).not.toHaveBeenCalled();
  });

  it("stops the direct admin discovery route before auth and import", async () => {
    vi.stubEnv("VERCEL_ENV", "development");
    armProbes();

    const response = await discoverDrafts(
      new Request("https://preview.example.test/api/admin/events/discover-drafts", {
        method: "POST",
        body: JSON.stringify({ limit: 5 }),
      }),
    );

    expect(response.status).toBe(503);
    expect(probes.getAdminApiContext).not.toHaveBeenCalled();
    expect(probes.discover).not.toHaveBeenCalled();
  });

  it("stops the cron endpoint before the database and the importer", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("CRON_SECRET", "test-cron-secret");
    armProbes();
    const request = new Request("https://preview.example.test/api/cron/discover-events", {
      headers: { authorization: "Bearer test-cron-secret" },
    });

    const response = await discoverCron(request);
    const posted = await discoverCronPost(request);

    expect(response.status).toBe(503);
    expect(posted.status).toBe(503);
    expect(probes.tryCreateAdminClient).not.toHaveBeenCalled();
    expect(probes.createAdminClient).not.toHaveBeenCalled();
    expect(probes.logCronRun).not.toHaveBeenCalled();
    expect(probes.discover).not.toHaveBeenCalled();
  });

  it("still reaches admin auth in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    probes.getAdminApiContext.mockResolvedValue({
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    });
    const fetchSpy = vi.fn(() => {
      throw new Error("cron fetch called");
    });
    vi.stubGlobal("fetch", fetchSpy);

    const response = await runImport();

    expect(response.status).toBe(401);
    expect(probes.getAdminApiContext).toHaveBeenCalledOnce();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("stops recurring events and advertising expiry before any database call", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("CRON_SECRET", "test-cron-secret");
    armProbes();
    const request = new Request("https://preview.example.test/api/cron/maintenance", {
      headers: { authorization: "Bearer test-cron-secret" },
    });

    const recurring = await ensureRecurring(request);
    const recurringPost = await ensureRecurringPost(request);
    const expired = await expireAdvertising(request);

    expect(recurring.status).toBe(503);
    expect(recurringPost.status).toBe(503);
    expect(expired.status).toBe(503);
    expect(await recurring.json()).toEqual({
      error: "Operazione non disponibile fuori produzione.",
    });
    expect(probes.tryCreateAdminClient).not.toHaveBeenCalled();
    expect(probes.createAdminClient).not.toHaveBeenCalled();
    expect(probes.logCronRun).not.toHaveBeenCalled();
    expect(probes.ensureRecurring).not.toHaveBeenCalled();
    expect(probes.expireAdvertising).not.toHaveBeenCalled();
    expect(probes.revalidate).not.toHaveBeenCalled();
  });

  it("still authorizes recurring and advertising jobs in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    probes.logCronRun.mockResolvedValue(undefined);
    probes.ensureRecurring.mockImplementation(() => {
      throw new Error("recurring write called");
    });
    probes.expireAdvertising.mockImplementation(() => {
      throw new Error("advertising expiry called");
    });

    const request = new Request("https://www.everas.it/api/cron/maintenance");
    const recurring = await ensureRecurring(request);
    const expired = await expireAdvertising(request);

    expect(recurring.status).toBe(401);
    expect(expired.status).toBe(401);
    expect(probes.logCronRun).toHaveBeenCalled();
    expect(probes.ensureRecurring).not.toHaveBeenCalled();
    expect(probes.expireAdvertising).not.toHaveBeenCalled();
    expect(probes.createAdminClient).not.toHaveBeenCalled();
  });
});
