import { MAX_UPLOAD_REQUEST_BYTES, UploadSizeError } from "./limits";

function withMultipartBoundary(header: string, bytes: Uint8Array) {
  if (/boundary=/i.test(header)) return header;
  const prefix = new TextDecoder().decode(bytes.subarray(0, 200));
  const lineEnd = prefix.indexOf("\r\n");
  const boundary = prefix.startsWith("--") && lineEnd > 2 ? prefix.slice(2, lineEnd) : "";
  if (!boundary || /[\s;,]/.test(boundary)) {
    throw new Error("Richiesta non valida.");
  }
  const mime = header.split(";")[0]?.trim().toLowerCase();
  if (mime && mime !== "multipart/form-data") {
    throw new Error("Richiesta non valida.");
  }
  return `multipart/form-data; boundary=${boundary}`;
}

/** Bound the entire multipart body, including requests without Content-Length. */
export async function readUploadFormData(request: Request): Promise<FormData> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_UPLOAD_REQUEST_BYTES) throw new UploadSizeError();
  if (!request.body) throw new Error("Richiesta vuota.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
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
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const contentType = withMultipartBoundary(request.headers.get("content-type") ?? "", bytes);
  return new Response(bytes, {
    headers: { "content-type": contentType },
  }).formData();
}
