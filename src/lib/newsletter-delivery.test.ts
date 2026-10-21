import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deliverNewsletterBatch,
  interpretNewsletterClaim,
  isMissingNewsletterStructure,
  newsletterIdempotencyKey,
  NEWSLETTER_STRUCTURE_MESSAGE,
} from "./newsletter-delivery";

type Row = {
  status: "sending" | "sent" | "skipped" | "failed" | "uncertain";
  idempotencyKey: string;
  claimedAt: number;
};

function memoryClaims(now: () => number) {
  const rows = new Map<string, Row>();
  let chain = Promise.resolve();
  const exclusive = <T>(work: () => T) => {
    const run = chain.then(work, work);
    chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  };

  return {
    rows,
    async claim(input: { recipientKey: string; weekKey: string; idempotencyKey: string }) {
      return exclusive(() => {
        const id = `${input.recipientKey}|${input.weekKey}`;
        const existing = rows.get(id);
        if (!existing) {
          rows.set(id, {
            status: "sending",
            idempotencyKey: input.idempotencyKey,
            claimedAt: now(),
          });
          return { action: "send", idempotency_key: input.idempotencyKey };
        }
        if (existing.status === "sent" || existing.status === "skipped" || existing.status === "uncertain") {
          return { action: "skip", reason: existing.status };
        }
        if (existing.status === "failed") {
          existing.status = "sending";
          existing.claimedAt = now();
          return { action: "send", idempotency_key: existing.idempotencyKey };
        }
        if (now() - existing.claimedAt >= 24 * 60 * 60 * 1000) {
          existing.status = "uncertain";
          return { action: "skip", reason: "uncertain" };
        }
        if (now() - existing.claimedAt >= 10 * 60 * 1000) {
          existing.claimedAt = now();
          return { action: "send", idempotency_key: existing.idempotencyKey };
        }
        return { action: "skip", reason: "sending" };
      });
    },
    async complete(input: {
      recipientKey: string;
      weekKey: string;
      status: "sent" | "skipped" | "failed";
    }) {
      const row = rows.get(`${input.recipientKey}|${input.weekKey}`);
      if (row?.status === "sending") row.status = input.status;
    },
  };
}

describe("weekly newsletter delivery", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reads a claim before any send and skips a second claim", async () => {
    const store = memoryClaims(() => Date.now());
    const send = vi.fn(async () => "sent" as const);
    const recipient = { id: "user-1", source: "profile" as const };

    const first = await deliverNewsletterBatch({
      weekKey: "2026-10-19",
      recipients: [recipient],
      limit: 20,
      claim: store.claim,
      complete: store.complete,
      perform: async (_recipient, idempotencyKey) => {
        expect(idempotencyKey).toBe(
          newsletterIdempotencyKey("2026-10-19", "profile:user-1"),
        );
        return send();
      },
    });
    const second = await deliverNewsletterBatch({
      weekKey: "2026-10-19",
      recipients: [recipient],
      limit: 20,
      claim: store.claim,
      complete: store.complete,
      perform: async () => send(),
    });

    expect(first.sent).toBe(1);
    expect(second.skipped).toBe(1);
    expect(send).toHaveBeenCalledOnce();
  });

  it("lets only one of two concurrent claims send", async () => {
    const store = memoryClaims(() => Date.now());
    const send = vi.fn(async () => "sent" as const);
    const recipient = { id: "user-1", source: "profile" as const };
    const run = () =>
      deliverNewsletterBatch({
        weekKey: "2026-10-19",
        recipients: [recipient],
        limit: 20,
        claim: store.claim,
        complete: store.complete,
        perform: async () => send(),
      });

    const [left, right] = await Promise.all([run(), run()]);

    expect(left.sent + right.sent).toBe(1);
    expect(left.skipped + right.skipped).toBe(1);
    expect(send).toHaveBeenCalledOnce();
  });

  it("stops before sending when the weekly register is missing", async () => {
    const send = vi.fn(async () => "sent" as const);

    await expect(
      deliverNewsletterBatch({
        weekKey: "2026-10-19",
        recipients: [{ id: "user-1", source: "profile" }],
        limit: 20,
        claim: async () => {
          throw Object.assign(new Error("Could not find claim_newsletter_delivery"), {
            code: "PGRST202",
          });
        },
        complete: async () => undefined,
        perform: async () => send(),
      }),
    ).rejects.toThrow(NEWSLETTER_STRUCTURE_MESSAGE);

    expect(send).not.toHaveBeenCalled();
    expect(isMissingNewsletterStructure({ code: "42P01", message: "" })).toBe(true);
  });

  it("keeps a resumed send on the original idempotency key inside 24 hours", () => {
    const started = Date.parse("2026-10-21T08:00:00Z");
    const store = memoryClaims(() => started);
    return store
      .claim({
        recipientKey: "profile:user-1",
        weekKey: "2026-10-19",
        idempotencyKey: "newsletter/2026-10-19/profile:user-1",
      })
      .then(() => {
        const later = memoryClaims(() => started + 11 * 60 * 1000);
        later.rows.set("profile:user-1|2026-10-19", {
          status: "sending",
          idempotencyKey: "newsletter/2026-10-19/profile:user-1",
          claimedAt: started,
        });
        return later.claim({
          recipientKey: "profile:user-1",
          weekKey: "2026-10-19",
          idempotencyKey: "newsletter/2026-10-19/profile:user-1",
        });
      })
      .then((result) => {
        expect(interpretNewsletterClaim(result)).toEqual({
          type: "send",
          idempotencyKey: "newsletter/2026-10-19/profile:user-1",
        });
      });
  });

  it("does not send again after the provider idempotency window", async () => {
    const started = Date.parse("2026-10-21T08:00:00Z");
    const store = memoryClaims(() => started + 25 * 60 * 60 * 1000);
    store.rows.set("profile:user-1|2026-10-19", {
      status: "sending",
      idempotencyKey: "newsletter/2026-10-19/profile:user-1",
      claimedAt: started,
    });
    const send = vi.fn(async () => "sent" as const);

    const result = await deliverNewsletterBatch({
      weekKey: "2026-10-19",
      recipients: [{ id: "user-1", source: "profile" }],
      limit: 20,
      claim: store.claim,
      complete: store.complete,
      perform: async () => send(),
    });

    expect(result.skipped).toBe(1);
    expect(send).not.toHaveBeenCalled();
    expect(store.rows.get("profile:user-1|2026-10-19")?.status).toBe("uncertain");
  });

  it("leaves the rest of a week for the next limited batch", async () => {
    const store = memoryClaims(() => Date.now());
    const send = vi.fn(async () => "sent" as const);
    const recipients = Array.from({ length: 3 }, (_, index) => ({
      id: `user-${index}`,
      source: "profile" as const,
    }));

    const result = await deliverNewsletterBatch({
      weekKey: "2026-10-19",
      recipients,
      limit: 2,
      claim: store.claim,
      complete: store.complete,
      perform: async () => send(),
    });

    expect(result.sent).toBe(2);
    expect(result.remaining).toBe(1);
    expect(send).toHaveBeenCalledTimes(2);
  });
});
