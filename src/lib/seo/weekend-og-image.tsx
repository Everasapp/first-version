import sharp from "sharp";
import { ImageResponse } from "next/og";

import {
  WEEKEND_OG_SIZE,
  splitPosterRows,
} from "@/src/lib/seo/weekend-mosaic";
import type { CalendarWeekend } from "@/src/lib/seo/weekends";

const TILE_HEIGHT = 200;
const TILE_GAP = 10;
const FRAME_PAD = 24;

async function posterDataUrl(url: string) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(4000),
    next: { revalidate: 3600 },
  });
  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/") || contentType.includes("html")) {
    return null;
  }

  const input = Buffer.from(await response.arrayBuffer());
  if (input.byteLength < 400 || input.byteLength > 8_000_000) return null;

  const jpeg = await sharp(input)
    .rotate()
    .resize(360, TILE_HEIGHT, { fit: "cover", position: "centre" })
    .jpeg({ quality: 74, mozjpeg: true })
    .toBuffer();

  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

export async function prepareWeekendPosterDataUrls(urls: string[]) {
  const settled = await Promise.allSettled(urls.map((url) => posterDataUrl(url)));
  return settled.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : [],
  );
}

function PosterRow({ posters }: { posters: string[] }) {
  if (posters.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: TILE_HEIGHT,
        gap: TILE_GAP,
      }}
    >
      {posters.map((src, index) => (
        <img
          key={index}
          src={src}
          alt=""
          width={360}
          height={TILE_HEIGHT}
          style={{
            flex: 1,
            height: TILE_HEIGHT,
            objectFit: "cover",
            borderRadius: 18,
          }}
        />
      ))}
    </div>
  );
}

export async function buildWeekendOgImage(
  weekend: CalendarWeekend,
  posterUrls: string[],
) {
  const posters = await prepareWeekendPosterDataUrls(posterUrls);
  const { top, bottom } = splitPosterRows(posters);

  const image = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          padding: FRAME_PAD,
          justifyContent: "space-between",
        }}
      >
        <PosterRow posters={top} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#075EAE",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            EVERAS
          </div>
          <div
            style={{
              display: "flex",
              color: "#0f172a",
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: -1,
              marginTop: 6,
            }}
          >
            Eventi del weekend
          </div>
          <div
            style={{
              display: "flex",
              color: "#E67E22",
              fontSize: 32,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {weekend.dateLabel}
          </div>
        </div>

        <PosterRow posters={bottom} />
      </div>
    ),
    WEEKEND_OG_SIZE,
  );
  image.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  return image;
}
