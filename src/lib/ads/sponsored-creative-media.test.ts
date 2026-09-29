import { describe, expect, it } from "vitest";

import {
  normalizeSponsoredImageSrc,
  resolveSponsoredMedia,
  resolveSponsoredVideoCreative,
  SPONSORED_GIF_VIDEO_LOOKUP,
} from "@/src/lib/ads/sponsored-creative-media";

describe("sponsored-creative-media", () => {
  it("keeps unknown image creatives as image-only (retrocompatible)", () => {
    const resolved = resolveSponsoredMedia("/images/ads/some-partner.jpg");
    expect(resolved).toEqual({
      imageSrc: "/images/ads/some-partner.jpg",
      mediaType: "image",
    });
    expect(resolved.posterUrl).toBeUndefined();
    expect(resolved.videoWebmUrl).toBeUndefined();
    expect(resolved.videoMp4Url).toBeUndefined();
  });

  it("maps the three known GIF paths to poster + video without changing imageSrc", () => {
    for (const [gifPath, expected] of Object.entries(SPONSORED_GIF_VIDEO_LOOKUP)) {
      const resolved = resolveSponsoredMedia(gifPath);
      expect(resolved.mediaType).toBe("video");
      expect(resolved.imageSrc).toBe(gifPath);
      expect(resolved.posterUrl).toBe(expected.posterUrl);
      expect(resolved.videoWebmUrl).toBe(expected.videoWebmUrl);
      expect(resolved.videoMp4Url).toBe(expected.videoMp4Url);
      // Mapped creatives must never fall back to requesting the GIF as poster.
      expect(resolved.posterUrl).not.toBe(gifPath);
    }
  });

  it("normalizes absolute same-path URLs for the lookup", () => {
    const absolute =
      "https://www.everas.it/images/zoe/zoe-robot.gif?v=1";
    expect(normalizeSponsoredImageSrc(absolute)).toBe(
      "/images/zoe/zoe-robot.gif",
    );
    expect(resolveSponsoredVideoCreative(absolute)?.posterUrl).toBe(
      "/images/zoe/zoe-robot-poster.webp",
    );
  });

  it("does not invent video creatives for missing paths", () => {
    expect(resolveSponsoredVideoCreative("/images/zoe/missing.gif")).toBeNull();
  });
});

describe("homepage Hot this week priority policy", () => {
  it("documents that HappeningToday must not request priority images", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(
        new URL(
          "../../components/home/HappeningToday.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    expect(source).toContain("priority={false}");
    expect(source).not.toMatch(/priority=\{index\s*<\s*2\}/);
  });
});
