export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

export function isHeicPhoto(file: { type?: string; name?: string }) {
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  return type.includes("heic") || type.includes("heif") || /\.(heic|heif)$/.test(name);
}

export function isAllowedPhoto(file: { type?: string; name?: string }) {
  const type = (file.type || "").toLowerCase();
  if (ALLOWED_TYPES.has(type)) return true;
  const name = (file.name || "").toLowerCase();
  return /\.(jpe?g|png|webp|gif|heic|heif)$/.test(name);
}
