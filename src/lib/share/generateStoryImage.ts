import { toJpeg } from "html-to-image";

import { waitForElementImages } from "@/src/lib/share/canvasSafeImage";
import { STORY_HEIGHT, STORY_WIDTH } from "@/src/lib/share/types";

/** Genera JPEG della Story (mira a < ~500KB). */
export async function generateStoryJpeg(node: HTMLElement): Promise<Blob> {
  await waitForElementImages(node);

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

export async function shareStoryFile(file: File, title: string) {
  await navigator.share({
    files: [file],
    title: `${title} · EVERAS`,
    text: `Scopri questo evento su Everas: ${title}`,
  });
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
