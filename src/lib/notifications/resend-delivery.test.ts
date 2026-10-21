import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
// Keep environment-isolation coverage independent of the temporary release pause.
vi.mock("@/src/lib/newsletter-availability", () => ({
  WEEKLY_NEWSLETTER_PAUSED: false,
  WEEKLY_NEWSLETTER_PAUSED_MESSAGE: "Newsletter sospesa",
}));

const adminProbe = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("supabase called");
  }),
);
const insertProbe = vi.hoisted(() => vi.fn(async () => ({ error: null })));

vi.mock("@/src/lib/supabase/admin", () => ({
  tryCreateAdminClient: () => adminProbe(),
  createAdminClient: () => adminProbe(),
  getAdminKeyDiagnostics: vi.fn(),
}));
vi.mock("@/src/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: () => ({ insert: insertProbe }),
  })),
}));

import { sendCampaignEmailViaResend } from "@/src/lib/admin/email-campaigns";
import type { AdvertisingOrderRow } from "@/src/lib/ads/types";
import { sendAdvertisingRequestReceivedEmail } from "@/src/lib/ads/orders";
import { sendSignupConfirmationEmail } from "@/src/lib/auth/send-confirmation-email";
import { POST as contactPost } from "@/app/api/contact/route";
import { POST as suggestPost } from "@/app/api/suggest-event/route";
import { POST as sendCampaign } from "@/app/api/admin/campaigns/send/route";
import { GET as weeklyNewsletterCron } from "@/app/api/cron/weekly-newsletter/route";
import { deliverAdminEmail } from "@/src/lib/notifications/channels/email";
import { runWeeklyNewsletter } from "@/src/lib/newsletter-week";
import {
  RESEND_EMAILS_URL,
  postResendEmail,
} from "@/src/lib/notifications/resend-delivery";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  adminProbe.mockClear();
  insertProbe.mockClear();
});

const campaign = {
  to: "person@example.test",
  subject: "Prova",
  html: "<p>Prova</p>",
  from: "EVERAS <info@mail.everas.it>",
  replyTo: "info@everas.it",
};

describe("Resend delivery", () => {
  it("returns before the simulated fetch outside production", async () => {
    const fetchImpl = vi.fn(() => {
      throw new Error("resend called");
    });

    const result = await postResendEmail(
      { to: ["person@example.test"] },
      { VERCEL_ENV: "preview", RESEND_API_KEY: "test-resend-key" },
      fetchImpl as unknown as typeof fetch,
    );

    expect(result).toEqual({ blocked: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("calls only the simulated Resend endpoint in production", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ id: "email_simulated" }), { status: 200 }),
    );

    const result = await postResendEmail(
      { from: "EVERAS <info@mail.everas.it>", to: ["person@example.test"], subject: "Prova", html: "<p>Prova</p>" },
      { VERCEL_ENV: "production", RESEND_API_KEY: "test-resend-key" },
      fetchImpl as unknown as typeof fetch,
    );

    expect(result).toEqual({ blocked: false, ok: true, id: "email_simulated" });
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl).toHaveBeenCalledWith(
      RESEND_EMAILS_URL,
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("blocks campaign and newsletter sends before fetch", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchSpy = vi.fn(() => {
      throw new Error("resend called");
    });
    vi.stubGlobal("fetch", fetchSpy);

    await expect(sendCampaignEmailViaResend(campaign)).rejects.toThrow(
      "Invio email non disponibile fuori produzione.",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("blocks confirmation before Auth and Resend", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchSpy = vi.fn(() => {
      throw new Error("resend called");
    });
    vi.stubGlobal("fetch", fetchSpy);

    await expect(sendSignupConfirmationEmail("person@example.test")).resolves.toEqual({
      ok: false,
    });
    expect(adminProbe).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("blocks admin notifications before fetch", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchSpy = vi.fn(() => {
      throw new Error("resend called");
    });
    vi.stubGlobal("fetch", fetchSpy);

    await expect(
      deliverAdminEmail({
        type: "user_registered",
        title: "Nuovo utente",
        message: "Prova",
      }),
    ).rejects.toThrow("Invio email non disponibile fuori produzione.");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("blocks advertising mail before fetch", async () => {
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchSpy = vi.fn(() => {
      throw new Error("resend called");
    });
    vi.stubGlobal("fetch", fetchSpy);

    const result = await sendAdvertisingRequestReceivedEmail({
      contact_name: "Ada",
      package_name: "Banner",
      duration_months: 3,
      currency: "EUR",
      price: 60,
      email: "ada@example.test",
      access_token: "order-token",
    } as AdvertisingOrderRow);

    expect(result).toEqual({
      ok: false,
      error: "Invio email non disponibile fuori produzione.",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("stops the newsletter before reading subscribers", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const fetchSpy = vi.fn(() => {
      throw new Error("resend called");
    });
    vi.stubGlobal("fetch", fetchSpy);
    const supabase = {
      from() {
        throw new Error("database read");
      },
    };

    const summary = await runWeeklyNewsletter({
      supabase: supabase as never,
    });
    const cron = await weeklyNewsletterCron(
      new Request("https://preview.example.test/api/cron/weekly-newsletter"),
    );

    expect(summary.sent).toBe(0);
    expect(summary.errors[0]?.error).toBe(
      "Invio email non disponibile fuori produzione.",
    );
    expect(cron.status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(adminProbe).not.toHaveBeenCalled();
  });

  it("stops a campaign send before auth and Resend", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const fetchSpy = vi.fn(() => {
      throw new Error("resend called");
    });
    vi.stubGlobal("fetch", fetchSpy);

    const response = await sendCampaign(
      new Request("https://preview.example.test/api/admin/campaigns/send", {
        method: "POST",
      }),
    );

    expect(response.status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(adminProbe).not.toHaveBeenCalled();
  });

  it("does not call Resend for the contact form outside production", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchSpy = vi.fn(() => {
      throw new Error("resend called");
    });
    vi.stubGlobal("fetch", fetchSpy);

    const response = await contactPost(
      new Request("https://preview.example.test/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Ada",
          email: "ada@example.test",
          message: "Vorrei informazioni sul corso.",
        }),
      }),
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Funzione non disponibile in anteprima",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(insertProbe).not.toHaveBeenCalled();
  });

  it("does not store an event suggestion outside production", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const fetchSpy = vi.fn(() => {
      throw new Error("resend called");
    });
    vi.stubGlobal("fetch", fetchSpy);

    const response = await suggestPost(
      new Request("https://preview.example.test/api/suggest-event", {
        method: "POST",
        body: JSON.stringify({
          link: "https://example.test/evento",
          note: "Laboratorio del giovedì",
          email: "ada@example.test",
        }),
      }),
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Funzione non disponibile in anteprima",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(insertProbe).not.toHaveBeenCalled();
  });

  it("still stores the contact form in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchSpy = vi.fn(
      async () => new Response(JSON.stringify({ id: "email_simulated" }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    const response = await contactPost(
      new Request("https://www.everas.it/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Ada",
          email: "ada@example.test",
          message: "Vorrei informazioni sul corso.",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(insertProbe).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalled();
  });
});
