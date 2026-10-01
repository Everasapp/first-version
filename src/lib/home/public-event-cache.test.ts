import { AsyncLocalStorage } from "node:async_hooks";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  createClient: vi.fn(),
  favorites: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({ createClient: state.createClient }));
vi.mock("@/src/lib/favorites", () => ({ getCurrentUserFavoriteIds: state.favorites }));

type Page = { data: Record<string, unknown>[] | null; error: { message: string } | null };

function queryReturning(...pages: Page[]) {
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn(),
  };
  for (const page of pages) query.range.mockResolvedValueOnce(page);
  query.range.mockResolvedValue({ data: [], error: null });
  state.createClient.mockReturnValue({ from: vi.fn(() => query) });
  return query;
}

const event = {
  id: "event-1", slug: "test-event", title: "Concerto",
  description: "Laboratorio musicale", category: "musica-concerti",
  municipality: "Sassari", province: "SS", location_name: "Piazza",
  start_at: "2099-10-01T18:00:00Z", end_at: null,
  schedule_mode: "single", image_url: null, is_free: true,
  price_from: null, is_featured: false, status: "published",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-publishable-key");
  vi.stubGlobal("AsyncLocalStorage", AsyncLocalStorage);
  const entries = new Map<string, unknown>();
  // Exercise Next's real unstable_cache against an in-memory storage backend.
  vi.stubGlobal("__incrementalCache", {
    generateSimpleCacheKey: async (key: string) => key,
    get: async (key: string) => entries.has(key) ? { value: entries.get(key), isStale: false } : null,
    set: async (key: string, value: unknown) => { entries.set(key, value); },
  });
  state.favorites.mockResolvedValue(new Set());
});

describe("anonymous public event cache", () => {
  it("reuses homepage rows without attaching cookies or a persisted session", async () => {
    const query = queryReturning({ data: [event], error: null });
    const { loadHomeEventRows } = await import("./load-events");
    expect((await loadHomeEventRows()).rows).toHaveLength(1);
    expect((await loadHomeEventRows()).rows).toHaveLength(1);
    expect(query.range).toHaveBeenCalledTimes(1);
    expect(state.createClient).toHaveBeenCalledWith(
      "https://example.supabase.co", "test-publishable-key",
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
    );
  });

  it("retries a failed homepage read instead of caching the failure", async () => {
    const query = queryReturning(
      { data: null, error: { message: "temporary failure" } },
      { data: [event], error: null },
    );
    const { loadHomeEventRows } = await import("./load-events");
    expect((await loadHomeEventRows()).error?.message).toBe("temporary failure");
    expect((await loadHomeEventRows()).rows).toHaveLength(1);
    expect(query.range).toHaveBeenCalledTimes(2);
  });

  it("does not lose homepage events beyond the first PostgREST page", async () => {
    const query = queryReturning(
      { data: Array.from({ length: 1000 }, (_, i) => ({ ...event, id: String(i) })), error: null },
      { data: [{ ...event, id: "1000" }], error: null },
    );
    const { loadHomeEventRows } = await import("./load-events");
    expect((await loadHomeEventRows()).rows).toHaveLength(1001);
    expect(query.range.mock.calls).toEqual([[0, 999], [1000, 1999]]);
  });

  it("shares public rows while keeping favorites private and city caches distinct", async () => {
    const query = queryReturning({ data: [event], error: null }, { data: [{ ...event, municipality: "Cagliari" }], error: null });
    const { loadFilteredPublishedEvents } = await import("@/src/lib/seo/loadEvents");
    state.favorites.mockResolvedValueOnce(new Set([event.id]));
    const first = await loadFilteredPublishedEvents({ city: "Sassari" });
    const second = await loadFilteredPublishedEvents({ city: "SASSARI", titleIncludes: ["laboratorio"] });
    const otherCity = await loadFilteredPublishedEvents({ city: "Cagliari" });
    expect(first.events[0].isFavorite).toBe(true);
    expect(second.events[0].isFavorite).toBe(false);
    expect(otherCity.events[0].municipality).toBe("Cagliari");
    expect(query.range).toHaveBeenCalledTimes(2);
    expect(state.favorites).toHaveBeenCalledTimes(3);
  });

  it("does not cache failed event list reads", async () => {
    queryReturning({ data: null, error: { message: "temporary failure" } }, { data: [event], error: null });
    const { loadFilteredPublishedEvents } = await import("@/src/lib/seo/loadEvents");
    expect((await loadFilteredPublishedEvents()).error?.message).toBe("temporary failure");
    expect((await loadFilteredPublishedEvents()).events).toHaveLength(1);
  });
});
