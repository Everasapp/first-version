import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const toJpeg = vi.fn(
  async (node: HTMLElement, options?: Record<string, unknown>) => {
    void node;
    void options;
    return "data:image/jpeg;base64,/9j/4AAQ";
  },
);

vi.mock("html-to-image", () => ({
  toJpeg: (node: HTMLElement, options?: Record<string, unknown>) =>
    toJpeg(node, options),
}));

vi.mock("@/src/lib/share/canvasSafeImage", () => ({
  waitForElementImages: vi.fn(async () => undefined),
}));

describe("generateStoryImage deferred html-to-image", () => {
  beforeEach(() => {
    toJpeg.mockClear();
    toJpeg.mockResolvedValue("data:image/jpeg;base64,/9j/4AAQ");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        blob: async () => new Blob([new Uint8Array([1, 2, 3])], { type: "image/jpeg" }),
      })),
    );
  });

  afterEach(async () => {
    const mod = await import("@/src/lib/share/generateStoryImage");
    mod.resetHtmlToImageLoaderForTests();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("loadHtmlToImage returns a shared Promise", async () => {
    const { loadHtmlToImage, resetHtmlToImageLoaderForTests } = await import(
      "@/src/lib/share/generateStoryImage"
    );
    resetHtmlToImageLoaderForTests();
    const a = loadHtmlToImage();
    const b = loadHtmlToImage();
    expect(a).toBe(b);
    const mod = await a;
    expect(typeof mod.toJpeg).toBe("function");
  });

  it("generateStoryJpeg loads toJpeg dynamically with unchanged options", async () => {
    const { generateStoryJpeg, resetHtmlToImageLoaderForTests } = await import(
      "@/src/lib/share/generateStoryImage"
    );
    resetHtmlToImageLoaderForTests();
    const node = { tagName: "DIV" } as HTMLElement;
    const blob = await generateStoryJpeg(node);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
    expect(toJpeg).toHaveBeenCalledTimes(1);
    expect(toJpeg).toHaveBeenCalledWith(node, {
      quality: 0.82,
      width: 1080,
      height: 1920,
      pixelRatio: 1,
      cacheBust: false,
      backgroundColor: "#0f172a",
      skipFonts: true,
    });
  });

  it("generateStoryJpeg reuses the same loader across calls", async () => {
    const {
      generateStoryJpeg,
      loadHtmlToImage,
      resetHtmlToImageLoaderForTests,
    } = await import("@/src/lib/share/generateStoryImage");
    resetHtmlToImageLoaderForTests();
    const first = loadHtmlToImage();
    const node = { tagName: "DIV" } as HTMLElement;
    await generateStoryJpeg(node);
    await generateStoryJpeg(node);
    expect(loadHtmlToImage()).toBe(first);
    expect(toJpeg).toHaveBeenCalledTimes(2);
  });

  it("propagates html-to-image errors", async () => {
    toJpeg.mockRejectedValueOnce(new Error("export failed"));
    const { generateStoryJpeg, resetHtmlToImageLoaderForTests } = await import(
      "@/src/lib/share/generateStoryImage"
    );
    resetHtmlToImageLoaderForTests();
    await expect(
      generateStoryJpeg({ tagName: "DIV" } as HTMLElement),
    ).rejects.toThrow("export failed");
  });
});
