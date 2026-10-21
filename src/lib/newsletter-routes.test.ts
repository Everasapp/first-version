import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const fetchSpy = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("resend called");
  }),
);

function queryResult(data: unknown) {
  const builder: {
    select: () => typeof builder;
    eq: () => typeof builder;
    or: () => typeof builder;
    lt: () => typeof builder;
    order: () => typeof builder;
    insert: () => Promise<{ error: null }>;
    update: () => typeof builder;
    maybeSingle: () => Promise<{ data: null; error: null }>;
    then: (
      resolve: (value: { data: unknown; error: null }) => unknown,
      reject?: (reason: unknown) => unknown,
    ) => Promise<unknown>;
  } = {
    select: () => builder,
    eq: () => builder,
    or: () => builder,
    lt: () => builder,
    order: () => builder,
    insert: async () => ({ error: null }),
    update: () => builder,
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve, reject) => Promise.resolve({ data, error: null }).then(resolve, reject),
  };
  return builder;
}

const missingClaim = {
  code: "PGRST202",
  message: "Could not find the function public.claim_newsletter_delivery",
};

const fakeClient = {
  from(table: string) {
    if (table === "profiles") {
      return queryResult([
        {
          id: "user-1",
          full_name: "Ada",
          municipality: "Sassari",
          province: "SS",
          newsletter_city: "Sassari",
          newsletter_category: null,
          newsletter_unsub_token: "token",
        },
      ]);
    }
    return queryResult([]);
  },
  rpc(name: string) {
    if (name === "admin_newsletter_recipients") {
      return Promise.resolve({
        data: [
          {
            id: "user-1",
            full_name: "Ada",
            municipality: "Sassari",
            province: "SS",
            newsletter_city: "Sassari",
            newsletter_category: null,
            newsletter_unsub_token: "token",
            email: "ada@example.test",
            email_confirmed: true,
          },
        ],
        error: null,
      });
    }
    if (name === "claim_newsletter_delivery") {
      return Promise.resolve({ data: null, error: missingClaim });
    }
    return Promise.resolve({
      data: null,
      error: { message: `unexpected rpc ${name}` },
    });
  },
  auth: {
    admin: {
      getUserById: async () => ({
        data: {
          user: {
            email: "ada@example.test",
            email_confirmed_at: "2026-01-01T00:00:00Z",
          },
        },
        error: null,
      }),
    },
  },
};

vi.mock("@/src/lib/supabase/admin", () => ({
  tryCreateAdminClient: () => fakeClient,
  createAdminClient: () => fakeClient,
  getAdminKeyDiagnostics: vi.fn(),
}));

vi.mock("@/src/lib/supabase/server", () => ({
  createClient: async () => fakeClient,
}));

vi.mock("@/src/lib/cron/run-log", () => ({
  logCronRun: vi.fn(async () => undefined),
}));

vi.mock("@/src/lib/admin/api-auth", () => ({
  getAdminApiContext: async () => ({
    ok: true,
    supabase: fakeClient,
    user: { id: "admin-1" },
    profile: { role: "admin" },
  }),
}));

import { POST as adminSend } from "@/app/api/admin/newsletter/send/route";
import {
  GET as cronGet,
  POST as cronPost,
} from "@/app/api/cron/weekly-newsletter/route";
import { NEWSLETTER_STRUCTURE_MESSAGE } from "@/src/lib/newsletter-delivery";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchSpy.mockClear();
});

describe("weekly newsletter routes without the delivery table", () => {
  it("refuses the cron before Resend", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("CRON_SECRET", "test-cron-secret");
    vi.stubGlobal("fetch", fetchSpy);

    const request = new Request(
      "https://everas.example.test/api/cron/weekly-newsletter",
      { headers: { authorization: "Bearer test-cron-secret" } },
    );
    const response = await cronGet(request);
    const body = (await response.json()) as { error?: string };

    expect(response.status).toBe(500);
    expect(body.error).toBe(NEWSLETTER_STRUCTURE_MESSAGE);
    expect(fetchSpy).not.toHaveBeenCalled();

    const posted = await cronPost(request);
    expect(posted.status).toBe(500);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("refuses the admin send before Resend", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubGlobal("fetch", fetchSpy);

    const response = await adminSend(
      new Request("https://everas.example.test/api/admin/newsletter/send", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );
    const body = (await response.json()) as { error?: string };

    expect(response.status).toBe(500);
    expect(body.error).toBe(NEWSLETTER_STRUCTURE_MESSAGE);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
