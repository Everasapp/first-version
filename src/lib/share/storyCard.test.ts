import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { buildInstagramStoryJpeg } from "@/src/lib/share/storyCard";
import { STORY_HEIGHT, STORY_WIDTH } from "@/src/lib/share/types";

describe("instagram story card", () => {
  it("renders a 1080×1920 jpeg that includes the event poster", async () => {
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

    const jpeg = await buildInstagramStoryJpeg({
      title: "JazzAlguer 2026",
      category: "Musica",
      city: "Alghero",
      dateLabel: "10 aprile 2026",
      timeLabel: "21:00",
      poster,
    });

    expect(jpeg.subarray(0, 2).toString("hex")).toBe("ffd8");
    const meta = await sharp(jpeg).metadata();
    expect(meta.format).toBe("jpeg");
    expect(meta.width).toBe(STORY_WIDTH);
    expect(meta.height).toBe(STORY_HEIGHT);
  });
});
