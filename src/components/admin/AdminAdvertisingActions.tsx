"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AdvertisingOrderRow } from "@/src/lib/ads/types";

export default function AdminAdvertisingActions({
  order,
}: {
  order: AdvertisingOrderRow;
}) {
  const router = useRouter();
  const [note, setNote] = useState(order.admin_notes || "");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(path: string, body?: Record<string, string>) {
    setError(null);
    setPending(path);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Operazione non riuscita.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setPending(null);
    }
  }

  const awaitingPayment = order.status === "awaiting_payment";
  const canModerate = [
    "awaiting_approval",
    "paid",
    "needs_changes",
  ].includes(order.status);

  if (!canModerate && order.status !== "active" && !awaitingPayment) {
    return null;
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">Azioni</h2>

      {awaitingPayment ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            Se il cliente ha pagato con il link PayPal NCP, conferma qui dopo
            aver verificato la ricevuta su PayPal.
          </p>
          <button
            type="button"
            disabled={Boolean(pending)}
            onClick={() =>
              void call(`/api/admin/advertising/${order.id}/mark-paid`)
            }
            className="rounded-xl bg-[#075EAE] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#064E91] disabled:opacity-60"
          >
            {pending?.includes("mark-paid") ? "..." : "Segna come pagato"}
          </button>
        </div>
      ) : null}

      {canModerate || order.status === "active" ? (
        <div className="flex flex-wrap gap-3">
          {canModerate ? (
            <button
              type="button"
              disabled={Boolean(pending)}
              onClick={() =>
                void call(`/api/admin/advertising/${order.id}/approve`)
              }
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {pending?.includes("approve") ? "..." : "Approva"}
            </button>
          ) : null}
        </div>
      ) : null}

      {canModerate ? (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Richiedi modifiche — nota
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Es. Il banner deve essere ridimensionato."
            />
          </label>
          <button
            type="button"
            disabled={Boolean(pending) || !note.trim()}
            onClick={() =>
              void call(`/api/admin/advertising/${order.id}/request-changes`, {
                note,
              })
            }
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-60"
          >
            Richiedi modifiche
          </button>
        </div>
      ) : null}

      {canModerate || order.status === "active" ? (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Rifiuta — motivazione
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Motivazione del rifiuto"
            />
          </label>
          <button
            type="button"
            disabled={Boolean(pending) || !reason.trim()}
            onClick={() =>
              void call(`/api/admin/advertising/${order.id}/reject`, {
                reason,
              })
            }
            className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-800 hover:bg-red-100 disabled:opacity-60"
          >
            Rifiuta
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
