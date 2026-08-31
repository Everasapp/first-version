"use client";

import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";

export default function SendExternalOrganizersButton() {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSend() {
    const confirmed = window.confirm(
      "Inviare la campagna rivendica a tutti gli organizzatori esterni non ancora contattati? Ogni email sarà inviata singolarmente, con i link dei propri eventi.",
    );
    if (!confirmed) return;

    setIsSending(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/campaigns/external-organizer-event-emails/send",
        { method: "POST" },
      );
      const data = (await response.json()) as {
        ok?: boolean;
        sent?: number;
        failed?: number;
        recipientCount?: number;
        campaignId?: string;
        error?: string;
        errors?: Array<{ email: string; error: string }>;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Invio non riuscito");
      }

      setMessage(
        `Inviate ${data.sent ?? 0} email su ${data.recipientCount ?? 0}.` +
          (data.failed ? ` Errori: ${data.failed}.` : ""),
      );

      if (data.campaignId) {
        window.location.href = `/admin/campagne/${data.campaignId}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invio non riuscito");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleSend}
        disabled={isSending}
        className="inline-flex items-center gap-2 rounded-xl border border-[#075EAE]/30 bg-blue-50 px-4 py-2.5 text-sm font-bold text-[#075EAE] transition hover:bg-blue-100 disabled:opacity-60"
      >
        {isSending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {isSending ? "Invio in corso…" : "Invia organizzatori esterni"}
      </button>
      {message ? (
        <p className="text-sm font-medium text-emerald-700">{message}</p>
      ) : null}
      {error ? (
        <p className="text-sm font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
