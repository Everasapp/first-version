import { ImageResponse } from "next/og";
import sharp from "sharp";

import { STORY_HEIGHT, STORY_SITE_LABEL, STORY_WIDTH } from "@/src/lib/share/types";

type StoryCardInput = {
  title: string;
  category: string;
  city: string;
  dateLabel: string;
  timeLabel: string;
  poster: Buffer | null;
};

function clip(value: string, max: number) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

async function posterAsset(source: Buffer) {
  const jpeg = await sharp(source)
    .rotate()
    .flatten({ background: "#111827" })
    .resize(960, 1120, { fit: "inside" })
    .jpeg({ quality: 80 })
    .toBuffer();
  const meta = await sharp(jpeg).metadata();
  return {
    url: `data:image/jpeg;base64,${jpeg.toString("base64")}`,
    width: meta.width ?? 960,
    height: meta.height ?? 1120,
  };
}

/** JPEG 1080×1920 con la locandina dell'evento, pronto per Instagram Stories. */
export async function buildInstagramStoryJpeg(input: StoryCardInput) {
  const poster = input.poster ? await posterAsset(input.poster) : null;
  const title = clip(input.title, 90);
  const category = clip(input.category || "Evento", 32);
  const city = clip(input.city || "Sardegna", 40);
  const dateLabel = clip(input.dateLabel, 40);

  const image = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0b1220",
          color: "#ffffff",
          padding: "48px 56px 56px",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111827",
            borderRadius: 32,
            overflow: "hidden",
            marginBottom: 36,
          }}
        >
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster.url}
              alt=""
              width={poster.width}
              height={poster.height}
              style={{
                objectFit: "contain",
              }}
            />
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            backgroundColor: "#E67E22",
            color: "#ffffff",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            padding: "10px 18px",
            borderRadius: 999,
            marginBottom: 18,
          }}
        >
          {category}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 50 ? 48 : 58,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 22,
            fontSize: 30,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {dateLabel ? (
            <div style={{ display: "flex" }}>
              <span style={{ color: "#E67E22", marginRight: 16 }}>DATA</span>
              {dateLabel}
              {input.timeLabel ? ` · ${input.timeLabel}` : ""}
            </div>
          ) : null}
          <div style={{ display: "flex", marginTop: 10 }}>
            <span style={{ color: "#E67E22", marginRight: 16 }}>DOVE</span>
            {city}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            paddingTop: 24,
            borderTop: "2px solid rgba(255,255,255,0.2)",
            fontSize: 36,
            fontWeight: 700,
            color: "#E67E22",
            justifyContent: "center",
          }}
        >
          {STORY_SITE_LABEL}
        </div>
      </div>
    ),
    { width: STORY_WIDTH, height: STORY_HEIGHT },
  );

  const png = Buffer.from(await image.arrayBuffer());
  return sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
}
