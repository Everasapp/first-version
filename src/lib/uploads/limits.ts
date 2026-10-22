// Leave headroom below Vercel's 4.5 MB limit for the complete request.
export const MAX_UPLOAD_REQUEST_BYTES = 4_000_000;
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
export const MAX_BANNER_FILES = 3;
export const MAX_BANNERS_TOTAL_BYTES = MAX_PHOTO_BYTES;
export const UPLOAD_SIZE_MESSAGE = "La richiesta è troppo grande. Riduci le immagini e riprova.";

export class UploadSizeError extends Error {
  constructor() {
    super(UPLOAD_SIZE_MESSAGE);
    this.name = "UploadSizeError";
  }
}

export function validateBannerSelection(files: readonly { size: number }[]) {
  if (files.length < 1 || files.length > MAX_BANNER_FILES) {
    return `Carica da 1 a ${MAX_BANNER_FILES} immagini.`;
  }
  if (
    files.some((file) => file.size <= 0) ||
    files.reduce((total, file) => total + file.size, 0) > MAX_BANNERS_TOTAL_BYTES
  ) {
    return "I banner devono pesare al massimo 3 MB complessivi.";
  }
  return null;
}

export type PreparedUpload = {
  body: Blob;
  /** Includes the multipart boundary. Must be sent explicitly: some browsers drop it from blob.type. */
  contentType: string;
};

/** Serialize once so the checked size includes fields and multipart overhead. */
export async function createUploadBody(formData: FormData): Promise<PreparedUpload> {
  let size = 0;
  for (const value of formData.values()) {
    size += typeof value === "string" ? new TextEncoder().encode(value).length : value.size;
    if (size > MAX_UPLOAD_REQUEST_BYTES) throw new UploadSizeError();
  }
  const encoded = new Response(formData);
  const contentType = encoded.headers.get("content-type") ?? "";
  if (!/boundary=/i.test(contentType)) {
    throw new Error("Richiesta non valida.");
  }
  const body = await encoded.blob();
  if (body.size > MAX_UPLOAD_REQUEST_BYTES) throw new UploadSizeError();
  return { body, contentType };
}
