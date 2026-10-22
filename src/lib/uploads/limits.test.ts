import { describe, expect, it } from "vitest";
import { createUploadBody, MAX_BANNERS_TOTAL_BYTES, MAX_UPLOAD_REQUEST_BYTES, UploadSizeError, validateBannerSelection } from "./limits";
import { readUploadFormData } from "./read-form-data";

function formWithFile(size: number) {
  const form = new FormData();
  form.append("banner", new Blob([new Uint8Array(size)], { type: "image/png" }), "test.png");
  form.append("company_name", "Attività di prova");
  return form;
}

describe("upload request limits", () => {
  it("rejects the old 3 x 5 MB banner allowance and combined oversize files", () => {
    expect(validateBannerSelection([{ size: 5 * 1024 * 1024 }, { size: 5 * 1024 * 1024 }, { size: 5 * 1024 * 1024 }])).toBeTruthy();
    expect(validateBannerSelection([{ size: 2 * 1024 * 1024 }, { size: 2 * 1024 * 1024 }])).toBeTruthy();
    expect(validateBannerSelection([{ size: MAX_BANNERS_TOTAL_BYTES }])).toBeNull();
    expect(validateBannerSelection(Array.from({ length: 4 }, () => ({ size: 1 })))).toBeTruthy();
  });
  it("roundtrips a valid multipart request at the photo limit, preserving file and fields", async () => {
    const upload = await createUploadBody(formWithFile(MAX_BANNERS_TOTAL_BYTES));
    expect(upload.body.size).toBeLessThan(MAX_UPLOAD_REQUEST_BYTES);
    expect(upload.contentType).toMatch(/boundary=/);
    const request = new Request("https://example.test/upload", {
      method: "POST",
      body: upload.body,
      headers: { "content-type": upload.contentType },
    });
    const received = await readUploadFormData(request);
    expect(received.get("company_name")).toBe("Attività di prova");
    expect((received.get("banner") as File).size).toBe(MAX_BANNERS_TOTAL_BYTES);
    expect((received.get("banner") as File).name).toBe("test.png");
  });
  it("rejects multipart overhead and large text fields before fetch", async () => {
    const atLimit = formWithFile(MAX_UPLOAD_REQUEST_BYTES);
    atLimit.delete("company_name");
    await expect(createUploadBody(atLimit)).rejects.toBeInstanceOf(UploadSizeError);
    const form = new FormData();
    form.set("text", "x".repeat(MAX_UPLOAD_REQUEST_BYTES + 1));
    await expect(createUploadBody(form)).rejects.toBeInstanceOf(UploadSizeError);
  });
  it("rejects oversized bodies without trusting Content-Length", async () => {
    const body = await new Response(formWithFile(MAX_UPLOAD_REQUEST_BYTES)).blob();
    const request = new Request("https://example.test/upload", { method: "POST", body });
    expect(request.headers.has("content-length")).toBe(false);
    await expect(readUploadFormData(request)).rejects.toBeInstanceOf(UploadSizeError);
  });
  it("rejects declared oversize before reading the stream", async () => {
    const request = new Request("https://example.test/upload", {
      method: "POST", body: "small", headers: { "content-length": String(MAX_UPLOAD_REQUEST_BYTES + 1) },
    });
    await expect(readUploadFormData(request)).rejects.toBeInstanceOf(UploadSizeError);
    expect(request.bodyUsed).toBe(false);
  });
});
