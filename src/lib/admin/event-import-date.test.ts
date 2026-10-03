import { describe, expect, it } from "vitest";
import { extractSourceDateTime } from "./event-import";

describe("source event date and time", () => {
  it("converts the Jazzino UTC time to Rome before import", () => {
    expect(extractSourceDateTime("2026-10-10T19:45:00.000Z")).toEqual({ date: "2026-10-10", time: "21:45" });
    expect(extractSourceDateTime("2026-10-31T20:45:00.000Z")).toEqual({ date: "2026-10-31", time: "21:45" });
  });

  it("keeps an explicit Rome offset and converts date rollovers", () => {
    expect(extractSourceDateTime("2026-10-10T21:45:00+02:00")).toEqual({ date: "2026-10-10", time: "21:45" });
    expect(extractSourceDateTime("2026-10-10T23:30:00Z")).toEqual({ date: "2026-10-11", time: "01:30" });
  });

  it("preserves date-only and local time sources", () => {
    expect(extractSourceDateTime("2026-10-10")).toEqual({ date: "2026-10-10", time: null });
    expect(extractSourceDateTime("2026-10-10T21:45")).toEqual({ date: "2026-10-10", time: "21:45" });
  });

  it("does not legitimize a rollover date or an invalid instant", () => {
    expect(extractSourceDateTime("2026-02-31T19:45:00Z")).toEqual({ date: null, time: null });
    expect(extractSourceDateTime("2026-10-10T99:45:00Z")).toEqual({ date: null, time: null });
    expect(extractSourceDateTime(null)).toEqual({ date: null, time: null });
  });
});
