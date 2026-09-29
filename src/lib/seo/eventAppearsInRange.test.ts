import { describe, expect, it } from "vitest";

import {
  eventAppearsInRange,
  eventIntervalOverlapsRange,
} from "@/src/lib/seo/eventAppearsInRange";
import { getDateRange, getMonthRange } from "@/src/lib/seo/dateRange";
import { romeDayRange, romeYmd, zonedTimeToUtc } from "@/src/lib/seo/rome-time";
import { rollingWeekendRange } from "@/src/lib/seo/weekends";
import { EVENTS_EXPLORE_GRID_DEFAULT_INITIAL, ssrVisibleExploreEvents } from "@/src/lib/seo/explore-grid";
import { eventsItemListSchema } from "@/src/lib/seo/schema";
import { parseEventScheduleMode } from "@/src/lib/eventScheduleMode";

/** Fixed Tuesday 2026-09-29 12:00 Europe/Rome (CEST = UTC+2). */
const TUE_2026_09_29 = new Date("2026-09-29T10:00:00.000Z");

describe("parseEventScheduleMode", () => {
  it("falls back to single for unknown values", () => {
    expect(parseEventScheduleMode(null)).toBe("single");
    expect(parseEventScheduleMode(undefined)).toBe("single");
    expect(parseEventScheduleMode("nope")).toBe("single");
    expect(parseEventScheduleMode("continuous")).toBe("continuous");
  });
});

describe("eventAppearsInRange — schedule_mode rules", () => {
  const today = romeDayRange("2026-09-29");
  const weekend = rollingWeekendRange(TUE_2026_09_29);
  const october = getMonthRange(2026, 9);

  it("1. single same day: included in oggi", () => {
    expect(
      eventAppearsInRange(
        {
          startAt: "2026-09-29T18:00:00+02:00",
          endAt: "2026-09-29T20:00:00+02:00",
          scheduleMode: "single",
        },
        today,
        "daily",
      ),
    ).toBe(true);
  });

  it("2. single outside range: excluded", () => {
    expect(
      eventAppearsInRange(
        {
          startAt: "2026-10-10T18:00:00+02:00",
          endAt: null,
          scheduleMode: "single",
        },
        today,
        "daily",
      ),
    ).toBe(false);
  });

  it("3. continuous spanning a month: included on overlapping days", () => {
    const show = {
      startAt: "2026-09-01T10:00:00+02:00",
      endAt: "2026-09-30T23:59:00+02:00",
      scheduleMode: "continuous" as const,
    };
    expect(eventAppearsInRange(show, today, "daily")).toBe(true);
    expect(eventAppearsInRange(show, weekend, "weekend")).toBe(false);
    expect(
      eventAppearsInRange(show, getMonthRange(2026, 8), "month"),
    ).toBe(true);
  });

  it("4. series spanning a month: excluded from oggi and weekend", () => {
    const series = {
      startAt: "2026-09-01T10:00:00+02:00",
      endAt: "2026-09-30T23:59:00+02:00",
      scheduleMode: "series" as const,
    };
    expect(eventAppearsInRange(series, today, "daily")).toBe(false);
    expect(eventAppearsInRange(series, weekend, "weekend")).toBe(false);
  });

  it("5. container spanning three months: excluded from oggi and weekend", () => {
    const container = {
      startAt: "2026-09-05T10:00:00+02:00",
      endAt: "2026-12-13T23:59:00+01:00",
      scheduleMode: "container" as const,
    };
    expect(eventAppearsInRange(container, today, "daily")).toBe(false);
    expect(eventAppearsInRange(container, weekend, "weekend")).toBe(false);
  });

  it("6. series and container appear in monthly pages", () => {
    const series = {
      startAt: "2026-09-01T10:00:00+02:00",
      endAt: "2026-10-31T23:59:00+01:00",
      scheduleMode: "series" as const,
    };
    const container = {
      startAt: "2026-09-05T10:00:00+02:00",
      endAt: "2026-12-13T23:59:00+01:00",
      scheduleMode: "container" as const,
    };
    expect(eventAppearsInRange(series, october, "month")).toBe(true);
    expect(eventAppearsInRange(container, october, "month")).toBe(true);
  });

  it("7. missing end_at treated as single day", () => {
    expect(
      eventAppearsInRange(
        {
          startAt: "2026-09-29T21:00:00+02:00",
          endAt: null,
          scheduleMode: "single",
        },
        today,
        "daily",
      ),
    ).toBe(true);
    expect(
      eventAppearsInRange(
        {
          startAt: "2026-09-28T21:00:00+02:00",
          endAt: null,
          scheduleMode: "single",
        },
        today,
        "daily",
      ),
    ).toBe(false);
  });

  it("8. overnight single crossing midnight is included on both civil days", () => {
    const overnight = {
      startAt: "2026-09-29T23:00:00+02:00",
      endAt: "2026-09-30T02:00:00+02:00",
      scheduleMode: "single" as const,
    };
    expect(eventAppearsInRange(overnight, today, "daily")).toBe(true);
    expect(
      eventAppearsInRange(overnight, romeDayRange("2026-09-30"), "daily"),
    ).toBe(true);
    expect(
      eventAppearsInRange(overnight, romeDayRange("2026-09-28"), "daily"),
    ).toBe(false);
  });

  it("9. half-open [start, end) boundaries", () => {
    const range = {
      start: zonedTimeToUtc("2026-09-29", "00:00:00"),
      end: zonedTimeToUtc("2026-09-30", "00:00:00"),
    };
    // Touches range.start from below → included (eventEnd >= range.start)
    expect(
      eventIntervalOverlapsRange(
        {
          startAt: "2026-09-28T10:00:00+02:00",
          endAt: "2026-09-29T00:00:00+02:00",
        },
        range,
      ),
    ).toBe(true);
    // Starts exactly at range.end → excluded
    expect(
      eventIntervalOverlapsRange(
        {
          startAt: "2026-09-30T00:00:00+02:00",
          endAt: "2026-09-30T12:00:00+02:00",
        },
        range,
      ),
    ).toBe(false);
  });

  it("10. weekend window is Europe/Rome Fri–Sun", () => {
    expect(romeYmd(weekend.start)).toBe("2026-10-02");
    expect(romeYmd(new Date(weekend.end.getTime() - 1))).toBe("2026-10-04");
    const fridayConcert = {
      startAt: "2026-10-02T21:00:00+02:00",
      endAt: null,
      scheduleMode: "single" as const,
    };
    expect(eventAppearsInRange(fridayConcert, weekend, "weekend")).toBe(true);
    expect(eventAppearsInRange(fridayConcert, today, "daily")).toBe(false);
  });
});

