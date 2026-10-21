import { afterEach, expect, it, vi } from "vitest";
import { uploadEventImage } from "./uploadEventImageClient";
import { MAX_PHOTO_BYTES, MAX_UPLOAD_REQUEST_BYTES } from "../uploads/limits";

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
  const body = fetchMock.mock.calls[0][1].body as Blob;
  expect(body.size).toBeLessThan(MAX_UPLOAD_REQUEST_BYTES);
  expect(body.type).toMatch(/^multipart\/form-data;\s*boundary=/);
});
