import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  EVENT_OG_HEIGHT,
  EVENT_OG_WIDTH,
  eventShareImagePath,
  isPublicImageUrl,
  renderEventOgJpeg,
} from "@/src/lib/seo/event-og-image";

describe("event share image", () => {
  it("keeps a stable path and changes it when the poster changes", () => {
    const first = eventShareImagePath(
      "jazzalguer-2026",
      "https://cdn.example/a.webp",
    );
    expect(first.startsWith("/og/evento/jazzalguer-2026?v=")).toBe(true);
    expect(
      eventShareImagePath("jazzalguer-2026", "https://cdn.example/a.webp"),
    ).toBe(first);
    expect(
      eventShareImagePath("jazzalguer-2026", "https://cdn.example/b.webp"),
    ).not.toBe(first);
  });

  it("allows public posters and blocks private hosts", () => {
    expect(
      isPublicImageUrl(
        "https://pxybrwkbbcghegcezxbn.supabase.co/storage/v1/object/public/a.webp",
      ),
    ).toBe(true);
    expect(isPublicImageUrl("http://127.0.0.1/secret.jpg")).toBe(false);
    expect(isPublicImageUrl("https://192.168.1.4/a.jpg")).toBe(false);
    expect(isPublicImageUrl("file:///etc/passwd")).toBe(false);
  });

  it("renders a 1200×630 jpeg from a portrait poster", async () => {
    const poster = await sharp({
      create: {
        width: 400,
        height: 800,
        channels: 3,
        background: "#E67E22",
      },
    })
      .png()
      .toBuffer();

    const jpeg = await renderEventOgJpeg(poster);
    expect(jpeg.subarray(0, 2).toString("hex")).toBe("ffd8");

    const meta = await sharp(jpeg).metadata();
    expect(meta.format).toBe("jpeg");
    expect(meta.width).toBe(EVENT_OG_WIDTH);
    expect(meta.height).toBe(EVENT_OG_HEIGHT);
  });
});
