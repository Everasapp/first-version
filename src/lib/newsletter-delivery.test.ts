import { afterEach, describe, expect, it, vi } from "vitest";
import { getCurrentRomeWeekRange } from "./newsletter-week";
import {
  deliverNewsletterBatch,
  interpretNewsletterClaim,
  isMissingNewsletterStructure,
  keepFirstNewsletterSnapshot,
  newsletterIdempotencyKey,
  NEWSLETTER_BATCH_LIMIT,
  NEWSLETTER_STRUCTURE_MESSAGE,
} from "./newsletter-delivery";

type Row = {
  status: "sending" | "sent" | "skipped" | "failed" | "uncertain";
  idempotencyKey: string;
  claimedAt: number;
  firstClaimedAt: number;
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
            firstClaimedAt: now(),
          });
          return { action: "send", idempotency_key: input.idempotencyKey };
        }
        if (existing.status === "sent" || existing.status === "skipped" || existing.status === "uncertain") {
          return { action: "skip", reason: existing.status };
        }
        if (now() - existing.firstClaimedAt >= 24 * 60 * 60 * 1000) {
          existing.status = "uncertain";
          return { action: "skip", reason: "uncertain" };
        }
        if (existing.status === "failed") {
          existing.status = "sending";
          existing.claimedAt = now();
          return { action: "send", idempotency_key: existing.idempotencyKey };
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
          firstClaimedAt: started,
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
      firstClaimedAt: started,
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

  it.each(["sending", "failed"] as const)(
    "does not extend the provider window after a retry in status %s",
    async (status) => {
      const started = Date.parse("2026-10-21T08:00:00Z");
      let clock = started + 23 * 60 * 60 * 1000;
      const store = memoryClaims(() => clock);
      const rowKey = "profile:user-1|2026-10-19";
      store.rows.set(rowKey, {
        status,
        idempotencyKey: "newsletter/2026-10-19/profile:user-1",
        claimedAt: started,
        firstClaimedAt: started,
      });
      const input = {
        recipientKey: "profile:user-1",
        weekKey: "2026-10-19",
        idempotencyKey: "newsletter/2026-10-19/profile:user-1",
      };
      expect((await store.claim(input)).action).toBe("send");
      expect(store.rows.get(rowKey)?.firstClaimedAt).toBe(started);
      expect(store.rows.get(rowKey)?.claimedAt).toBe(clock);
      // The last attempt was only two hours ago, but the first was 25h ago.
      // Even a failed post-send database write must not make this retryable.
      if (status === "failed") {
        await store.complete({ ...input, status: "failed" });
      }
      clock = started + 25 * 60 * 60 * 1000;
      expect(await store.claim(input)).toEqual({ action: "skip", reason: "uncertain" });
      expect(store.rows.get(rowKey)?.firstClaimedAt).toBe(started);
    },
  );

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

  it("continues the next batch without skipping the people still waiting", async () => {
    const store = memoryClaims(() => Date.now());
    const sent: string[] = [];
    const recipients = Array.from({ length: 25 }, (_, index) => ({
      id: `user-${index}`,
      source: "profile" as const,
    }));
    const run = () =>
      deliverNewsletterBatch({
        weekKey: "2026-10-19",
        recipients,
        limit: NEWSLETTER_BATCH_LIMIT,
        claim: store.claim,
        complete: store.complete,
        perform: async (recipient) => {
          sent.push(recipient.id);
          return "sent";
        },
      });

    const first = await run();
    const second = await run();

    expect(first.sent).toBe(20);
    expect(first.remaining).toBe(5);
    expect(second.sent).toBe(5);
    expect(second.skipped).toBe(20);
    expect(sent).toEqual(recipients.map((recipient) => recipient.id));
  });

  it("keeps the first subject and HTML when a retry would compose something else", async () => {
    const store = memoryClaims(() => Date.now());
    const snapshots = new Map<string, { subject: string; html: string }>();
    const delivered: Array<{ key: string; html: string }> = [];
    let attempt = 0;

    const run = (composed: { subject: string; html: string }) =>
      deliverNewsletterBatch({
        weekKey: "2026-10-19",
        recipients: [{ id: "user-1", source: "profile" }],
        limit: NEWSLETTER_BATCH_LIMIT,
        claim: store.claim,
        complete: store.complete,
        perform: async (_recipient, idempotencyKey) => {
          const snapshot = keepFirstNewsletterSnapshot(
            snapshots.get(idempotencyKey) ?? null,
            composed,
          );
          snapshots.set(idempotencyKey, snapshot);
          attempt += 1;
          if (attempt === 1) throw new Error("processo interrotto");
          delivered.push({ key: idempotencyKey, html: snapshot.html });
          return "sent";
        },
      });

    const interrupted = await run({ subject: "Settimana", html: "<p>Prima</p>" });
    const resumed = await run({ subject: "Settimana", html: "<p>Diversa</p>" });

    expect(interrupted.failed).toBe(1);
    expect(resumed.sent).toBe(1);
    expect(delivered).toEqual([
      {
        key: "newsletter/2026-10-19/profile:user-1",
        html: "<p>Prima</p>",
      },
    ]);
  });

  it("completes 140 recipients in one Rome week and starts over on Monday", async () => {
    const firstRun = new Date("2026-10-19T07:00:00Z");
    const weekKeys = Array.from({ length: 8 }, (_, day) =>
      getCurrentRomeWeekRange(
        new Date(firstRun.getTime() + day * 24 * 60 * 60 * 1000),
      ).weekKey,
    );
    expect(weekKeys.slice(0, 7).every((key) => key === "2026-10-19")).toBe(true);
    expect(weekKeys[7]).toBe("2026-10-26");

    const store = memoryClaims(() => Date.now());
    const recipients = Array.from({ length: 150 }, (_, index) => ({
      id: `user-${index}`,
      source: "profile" as const,
    }));
    const sent = new Map<string, string[]>();
    const run = (weekKey: string) =>
      deliverNewsletterBatch({
        weekKey,
        recipients,
        limit: NEWSLETTER_BATCH_LIMIT,
        claim: store.claim,
        complete: store.complete,
        perform: async (recipient) => {
          const list = sent.get(weekKey) ?? [];
          list.push(recipient.id);
          sent.set(weekKey, list);
          return "sent";
        },
      });

    for (let day = 0; day < 7; day += 1) {
      const result = await run("2026-10-19");
      expect(result.sent).toBe(NEWSLETTER_BATCH_LIMIT);
    }
    expect(sent.get("2026-10-19")).toHaveLength(140);
    expect(sent.get("2026-10-19")).not.toContain("user-140");

    const nextWeek = await run("2026-10-26");
    expect(nextWeek.sent).toBe(20);
    expect(sent.get("2026-10-26")?.slice(0, 3)).toEqual([
      "user-0",
      "user-1",
      "user-2",
    ]);
    expect(sent.get("2026-10-19")).not.toContain("user-140");
  });
});
