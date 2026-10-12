import { describe, expect, it } from "vitest";

import {
  buildEventShareUrl,
  eventSharePagePath,
} from "@/src/lib/share/formatStory";

describe("event share url", () => {
  it("adds a revision so apps do not reuse the cached Everas card", () => {
    expect(eventSharePagePath("jazzalguer-2026")).toBe(
      "/eventi/jazzalguer-2026?v=2",
    );
    expect(buildEventShareUrl("jazzalguer-2026", "https://www.everas.it")).toBe(
      "https://www.everas.it/eventi/jazzalguer-2026?v=2",
    );
  });
});
