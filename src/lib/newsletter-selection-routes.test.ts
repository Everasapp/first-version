import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  userId: null as string | null,
  rpc: vi.fn(async () => ({ data: "subscribed", error: null })),
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
    rpc: db.rpc,
    from: () => ({
      update: (patch: Record<string, unknown>) => {
        db.update(patch);
        return {
          eq: () => ({
            select: () => ({
              maybeSingle: async () => ({ data: { id: db.userId }, error: null }),
            }),
          }),
        };
      },
    }),
  })),
}));

import { POST as savePreferences } from "@/app/api/newsletter/preferences/route";
import { POST as subscribe } from "@/app/api/newsletter/subscribe/route";

const areas = ["Nord Sardegna", "Centro Sardegna"];
const disciplines = ["musica", "lingue"];

describe("newsletter signup without an account", () => {
  beforeEach(() => {
    db.userId = null;
    db.rpc.mockClear();
    db.update.mockClear();
  });

  it("stores zones and disciplines through the public subscription", async () => {
    db.rpc.mockResolvedValueOnce({ data: "subscribed", error: null });
    const response = await subscribe(
      new Request("https://everas.test/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "persona@example.test", areas, disciplines }),
      }),
    );
    expect(response.status).toBe(200);
    expect(db.rpc).toHaveBeenCalledWith("subscribe_newsletter", {
      p_email: "persona@example.test",
      p_areas: areas,
      p_disciplines: disciplines,
    });
    expect(db.update).not.toHaveBeenCalled();
  });

  it("updates an existing email subscription", async () => {
    db.rpc.mockResolvedValueOnce({ data: "updated", error: null });
    const response = await subscribe(
      new Request("https://everas.test/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email: "persona@example.test",
          areas: ["Sud Sardegna"],
          disciplines: ["pittura-disegno"],
        }),
      }),
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "updated" });
  });

  it("rejects a sixth discipline before saving", async () => {
    const response = await subscribe(
      new Request("https://everas.test/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email: "persona@example.test",
          areas: ["Nord Sardegna"],
          disciplines: ["musica", "lingue", "cucina", "teatro", "ceramica", "fotografia-video"],
        }),
      }),
    );
    expect(response.status).toBe(400);
    expect(db.rpc).not.toHaveBeenCalled();
  });
});

describe("account newsletter preferences", () => {
  beforeEach(() => {
    db.userId = "user-1";
    db.update.mockClear();
  });

  it("requires a signed-in account and never writes the unsubscribe token", async () => {
    db.userId = null;
    const anonymous = await savePreferences(
      new Request("https://everas.test/api/newsletter/preferences", {
        method: "POST",
        body: JSON.stringify({ optIn: true, areas, disciplines }),
      }),
    );
    expect(anonymous.status).toBe(401);

    db.userId = "user-1";
    const saved = await savePreferences(
      new Request("https://everas.test/api/newsletter/preferences", {
        method: "POST",
        body: JSON.stringify({ optIn: true, areas, disciplines }),
      }),
    );
    expect(saved.status).toBe(200);
    const patch = db.update.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(patch.newsletter_areas).toEqual(areas);
    expect(patch.newsletter_disciplines).toEqual(disciplines);
    expect(patch).not.toHaveProperty("newsletter_unsub_token");
  });
});
