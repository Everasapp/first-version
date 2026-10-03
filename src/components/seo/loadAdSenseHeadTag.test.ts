import { describe, expect, it, vi } from "vitest";
import { loadAdSenseHeadTag } from "./loadAdSenseHeadTag";

describe("AdSense loading", () => {
  it("adds an async native head tag once across repeated mounts", () => {
    let inserted: Record<string, unknown> | undefined;
    const appendChild = vi.fn((tag) => { inserted = tag; });
    const doc = {
      querySelector: vi.fn(() => inserted ?? null),
      createElement: vi.fn(() => ({})),
      head: { appendChild },
    } as unknown as Document;
    loadAdSenseHeadTag(doc);
    loadAdSenseHeadTag(doc);
    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(inserted).toEqual({
      async: true,
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5513319548780658",
      crossOrigin: "anonymous",
    });
  });

  it("does not duplicate an existing publisher tag", () => {
    const createElement = vi.fn();
    loadAdSenseHeadTag({ querySelector: () => ({}), createElement } as unknown as Document);
    expect(createElement).not.toHaveBeenCalled();
  });
});
