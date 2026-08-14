const FALLBACK_IMAGE = "/images/concert.png";
const STORY_IMAGE_WIDTH = 1080;
const STORY_IMAGE_HEIGHT = 1920;

function isAbsoluteHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Converte un URL immagine in sorgente same-origin (proxy se remoto). */
export function toSameOriginImageUrl(src: string, origin = window.location.origin) {
  const trimmed = (src || "").trim();
  if (!trimmed) {
    return `${origin}${FALLBACK_IMAGE}`;
  }

  if (trimmed.startsWith("/")) {
    return `${origin}${trimmed}`;
  }

  if (trimmed.startsWith(origin)) {
    return trimmed;
  }

  if (isAbsoluteHttpUrl(trimmed)) {
    return `${origin}/api/share/image?url=${encodeURIComponent(trimmed)}`;
  }

  return `${origin}${FALLBACK_IMAGE}`;
}

async function blobToCoverJpegDataUrl(
  blob: Blob,
  width = STORY_IMAGE_WIDTH,
  height = STORY_IMAGE_HEIGHT,
) {
  const bitmap = await createImageBitmap(blob);
  try {
    const scale = Math.max(width / bitmap.width, height / bitmap.height);
    const drawW = Math.round(bitmap.width * scale);
    const drawH = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D non disponibile.");
    }
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(
      bitmap,
      Math.round((width - drawW) / 2),
      Math.round((height - drawH) / 2),
      drawW,
      drawH,
    );
    return canvas.toDataURL("image/jpeg", 0.88);
  } finally {
    bitmap.close();
  }
}

/**
 * Carica l’immagine come data URL JPEG (embeddabile in html-to-image).
 * I blob: URL spesso risultano vuoti nel clone SVG.
 */
export async function loadCanvasSafeImageUrl(src: string): Promise<{
  url: string;
  revoke: () => void;
}> {
  const origin = window.location.origin;
  const candidates = [
    toSameOriginImageUrl(src, origin),
    `${origin}${FALLBACK_IMAGE}`,
  ];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { credentials: "same-origin" });
      if (!response.ok) continue;
      const blob = await response.blob();
      if (!blob.type.startsWith("image/") && blob.type !== "application/octet-stream") {
        continue;
      }
      const dataUrl = await blobToCoverJpegDataUrl(blob);
      return {
        url: dataUrl,
        revoke: () => undefined,
      };
    } catch (error) {
      console.warn("[share] image prepare failed:", candidate, error);
    }
  }

  // Ultimo fallback: path assoluto same-origin (meglio di niente)
  return {
    url: `${origin}${FALLBACK_IMAGE}`,
    revoke: () => undefined,
  };
}

export async function waitForElementImages(node: HTMLElement, timeoutMs = 10000) {
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) {
        try {
          await img.decode();
        } catch {
          // decode non critico
        }
        return;
      }

      await new Promise<void>((resolve) => {
        const timer = window.setTimeout(() => resolve(), timeoutMs);
        img.addEventListener(
          "load",
          () => {
            window.clearTimeout(timer);
            resolve();
          },
          { once: true },
        );
        img.addEventListener(
          "error",
          () => {
            window.clearTimeout(timer);
            resolve();
          },
          { once: true },
        );
      });

      try {
        await img.decode();
      } catch {
        // ignore
      }
    }),
  );

  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}
