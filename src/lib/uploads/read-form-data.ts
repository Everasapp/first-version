import { MAX_UPLOAD_REQUEST_BYTES, UploadSizeError } from "./limits";

/** Bound the entire multipart body, including requests without Content-Length. */
export async function readUploadFormData(request: Request): Promise<FormData> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_UPLOAD_REQUEST_BYTES) throw new UploadSizeError();
  if (!request.body) throw new Error("Richiesta vuota.");
  const reader = request.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_UPLOAD_REQUEST_BYTES) {
        await reader.cancel();
        throw new UploadSizeError();
      }
      chunks.push(new Uint8Array(value));
    }
  } finally {
    reader.releaseLock();
  }
  return new Response(new Blob(chunks), {
    headers: { "content-type": request.headers.get("content-type") || "" },
  }).formData();
}
