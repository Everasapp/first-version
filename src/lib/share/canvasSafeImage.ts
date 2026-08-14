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

/**
 * Carica l’immagine come blob URL (sempre safe per canvas/html-to-image).
 * In caso di errore torna il fallback locale.
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
      if (!blob.type.startsWith("image/")) continue;
      const objectUrl = URL.createObjectURL(blob);
      return {
        url: objectUrl,
        revoke: () => URL.revokeObjectURL(objectUrl),
      };
    } catch {
      // prova il candidato successivo
    }
  }

  return {
    url: `${origin}${FALLBACK_IMAGE}`,
    revoke: () => undefined,
  };
}

export async function waitForElementImages(node: HTMLElement, timeoutMs = 8000) {
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          const done = () => resolve();
          if (img.complete && img.naturalWidth > 0) {
            done();
            return;
          }
          const timer = window.setTimeout(done, timeoutMs);
          img.addEventListener(
            "load",
            () => {
              window.clearTimeout(timer);
              done();
            },
            { once: true },
          );
          img.addEventListener(
            "error",
            () => {
              window.clearTimeout(timer);
              done();
            },
            { once: true },
          );
        }),
    ),
  );

  // Due frame per layout/paint
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}
