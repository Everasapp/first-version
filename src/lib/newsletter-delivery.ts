export const NEWSLETTER_BATCH_LIMIT = 20;

export const NEWSLETTER_STRUCTURE_MESSAGE =
  "Invio newsletter sospeso: manca la registrazione settimanale nel database. Nessuna email è stata inviata.";

export type NewsletterDeliverySource = "profile" | "subscriber" | "test";

export type NewsletterDeliveryRecipient = {
  id: string;
  source: NewsletterDeliverySource;
};

export function newsletterRecipientKey(
  source: NewsletterDeliverySource,
  id: string,
) {
  return `${source}:${id}`;
}

export function newsletterIdempotencyKey(weekKey: string, recipientKey: string) {
  const key = `newsletter/${weekKey}/${recipientKey}`;
  if (key.length < 1 || key.length > 256) {
    throw new Error("Chiave di idempotenza newsletter non valida.");
  }
  return key;
}

export function isMissingNewsletterStructure(error: {
  code?: string | null;
  message?: string | null;
}) {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();
  return (
    code === "PGRST202" ||
    code === "42883" ||
    code === "42P01" ||
    message.includes("claim_newsletter_delivery") ||
    message.includes("stage_newsletter_body") ||
    message.includes("newsletter_week_deliveries") ||
    message.includes(NEWSLETTER_STRUCTURE_MESSAGE.toLowerCase())
  );
}

export type NewsletterClaim =
  | { type: "send"; idempotencyKey: string }
  | { type: "skip"; reason: string };

export function keepFirstNewsletterSnapshot(
  saved: { subject?: string | null; html?: string | null } | null,
  composed: { subject: string; html: string },
) {
  if (saved?.subject && saved?.html) {
    return { subject: saved.subject, html: saved.html };
  }
  if (!composed.subject || !composed.html) {
    throw new Error(NEWSLETTER_STRUCTURE_MESSAGE);
  }
  return { subject: composed.subject, html: composed.html };
}

export function interpretNewsletterClaim(payload: unknown): NewsletterClaim {
  if (!payload || typeof payload !== "object") {
    throw new Error(NEWSLETTER_STRUCTURE_MESSAGE);
  }
  const record = payload as { action?: unknown; idempotency_key?: unknown; reason?: unknown };
  if (record.action === "send") {
    const idempotencyKey = String(record.idempotency_key ?? "");
    if (!idempotencyKey) throw new Error(NEWSLETTER_STRUCTURE_MESSAGE);
    return { type: "send", idempotencyKey };
  }
  if (record.action === "skip") {
    return { type: "skip", reason: String(record.reason ?? "already") };
  }
  throw new Error(NEWSLETTER_STRUCTURE_MESSAGE);
}

export type NewsletterBatchResult = {
  sent: number;
  skipped: number;
  failed: number;
  remaining: number;
  errors: Array<{ userId: string; error: string }>;
};

export async function deliverNewsletterBatch({
  weekKey,
  recipients,
  limit,
  claim,
  perform,
  complete,
}: {
  weekKey: string;
  recipients: NewsletterDeliveryRecipient[];
  limit: number;
  claim: (input: {
    recipientKey: string;
    weekKey: string;
    idempotencyKey: string;
  }) => Promise<unknown>;
  perform: (
    recipient: NewsletterDeliveryRecipient,
    idempotencyKey: string,
  ) => Promise<"sent" | "skipped">;
  complete: (input: {
    recipientKey: string;
    weekKey: string;
    status: "sent" | "skipped" | "failed";
    errorMessage?: string;
  }) => Promise<void>;
}): Promise<NewsletterBatchResult> {
  const result: NewsletterBatchResult = {
    sent: 0,
    skipped: 0,
    failed: 0,
    remaining: 0,
    errors: [],
  };
  let delivered = 0;

  for (const recipient of recipients) {
    if (delivered >= limit) {
      result.remaining += 1;
      continue;
    }

    const recipientKey = newsletterRecipientKey(recipient.source, recipient.id);
    const idempotencyKey = newsletterIdempotencyKey(weekKey, recipientKey);
    let decision: NewsletterClaim;
    try {
      decision = interpretNewsletterClaim(
        await claim({ recipientKey, weekKey, idempotencyKey }),
      );
    } catch (error) {
      if (
        isMissingNewsletterStructure({
          code: error && typeof error === "object" && "code" in error
            ? String((error as { code?: unknown }).code ?? "")
            : "",
          message: error instanceof Error ? error.message : String(error),
        })
      ) {
        throw new Error(NEWSLETTER_STRUCTURE_MESSAGE);
      }
      throw error;
    }

    if (decision.type === "skip") {
      result.skipped += 1;
      continue;
    }

    try {
      const outcome = await perform(recipient, decision.idempotencyKey);
      await complete({
        recipientKey,
        weekKey,
        status: outcome,
      });
      if (outcome === "sent") {
        delivered += 1;
        result.sent += 1;
      } else {
        result.skipped += 1;
      }
    } catch (error) {
      if (
        isMissingNewsletterStructure({
          code: error && typeof error === "object" && "code" in error
            ? String((error as { code?: unknown }).code ?? "")
            : "",
          message: error instanceof Error ? error.message : String(error),
        })
      ) {
        throw new Error(NEWSLETTER_STRUCTURE_MESSAGE);
      }
      const message = error instanceof Error ? error.message : "Errore sconosciuto";
      result.failed += 1;
      result.errors.push({ userId: recipient.id, error: message });
      try {
        await complete({
          recipientKey,
          weekKey,
          status: "failed",
          errorMessage: message,
        });
      } catch {
        // The claim stays "sending" and can resume inside the provider window.
      }
    }
  }

  return result;
}
