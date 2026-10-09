import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { findReplacementEventSlug } from "./event-slug-redirect";
import { CONSOLIDATED_EVENT_SLUGS } from "./consolidated-event-slugs";
import nextConfig from "../../../next.config";

function database(target: { slug: string } | null) {
  const query = {
    select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(), neq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: target }),
    limit: vi.fn().mockResolvedValue({ data: [] }),
  };
  return { query, client: { from: vi.fn(() => query) } as unknown as SupabaseClient };
}

describe("consolidated event links", () => {
  it.each(Object.entries(CONSOLIDATED_EVENT_SLUGS))(
    "preserves %s in both configured redirects and the database fallback", async (oldSlug, canonical) => {
      const redirects = await nextConfig.redirects!();
      expect(redirects).toContainEqual({
        source: `/eventi/${oldSlug}`, destination: `/eventi/${canonical}`, permanent: true,
      });
      expect(CONSOLIDATED_EVENT_SLUGS[canonical]).toBeUndefined();
      expect(await findReplacementEventSlug(database({ slug: canonical }).client, oldSlug)).toBe(canonical);
      expect(await findReplacementEventSlug(database(null).client, oldSlug)).toBeNull();
    },
  );
  it("keeps an old Nuracque link pointing to the published canonical event", async () => {
    const db = database({ slug: "nuraque-mudp855p" });
    expect(await findReplacementEventSlug(db.client, "nuracque-a-nurachi-2026-p8")).toBe("nuraque-mudp855p");
    expect(db.query.eq).toHaveBeenCalledWith("status", "published");
    expect(db.query.eq).toHaveBeenCalledWith("slug", "nuraque-mudp855p");
  });

  it("does not redirect to a canonical event that was unpublished", async () => {
    const db = database(null);
    expect(await findReplacementEventSlug(db.client, "nuracque-a-nurachi-2026-p8")).toBeNull();
  });

  it("keeps the existing Festa del Gusto alias", async () => {
    const slug = "festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5";
    const db = database({ slug });
    expect(await findReplacementEventSlug(db.client, "festa-del-gusto")).toBe(slug);
  });
});
