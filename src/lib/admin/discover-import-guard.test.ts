import { afterEach, describe, expect, it, vi } from "vitest";
import { discoverAndImportEventDrafts } from "./discover-event-drafts";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("discoverAndImportEventDrafts", () => {
  it("rejects outside production before database reads or listing fetches", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const fetchSpy = vi.fn(() => {
      throw new Error("listing fetch called");
    });
    vi.stubGlobal("fetch", fetchSpy);
    const supabase = {
      from() {
        throw new Error("database read");
      },
    };

    await expect(
      discoverAndImportEventDrafts({
        supabase: supabase as never,
        adminUserId: "admin-test",
      }),
    ).rejects.toThrow("Importazione non disponibile fuori produzione.");

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
