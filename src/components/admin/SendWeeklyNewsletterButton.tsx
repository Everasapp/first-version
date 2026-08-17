"use client";

import { useState } from "react";
import { LoaderCircle, Mail, Send } from "lucide-react";

type SendWeeklyNewsletterButtonProps = {
  subscriberCount: number;
  testEmail: string;
};

export default function SendWeeklyNewsletterButton({
  subscriberCount,
  testEmail,
}: SendWeeklyNewsletterButtonProps) {
  const [isSending, setIsSending] = useState<"test" | "all" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function send(mode: "test" | "all") {
    setError("");
    setMessage("");

    if (mode === "all") {
      const confirmed = window.confirm(
        `Inviare la newsletter di questa settimana a ${subscriberCount} utenti iscritti?`,
      );
      if (!confirmed) return;
    }

    setIsSending(mode);
    try {
      const response = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "test" ? { testEmail } : {},
        ),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        sent?: number;
        skipped?: number;
        failed?: number;
        weekLabel?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Invio non riuscito");
      }

      setMessage(
        mode === "test"
          ? `Anteprima inviata a ${testEmail}.`
          : `Newsletter inviata. Consegnate: ${payload.sent ?? 0} · saltate: ${payload.skipped ?? 0} · errori: ${payload.failed ?? 0}.`,
      );
    } catch (sendError) {
      setError(
        sendError instanceof Error ? sendError.message : "Invio non riuscito",
      );
    } finally {
      setIsSending(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isSending !== null}
          onClick={() => send("test")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#075EAE] px-4 py-2.5 text-sm font-bold text-[#075EAE] transition hover:bg-sky-50 disabled:opacity-60"
        >
          {isSending === "test" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Mail className="h-4 w-4" aria-hidden="true" />
          )}
          Invia anteprima a me
        </button>
        <button
          type="button"
          disabled={isSending !== null || subscriberCount === 0}
          onClick={() => send("all")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E67E22] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:opacity-60"
        >
          {isSending === "all" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          Invia agli iscritti ({subscriberCount})
        </button>
      </div>
      {message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
