"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { EVERAS_SELF_PROMO_ORDER_ID } from "@/src/lib/ads/types";

export default function AdminAdvertisingDeleteButton({
  orderId,
  companyName,
}: {
  orderId: string;
  companyName: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (orderId === EVERAS_SELF_PROMO_ORDER_ID) {
    return (
      <span className="text-xs text-slate-400" title="Banner istituzionale">
        —
      </span>
    );
  }

  async function onDelete() {
    const ok = window.confirm(
      `Eliminare definitivamente il banner di “${companyName}”?\n\nQuesta azione non si può annullare.`,
    );
    if (!ok) return;

    setError(null);
    setPending(true);
    try {
      const response = await fetch(
        `/api/admin/advertising/${orderId}/delete`,
        { method: "POST" },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Eliminazione non riuscita.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => void onDelete()}
        className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
      >
        {pending ? "..." : "Cancella"}
      </button>
      {error ? <p className="max-w-[10rem] text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
