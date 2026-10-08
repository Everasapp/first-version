import { describe, expect, it } from "vitest";

import {
  latestEventUpdate,
  latestLastModified,
} from "@/src/lib/seo/last-modified";

describe("latestLastModified", () => {
  it("returns the most recent valid timestamp", () => {
    expect(
      latestLastModified([
        "2026-10-01T10:00:00.000Z",
        "2026-10-08T12:00:00.000Z",
        "2026-10-03T10:00:00.000Z",
      ])?.toISOString(),
    ).toBe("2026-10-08T12:00:00.000Z");
  });

  it("ignores missing and invalid values", () => {
    expect(latestLastModified([null, undefined, "not-a-date"])).toBeUndefined();
  });

  it("uses a rolling-page floor when it is newer than event updates", () => {
    expect(
      latestEventUpdate(
        [{ updated_at: "2026-10-07T20:00:00.000Z" }],
        new Date("2026-10-08T22:00:00.000Z"),
      )?.toISOString(),
    ).toBe("2026-10-08T22:00:00.000Z");
  });

  it("lets a later event update supersede the rolling-page floor", () => {
    expect(
      latestEventUpdate(
        [{ updated_at: "2026-10-09T09:30:00.000Z" }],
        new Date("2026-10-08T22:00:00.000Z"),
      )?.toISOString(),
    ).toBe("2026-10-09T09:30:00.000Z");
  });
});
