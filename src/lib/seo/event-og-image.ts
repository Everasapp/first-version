import { readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

/** Card 1.91:1 richiesta da WhatsApp, Facebook, Telegram e iMessage. */
export const EVENT_OG_WIDTH = 1200;
export const EVENT_OG_HEIGHT = 630;

const MAX_IMAGE_BYTES = 8_000_000;

/**
 * URL stabile della card di condivisione.
 * Il parametro `v` cambia se cambia la locandina, così le app non tengono la cache vecchia.
 */
export function eventShareImagePath(slug: string, imageUrl: string) {
  return `/og/evento/${slug}?v=${eventOgVersion(imageUrl)}`;
}

function eventOgVersion(imageUrl: string) {
  let hash = 2166136261;
  for (let index = 0; index < imageUrl.length; index += 1) {
    hash ^= imageUrl.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function isPublicImageUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return false;

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return false;
  }

  return !isPrivateHostname(host);
}

function isPrivateHostname(host: string) {
  if (host === "::1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) {
    return true;
  }

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4) return false;

  const a = Number(ipv4[1]);
  const b = Number(ipv4[2]);
  if ([a, b, Number(ipv4[3]), Number(ipv4[4])].some((part) => part > 255)) {
    return true;
  }
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function localPublicPath(imageUrl: string) {
  const clean = imageUrl.split("?")[0]?.split("#")[0] ?? "";
  if (!clean.startsWith("/") || clean.startsWith("//") || clean.includes("..")) {
    return null;
  }
  return path.join(process.cwd(), "public", clean);
}

export async function loadEventImageBytes(imageUrl: string) {
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/")) {
    const filePath = localPublicPath(trimmed);
    if (!filePath) return null;
    try {
      const file = await readFile(filePath);
      return file.byteLength > 0 && file.byteLength <= MAX_IMAGE_BYTES ? file : null;
    } catch {
      return null;
    }
  }

  if (!isPublicImageUrl(trimmed)) return null;

  try {
    const response = await fetch(trimmed, {
      headers: { Accept: "image/*", "User-Agent": "EVERAS-OG/1.0" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/") || contentType.includes("html")) return null;

    const lengthHeader = Number(response.headers.get("content-length") || 0);
    if (lengthHeader > MAX_IMAGE_BYTES) return null;

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength < 32 || bytes.byteLength > MAX_IMAGE_BYTES) return null;
    return bytes;
  } catch {
    return null;
  }
}

/**
 * JPEG della locandina, intera e centrata.
 * Le app di condivisione scartano i WebP di Supabase (header robots) e senza
 * larghezza/altezza ricadono sull'unica immagine del sito.
 */
export async function renderEventOgJpeg(source: Buffer) {
  const normalized = await sharp(source)
    .rotate()
    .flatten({ background: "#ffffff" })
    .toBuffer();

  const meta = await sharp(normalized).metadata();
  const width = meta.width ?? 1;
  const height = meta.height ?? 1;
  const landscape = width / height >= 1.2;

  if (landscape) {
    return sharp(normalized)
      .resize(EVENT_OG_WIDTH, EVENT_OG_HEIGHT, {
        fit: "cover",
        position: "attention",
      })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  }

  const background = await sharp(normalized)
    .resize(EVENT_OG_WIDTH, EVENT_OG_HEIGHT, {
      fit: "cover",
      position: "attention",
    })
    .blur(18)
    .modulate({ brightness: 0.42, saturation: 0.85 })
    .toBuffer();

  const poster = await sharp(normalized)
    .resize(EVENT_OG_WIDTH - 64, EVENT_OG_HEIGHT - 64, { fit: "inside" })
    .jpeg({ quality: 88 })
    .toBuffer();

  const framed = await sharp(poster)
    .extend({
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
      background: "#ffffff",
    })
    .toBuffer();

  const framedMeta = await sharp(framed).metadata();
  const framedWidth = framedMeta.width ?? 0;
  const framedHeight = framedMeta.height ?? 0;

  return sharp(background)
    .composite([
      {
        input: framed,
        left: Math.max(0, Math.round((EVENT_OG_WIDTH - framedWidth) / 2)),
        top: Math.max(0, Math.round((EVENT_OG_HEIGHT - framedHeight) / 2)),
      },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
