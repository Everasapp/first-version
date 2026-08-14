import sharp from "sharp";

const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const TARGET_MAX_BYTES = 220_000;
const INITIAL_QUALITY = 82;
const MIN_QUALITY = 55;

export type OptimizeToWebpOptions = {
  /** Max long edge on first pass (default 1600). */
  maxEdge?: number;
  /** Soft size budget before quality is lowered (default ~220 KB). */
  targetMaxBytes?: number;
};

/**
 * Compress any common raster image to WebP (EXIF rotate, resize, quality loop).
 */
export async function optimizeImageToWebp(
  input: Buffer,
  options: OptimizeToWebpOptions = {},
): Promise<Buffer> {
  if (input.byteLength > MAX_INPUT_BYTES) {
    throw new Error("Immagine troppo grande (max 8 MB).");
  }

  const maxEdge = options.maxEdge ?? 1600;
  const targetMaxBytes = options.targetMaxBytes ?? TARGET_MAX_BYTES;

  let quality = INITIAL_QUALITY;
  let out = await sharp(input)
    .rotate()
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  while (out.byteLength > targetMaxBytes && quality > MIN_QUALITY) {
    quality -= 8;
    out = await sharp(input)
      .rotate()
      .resize({
        width: Math.min(1400, maxEdge),
        height: Math.min(1400, maxEdge),
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();
  }

  return out;
}
