import type { SupabaseClient } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  composeSubscriberNewsletter, courseFitsNewsletterWindow, loadWeekEvents,
  newsletterCourseWindow, pickEventsForGeo, runWeeklyNewsletter,
} from "./newsletter-week";
import { resolveGeoPreference } from "./geo-area";
import { newsletterRecipientKey, deliverNewsletterBatch } from "./newsletter-delivery";
import { POST as adminSend } from "../../app/api/admin/newsletter/send/route";

vi.mock("server-only", () => ({}));
const auth = vi.hoisted(() => vi.fn());
vi.mock("@/src/lib/admin/api-auth", () => ({ getAdminApiContext: auth }));

const now = new Date("2026-10-22T08:00:00Z");
const base = {
  id: "course-1", slug: "ceramica", title: "Ceramica", municipality: "Sassari", province: "SS",
  location_name: "Laboratorio", start_at: "2026-11-02T17:00:00+01:00", end_at: "2026-11-30T19:00:00+01:00",
  category: "ceramica", categories: ["ceramica"], subcategory: "imparare-arti", status: "published",
  is_free: false, price_from: 80,
};
const recipient = {
  id: "sub-1", full_name: null, municipality: "Sassari", province: "SS", newsletter_city: "Sassari",
  newsletter_category: "ceramica", newsletter_unsub_token: "dummy-token", email: "subscriber@example.test",
  email_confirmed: true, recipient_source: "subscriber",
};
function client(events: unknown[] = [base]) {
  const rpc = vi.fn(async (name: string) => {
    if (name !== "newsletter_delivery_recipients") throw new Error(`Unexpected write RPC: ${name}`);
    return { data: [recipient], error: null };
  });
  const filters: unknown[][] = [];
  const builder = {
    select: () => builder, eq: () => builder,
    or: (...args: unknown[]) => { filters.push(args); return builder; },
    lt: () => builder,
    order: async () => ({ data: events, error: null }),
  };
  const from = vi.fn((table: string) => {
    if (table !== "events") throw new Error(`Unexpected table access: ${table}`);
    return builder;
  });
  return { value: { from, rpc } as unknown as SupabaseClient, from, rpc, filters };
}
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("newsletter for learning", () => {
  it("uses 28 Rome calendar days across the October clock change", () => {
    const range = newsletterCourseWindow(now);
    expect(range.start.toISOString()).toBe("2026-10-21T22:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-11-18T23:00:00.000Z");
    expect(courseFitsNewsletterWindow(base, now)).toBe(true);
    expect(courseFitsNewsletterWindow({ ...base, start_at: range.end.toISOString() }, now)).toBe(false);
    expect(courseFitsNewsletterWindow({ ...base, start_at: "2026-10-01T10:00:00Z", end_at: "2026-10-21T19:00:00Z" }, now)).toBe(false);
    expect(courseFitsNewsletterWindow({ ...base, start_at: "2026-10-01T10:00:00Z", end_at: "2026-12-01T19:00:00Z" }, now)).toBe(true);
  });
  it("filters generic events and ended courses from the already bounded query", async () => {
    const fake = client([base, { ...base, subcategory: null, category: "musica-concerti" },
      { ...base, start_at: "2026-10-01T10:00:00Z", end_at: "2026-10-05T10:00:00Z" }]);
    const result = await loadWeekEvents(now, fake.value);
    expect(result.events).toEqual([base]);
    expect(fake.from).toHaveBeenCalledTimes(1);
    expect(fake.filters).toHaveLength(2);
  });
  it("does not label southern courses as northern proposals", () => {
    const geo = resolveGeoPreference({ newsletterCity: "Sassari" });
    const picked = pickEventsForGeo([base, { ...base, id: "south", municipality: "Cagliari", province: "CA" }], geo, "ceramica");
    expect([...picked.nearbyEvents, ...picked.areaEvents].map(e => e.id)).toEqual([base.id]);
  });
  it("uses the new catalogue, honest selection text, safe HTML and unsubscribe", () => {
    const preview = composeSubscriberNewsletter({
      subscriber: { ...recipient, full_name: '<img src=x onerror=alert(1)>' }, events: [base], weekLabel: "19–25 ottobre", siteUrl: "https://www.everas.it",
    });
    expect(preview.html).toContain('/imparare-e-fare-in-sardegna?area=nord-sardegna');
    expect(preview.html).toContain('prossime quattro settimane');
    expect(preview.html).toContain('newsletter/disiscriviti?token=dummy-token');
    expect(preview.html).not.toContain('<img src=x');
    expect(preview.html).not.toContain('Vedi tutti gli eventi');
  });
  it("simulates all recipients during the pause without writes or provider calls", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now); vi.stubEnv("VERCEL_ENV", "preview");
    const network = vi.fn(() => { throw new Error("network forbidden"); }); vi.stubGlobal("fetch", network);
    const fake = client();
    const result = await runWeeklyNewsletter({ dryRun: true, supabase: fake.value });
    expect(result).toMatchObject({ dryRun: true, simulated: 1, sent: 0, subscribers: 1 });
    expect(fake.rpc.mock.calls.map(call => call[0])).toEqual(["newsletter_delivery_recipients"]);
    expect(network).not.toHaveBeenCalled();
  });
  it("simulates a test email without claiming a delivery", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now); const fake = client();
    const result = await runWeeklyNewsletter({ dryRun: true, testEmail: "test@example.test", supabase: fake.value });
    expect(result).toMatchObject({ dryRun: true, simulated: 1, sent: 0 });
    expect(fake.rpc).not.toHaveBeenCalled();
  });
  it("requires admin authorization even for a read-only simulation", async () => {
    auth.mockResolvedValue({ ok: false, response: new Response("Unauthorized", { status: 401 }) });
    const response = await adminSend(new Request("https://example.test/send", { method: "POST", body: JSON.stringify({ dryRun: true }) }));
    expect(response.status).toBe(401);
  });
  it("separates tests but keeps the real identity across signup sources without storing the address", () => {
    const a = newsletterRecipientKey("profile", "account", " Same@example.test ");
    expect(a).toBe(newsletterRecipientKey("subscriber", "signup", "same@example.test"));
    expect(a).not.toContain("example.test");
    expect(a.length).toBeLessThanOrEqual(80);
    expect(a).not.toBe(newsletterRecipientKey("test", "same@example.test", "same@example.test"));
  });
  it("bounds unsuccessful provider attempts as well as successful deliveries", async () => {
    const perform = vi.fn(async () => { throw new Error("provider unavailable"); });
    const result = await deliverNewsletterBatch({
      weekKey: "2026-10-19", recipients: Array.from({ length: 30 }, (_, n) => ({ id: String(n), source: "profile" as const })), limit: 20,
      claim: async () => ({ action: "send", idempotency_key: "dummy-key" }), complete: async () => {}, perform,
    });
    expect(result).toMatchObject({ failed: 20, remaining: 10, sent: 0 });
    expect(perform).toHaveBeenCalledTimes(20);
  });
});
