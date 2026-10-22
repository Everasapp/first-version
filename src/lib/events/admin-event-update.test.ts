import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  userId: "22222222-2222-4222-8222-222222222222" as string | null,
  role: "user" as string | null,
  existing: {
    id: "5775437e-a1c0-42bd-9758-a5692f08bc0e",
    organizer_id: null as string | null,
    created_by: null as string | null,
  } as { id: string; organizer_id: string | null; created_by: string | null } | null,
  updated: {
    id: "5775437e-a1c0-42bd-9758-a5692f08bc0e",
    organizer_id: null as string | null,
    created_by: null as string | null,
  } as { id: string; organizer_id: string | null; created_by: string | null } | null,
  update: vi.fn(),
}));

vi.mock("@/src/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: async () => ({
        data: { user: db.userId ? { id: db.userId } : null },
        error: null,
      }),
    },
    from(table: string) {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: db.role ? { role: db.role } : null,
                error: null,
              }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: db.existing, error: null }),
          }),
        }),
        update: (patch: Record<string, unknown>) => {
          db.update(patch);
          return {
            eq: () => ({
              select: () => ({
                maybeSingle: async () => ({ data: db.updated, error: null }),
              }),
            }),
          };
        },
      };
    },
  })),
}));

import { POST } from "@/app/api/events/[id]/admin-update/route";
import { sanitizeAdminEventUpdate } from "@/src/lib/events/admin-event-update";

const EVENT_ID = "5775437e-a1c0-42bd-9758-a5692f08bc0e";
const URL = `https://everas.test/api/events/${EVENT_ID}/admin-update`;

function saveRequest(body: unknown) {
  return new Request(URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const coursePatch = {
  title: "Corso esistente",
  image_url: "https://cdn.example/nuova.webp",
  organizer_id: "22222222-2222-4222-8222-222222222222",
  created_by: "22222222-2222-4222-8222-222222222222",
  organizer_display_name: "Nome già in scheda",
};

describe("admin event update", () => {
  beforeEach(() => {
    db.userId = "22222222-2222-4222-8222-222222222222";
    db.role = "user";
    db.existing = {
      id: EVENT_ID,
      organizer_id: null,
      created_by: null,
    };
    db.updated = {
      id: EVENT_ID,
      organizer_id: null,
      created_by: null,
    };
    db.update.mockClear();
  });

  it("drops ownership fields from the saved patch", () => {
    expect(sanitizeAdminEventUpdate(coursePatch)).toEqual({
      title: "Corso esistente",
      image_url: "https://cdn.example/nuova.webp",
      organizer_display_name: "Nome già in scheda",
    });
  });

  it("rejects a signed-in user who is not an admin before any update", async () => {
    const response = await POST(saveRequest(coursePatch), {
      params: Promise.resolve({ id: EVENT_ID }),
    });
    expect(response.status).toBe(403);
    expect(db.update).not.toHaveBeenCalled();
  });

  it("lets an admin update an ownerless event without assigning an organizer", async () => {
    db.role = "admin";
    const response = await POST(saveRequest(coursePatch), {
      params: Promise.resolve({ id: EVENT_ID }),
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ id: EVENT_ID });
    expect(db.update).toHaveBeenCalledOnce();
    const patch = db.update.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(patch).not.toHaveProperty("organizer_id");
    expect(patch).not.toHaveProperty("created_by");
    expect(patch.image_url).toBe("https://cdn.example/nuova.webp");
  });

  it("rejects the save when the row comes back with a new owner", async () => {
    db.role = "admin";
    db.updated = {
      id: EVENT_ID,
      organizer_id: db.userId,
      created_by: null,
    };
    const response = await POST(saveRequest(coursePatch), {
      params: Promise.resolve({ id: EVENT_ID }),
    });
    expect(response.status).toBe(500);
  });
});
