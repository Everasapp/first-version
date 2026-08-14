import { toJpeg } from "html-to-image";

import { STORY_HEIGHT, STORY_WIDTH } from "@/src/lib/share/types";

/** Genera JPEG della Story (mira a < ~500KB). */
export async function generateStoryJpeg(node: HTMLElement): Promise<Blob> {
  // Preload immagini per ridurre canvas vuoti
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  );

  const dataUrl = await toJpeg(node, {
    quality: 0.82,
    width: STORY_WIDTH,
    height: STORY_HEIGHT,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: "#0f172a",
  });

  const response = await fetch(dataUrl);
  return response.blob();
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
