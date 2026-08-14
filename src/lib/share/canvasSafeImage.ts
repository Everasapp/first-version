const FALLBACK_IMAGE = "/images/concert.png";

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

/** Ridimensiona l’immagine mantenendo le proporzioni (niente crop/letterbox). */
async function blobToJpegDataUrl(blob: Blob, maxEdge = 1600) {
  const bitmap = await createImageBitmap(blob);
  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const drawW = Math.max(1, Math.round(bitmap.width * scale));
    const drawH = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = drawW;
    canvas.height = drawH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D non disponibile.");
    }
    ctx.drawImage(bitmap, 0, 0, drawW, drawH);
    return canvas.toDataURL("image/jpeg", 0.9);
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
      const dataUrl = await blobToJpegDataUrl(blob);
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

const STORY_LOGO_PATH = "/images/everas-logo-v2.png";

/**
 * Logo bianco su trasparente (PNG), pronto per sfondo scuro della Story.
 * Evita CSS filter che html-to-image gestisce male.
 */
export async function loadStoryLogoDataUrl(): Promise<string | undefined> {
  try {
    const origin = window.location.origin;
    const response = await fetch(`${origin}${STORY_LOGO_PATH}`, {
      credentials: "same-origin",
    });
    if (!response.ok) return undefined;
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    try {
      const targetH = 160;
      const scale = targetH / bitmap.height;
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return undefined;
      ctx.drawImage(bitmap, 0, 0, w, h);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      return canvas.toDataURL("image/png");
    } finally {
      bitmap.close();
    }
  } catch (error) {
    console.warn("[share] logo prepare failed:", error);
    return undefined;
  }
}
