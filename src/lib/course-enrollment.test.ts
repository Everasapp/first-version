import { describe, expect, it, vi } from "vitest";
vi.mock("@/src/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/src/lib/supabase/public", () => ({ createPublicClient: vi.fn() }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
import { parseEventScheduleMode, scheduleModeUsesEventSchema, ENROLLMENT_LABEL } from "./eventScheduleMode";
import { isPublicEventActive } from "./eventActive";
import { resolveEventStatusBadge } from "./eventStatusBadge";
import { formatEventDateRange, formatEventHoursDetail } from "./formatEventDate";
import { eventAppearsInRange } from "./seo/eventAppearsInRange";
import { eventSeoTitle, eventSeoDescription, eventDetailRobots } from "./seo/event-meta";
import { enrollmentCourseSchema } from "./seo/schema";
import { getEventBucket } from "./dashboardEvents";
import { sanitizeAdminEventUpdate } from "./events/admin-event-update";
import { mapPublishedEvent, type PublishedEventRow } from "./seo/loadEvents";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EventPracticalFacts from "@/src/components/events/EventPracticalFacts";

const now = new Date("2026-10-23T12:00:00Z");
describe("course intake without a scheduled date", () => {
  it("keeps a verified intake in the general catalogue without a fictional start", () => {
    expect(parseEventScheduleMode("enrollment")).toBe("enrollment");
    expect(isPublicEventActive(null, null, now, "enrollment")).toBe(true);
    expect(isPublicEventActive(null, null, now)).toBe(false);
    expect(formatEventDateRange(null, null, { scheduleMode: "enrollment" })).toBe(ENROLLMENT_LABEL);
    expect(formatEventHoursDetail(null, null, "enrollment").lines.join(" ")).toContain("Avvio e orari da definire");
    expect(resolveEventStatusBadge(null, null, now, "enrollment")).toEqual({ happeningNow: false, isActiveEvent: false, statusLabel: "Preiscrizioni aperte" });
  });
  it.each(["daily", "weekend", "month", "general"] as const)("does not imply attendance within a %s date range", context => {
    expect(eventAppearsInRange({ startAt: null, scheduleMode: "enrollment" }, { start: now, end: new Date("2027-01-01") }, context)).toBe(false);
  });
  it("publishes course metadata with no Event dates or guaranteed availability", () => {
    expect(eventSeoTitle("Corso GOL", "Sassari", null)).toBe("Corso GOL a Sassari");
    expect(eventSeoDescription("Corso GOL", "Sassari", null, "Preiscrizioni aperte")).not.toContain("1970");
    expect(eventDetailRobots(null, null, "enrollment")).toBeUndefined();
    expect(scheduleModeUsesEventSchema("enrollment")).toBe(false);
    const schema = enrollmentCourseSchema({ name: "Corso GOL", description: "Preiscrizioni aperte", url: "https://www.everas.it/eventi/corso", organizerName: "Ente", isFree: true });
    expect(schema["@type"]).toBe("Course");
    expect(schema).not.toHaveProperty("startDate");
    expect(schema).not.toHaveProperty("offers");
  });
  it("preserves null dates when editing and lists the course as published in the dashboard", () => {
    expect(sanitizeAdminEventUpdate({ schedule_mode: "enrollment", start_at: null, end_at: null })).toEqual({ schedule_mode: "enrollment", start_at: null, end_at: null });
    expect(getEventBucket({ status: "published", start_at: null, schedule_mode: "enrollment" }, now.getTime())).toBe("pubblicati");
  });
  it("maps actual catalogue rows to cards without a date or an in-progress badge", () => {
    const row: PublishedEventRow = { id: "course", slug: "course", title: "Corso GOL", category: "amministrazione-contabilita", subcategory: "imparare-professioni", province: "SS", municipality: "Sassari", location_name: "Ente", start_at: null, end_at: null, schedule_mode: "enrollment", image_url: null, is_free: true, price_from: null, status: "published", is_featured: false };
    const card = mapPublishedEvent(row);
    expect(card.date).toBe(ENROLLMENT_LABEL);
    expect(card.startDate).toBe("");
    expect(card.scheduleMode).toBe("enrollment");
    expect(card.happeningNow).toBe(false);
  });
  it("renders the practical information with no calendar date or time", () => {
    const html = renderToStaticMarkup(createElement(EventPracticalFacts, {
      startAt: null, endAt: null, scheduleMode: "enrollment", isFree: true, priceFrom: 0,
    }));
    expect(html).toContain("Avvio del corso");
    expect(html).toContain("Preiscrizioni aperte");
    expect(html).toContain("Avvio e orari da definire");
    expect(html).toContain("Partecipazione");
    expect(html).not.toContain("1970");
    expect(html).not.toContain("Tutto il giorno");
  });
});
