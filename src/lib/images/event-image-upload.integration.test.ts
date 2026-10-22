import { beforeEach, describe, expect, it, vi } from "vitest";

const storageUpload = vi.hoisted(() =>
  vi.fn(async (_path: string, body: Buffer) => {
    void body;
    return { error: null as null };
  }),
);

vi.mock("@/src/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: async () => ({
        data: { user: { id: "11111111-1111-4111-8111-111111111111" } },
        error: null,
      }),
    },
    storage: {
      from: () => ({
        upload: storageUpload,
        getPublicUrl: () => ({ data: { publicUrl: "https://cdn.example/corso.webp" } }),
      }),
    },
  })),
}));

vi.mock("@/src/lib/images/optimizeToWebp", () => ({
  optimizeImageToWebp: async (input: Buffer) => input,
}));

import { POST } from "@/app/api/events/image/upload/route";
import {
  createUploadBody,
  MAX_PHOTO_BYTES,
  MAX_UPLOAD_REQUEST_BYTES,
} from "@/src/lib/uploads/limits";
import { readUploadFormData } from "@/src/lib/uploads/read-form-data";

const UPLOAD_URL = "https://everas.test/api/events/image/upload";

async function preparedCourseImage() {
  const file = new File([Uint8Array.from([137, 80, 78, 71])], "corso.png", {
    type: "image/png",
  });
  const form = new FormData();
  form.append("file", file);
  form.append("slug", "corso-senza-proprietario");
  return createUploadBody(form);
}

describe("event image upload integration", () => {
  beforeEach(() => {
    storageUpload.mockClear();
  });

  it("keeps the existing upload size limits", () => {
    expect(MAX_UPLOAD_REQUEST_BYTES).toBe(4_000_000);
    expect(MAX_PHOTO_BYTES).toBe(3 * 1024 * 1024);
  });

  it("accepts the same multipart body after a browser drops the boundary", async () => {
    const prepared = await preparedCourseImage();
    expect(prepared.contentType).toMatch(/^multipart\/form-data;\s*boundary=/i);

    const stripped = new Blob([await prepared.body.arrayBuffer()], {
      type: "multipart/form-data",
    });
    const request = new Request(UPLOAD_URL, { method: "POST", body: stripped });
    expect(request.headers.get("content-type")).toBe("multipart/form-data");

    const received = await readUploadFormData(request.clone());
    const receivedFile = received.get("file");
    expect(received.get("slug")).toBe("corso-senza-proprietario");
    expect(receivedFile).toBeInstanceOf(File);
    expect((receivedFile as File).name).toBe("corso.png");
    expect((receivedFile as File).type).toBe("image/png");
    expect((receivedFile as File).size).toBe(4);

    const response = await POST(request);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      publicUrl: "https://cdn.example/corso.webp",
    });
    expect(storageUpload).toHaveBeenCalledOnce();
    expect(storageUpload.mock.calls[0]?.[1].byteLength).toBe(4);
  });

  it("returns 400 when the body is not multipart", async () => {
    const response = await POST(
      new Request(UPLOAD_URL, {
        method: "POST",
        body: "non è un form",
        headers: { "content-type": "text/plain" },
      }),
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Richiesta non valida." });
    expect(storageUpload).not.toHaveBeenCalled();
  });
});