describe("getMonthRange — Europe/Rome and DST", () => {
  it("11a. March 2026 DST start: month bounds at Rome midnight", () => {
    const march = getMonthRange(2026, 2);
    expect(romeYmd(march.start)).toBe("2026-03-01");
    expect(romeYmd(new Date(march.end.getTime() - 1))).toBe("2026-03-31");
    // Before EU DST (29 Mar 2026): CET = UTC+1 → 00:00 Rome = 23:00 previous UTC
    expect(march.start.toISOString()).toBe("2026-02-28T23:00:00.000Z");
    // April 1 00:00 CEST = UTC+2
    expect(march.end.toISOString()).toBe("2026-03-31T22:00:00.000Z");
  });

  it("11b. October 2026 DST end: month bounds at Rome midnight", () => {
    const october = getMonthRange(2026, 9);
    expect(romeYmd(october.start)).toBe("2026-10-01");
    expect(romeYmd(new Date(october.end.getTime() - 1))).toBe("2026-10-31");
    // 1 Oct 2026 is still CEST (UTC+2)
    expect(october.start.toISOString()).toBe("2026-09-30T22:00:00.000Z");
    // 1 Nov 2026 00:00 CET after DST end (25 Oct) = UTC+1
    expect(october.end.toISOString()).toBe("2026-10-31T23:00:00.000Z");
  });
});

describe("eventsItemListSchema matches SSR visible cards", () => {
  it("12. ItemList length and URLs equal first N SSR events", () => {
    const events = Array.from({ length: 15 }, (_, index) => ({
      title: `Evento ${index + 1}`,
      id: `slug-${index + 1}`,
    }));
    const visible = ssrVisibleExploreEvents(events);
    const schema = eventsItemListSchema({
      name: "Eventi oggi",
      path: "/eventi-oggi",
      events: visible,
      limit: visible.length,
    });
    expect(schema).toBeDefined();
    const elements = schema!.itemListElement as Array<{
      position: number;
      name: string;
      url: string;
    }>;
    expect(schema!.numberOfItems).toBe(EVENTS_EXPLORE_GRID_DEFAULT_INITIAL);
    expect(elements).toHaveLength(EVENTS_EXPLORE_GRID_DEFAULT_INITIAL);
    expect(elements.map((item) => item.name)).toEqual(
      visible.map((e) => e.title),
    );
    expect(elements[0].url).toContain("/eventi/slug-1");
    expect(elements.at(-1)?.url).toContain(
      `/eventi/slug-${EVENTS_EXPLORE_GRID_DEFAULT_INITIAL}`,
    );
  });

  it("fixture matrix: continuous / container / series / single", () => {
    const today = getDateRange("oggi")!;
    // Freeze “today” by constructing ranges from fixed YMD instead of now()
    const fixedToday = romeDayRange(romeYmd(TUE_2026_09_29));
    const fixedWeekend = rollingWeekendRange(TUE_2026_09_29);
    const month = getMonthRange(2026, 9);

    const continuous = {
      startAt: "2026-09-01T10:00:00+02:00",
      endAt: "2026-10-15T18:00:00+02:00",
      scheduleMode: "continuous" as const,
    };
    const container = {
      startAt: "2026-09-05T10:00:00+02:00",
      endAt: "2026-12-13T23:59:00+01:00",
      scheduleMode: "container" as const,
    };
    const series = {
      startAt: "2026-09-19T20:00:00+02:00",
      endAt: "2026-12-13T22:00:00+01:00",
      scheduleMode: "series" as const,
    };
    const single = {
      startAt: "2026-09-29T21:00:00+02:00",
      endAt: null,
      scheduleMode: "single" as const,
    };

    expect(eventAppearsInRange(continuous, fixedToday, "daily")).toBe(true);
    expect(eventAppearsInRange(continuous, fixedWeekend, "weekend")).toBe(true);
    expect(eventAppearsInRange(continuous, month, "month")).toBe(true);

    expect(eventAppearsInRange(container, fixedToday, "daily")).toBe(false);
    expect(eventAppearsInRange(container, fixedWeekend, "weekend")).toBe(false);
    expect(eventAppearsInRange(container, month, "month")).toBe(true);

    expect(eventAppearsInRange(series, fixedToday, "daily")).toBe(false);
    expect(eventAppearsInRange(series, fixedWeekend, "weekend")).toBe(false);
    expect(eventAppearsInRange(series, month, "month")).toBe(true);

    expect(eventAppearsInRange(single, fixedToday, "daily")).toBe(true);
    expect(eventAppearsInRange(single, fixedWeekend, "weekend")).toBe(false);
    expect(eventAppearsInRange(single, month, "month")).toBe(false);

    void today;
  });
});
