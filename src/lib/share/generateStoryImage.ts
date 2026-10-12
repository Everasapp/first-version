import { waitForElementImages } from "@/src/lib/share/canvasSafeImage";
import { STORY_HEIGHT, STORY_WIDTH } from "@/src/lib/share/types";

let htmlToImagePromise: Promise<typeof import("html-to-image")> | null = null;

/** Carica html-to-image una sola volta, solo quando serve generare la Story. */
export function loadHtmlToImage() {
  htmlToImagePromise ??= import("html-to-image");
  return htmlToImagePromise;
}

/** Solo per test: resetta la Promise condivisa. */
export function resetHtmlToImageLoaderForTests() {
  htmlToImagePromise = null;
}

/** Genera JPEG della Story (mira a < ~500KB). */
export async function generateStoryJpeg(node: HTMLElement): Promise<Blob> {
  await waitForElementImages(node);

  const { toJpeg } = await loadHtmlToImage();
  const dataUrl = await toJpeg(node, {
    quality: 0.82,
    width: STORY_WIDTH,
    height: STORY_HEIGHT,
    pixelRatio: 1,
    cacheBust: false,
    backgroundColor: "#0f172a",
    // Evita che risorse esterne residue blocchino l’export
    skipFonts: true,
  });

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  if (!blob.size) {
    throw new Error("JPEG Story vuoto.");
  }
  return blob;
}

export async function canShareFiles(file: File) {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return false;
  }
  if (typeof navigator.canShare !== "function") {
    return true;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/**
 * Solo il file. Se si allega anche il link, Instagram Stories scarta la
 * locandina e mostra la card generica di EVERAS.
 */
export async function shareStoryFile(file: File) {
  await navigator.share({ files: [file] });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
