import { afterEach, expect, it, vi } from "vitest";
import { uploadEventImage } from "./uploadEventImageClient";
import { MAX_PHOTO_BYTES, MAX_UPLOAD_REQUEST_BYTES } from "../uploads/limits";
import { readUploadFormData } from "../uploads/read-form-data";

afterEach(() => vi.unstubAllGlobals());

it("rejects oversize photos before making a network request", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const file = new File([new Uint8Array(MAX_PHOTO_BYTES + 1)], "photo.png", { type: "image/png" });
  await expect(uploadEventImage(file, { slug: "test" })).rejects.toThrow("3 MB");
  expect(fetchMock).not.toHaveBeenCalled();
});

it("sends the exact checked multipart body for an allowed photo", async () => {
  const fetchMock = vi.fn().mockResolvedValue(Response.json({ path: "test.webp", publicUrl: "https://example.test/test.webp" }));
  vi.stubGlobal("fetch", fetchMock);
  const file = new File([new Uint8Array(MAX_PHOTO_BYTES)], "photo.png", { type: "image/png" });
  await expect(uploadEventImage(file, { slug: "test" })).resolves.toMatchObject({ path: "test.webp" });
  const init = fetchMock.mock.calls[0][1] as RequestInit;
  const body = init.body as Blob;
  const contentType = new Headers(init.headers).get("content-type") ?? "";
  expect(body.size).toBeLessThan(MAX_UPLOAD_REQUEST_BYTES);
  expect(contentType).toMatch(/^multipart\/form-data;\s*boundary=/);
  const received = await readUploadFormData(
    new Request("https://everas.test/api/events/image/upload", {
      method: "POST",
      body,
      headers: { "content-type": contentType },
    }),
  );
  expect(received.get("slug")).toBe("test");
  expect((received.get("file") as File).name).toBe("photo.png");
  expect((received.get("file") as File).size).toBe(MAX_PHOTO_BYTES);
});
