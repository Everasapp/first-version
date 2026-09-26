"use client";

import Image from "next/image";
import { useState } from "react";

import {
  getOrderBannerUrls,
  getOrderChargeAmount,
  type AdvertisingOrderRow,
} from "@/src/lib/ads/types";

export default function AdvertisingOrderClient({
  order,
  cancelled,
}: {
  order: AdvertisingOrderRow;
  cancelled?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replacePending, setReplacePending] = useState(false);
  const [replaceMessage, setReplaceMessage] = useState<string | null>(null);

  async function startPayPal() {
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/advertising/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: order.access_token }),
      });
      const data = (await response.json()) as {
        error?: string;
        approveUrl?: string;
      };
      if (!response.ok || !data.approveUrl) {
        throw new Error(data.error || "Impossibile avviare PayPal.");
      }
      window.location.href = data.approveUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore PayPal.");
      setPending(false);
    }
  }

  async function replaceBanners(files: FileList | null) {
    if (!files || files.length === 0) return;
    setReplaceMessage(null);
    setError(null);
    setReplacePending(true);
    try {
      const formData = new FormData();
      for (const file of Array.from(files).slice(0, 3)) {
        formData.append("banner", file);
      }
      const response = await fetch(
        `/api/advertising/orders/${order.access_token}/replace-banner`,
        { method: "POST", body: formData },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Aggiornamento non riuscito.");
      }
      setReplaceMessage(
        "Banner aggiornato. La richiesta è di nuovo in verifica.",
      );
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore aggiornamento.");
      setReplacePending(false);
    }
  }

  const chargeAmount = getOrderChargeAmount(order);
  const awaitingPayment = order.status === "awaiting_payment";
  const needsChanges = order.status === "needs_changes";
  const inReview = ["paid", "awaiting_approval"].includes(order.status);
  const isActive = order.status === "active";
  const isRejected = order.status === "rejected";

  return (
    <div className="space-y-6">
      {cancelled ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Hai annullato il pagamento PayPal. Puoi riprovare quando vuoi.
        </p>
      ) : null}

      {awaitingPayment ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-xl font-bold text-emerald-900">Richiesta ricevuta</h2>
          <p className="mt-2 text-sm leading-6 text-emerald-800">
            Abbiamo ricevuto i tuoi dati e il tuo banner.
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-800">
            Per completare l&apos;ordine effettua il pagamento di €
            {chargeAmount.toFixed(0)} tramite PayPal.
          </p>
        </div>
      ) : null}

      {inReview ? (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <h2 className="text-xl font-bold text-sky-900">In verifica</h2>
          <p className="mt-2 text-sm leading-6 text-sky-800">
            Pagamento ricevuto. Il materiale è in fase di approvazione.
          </p>
        </div>
      ) : null}

      {isActive ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-xl font-bold text-emerald-900">Banner online</h2>
          <p className="mt-2 text-sm leading-6 text-emerald-800">
            Il tuo banner è attivo su EVERAS.
          </p>
        </div>
      ) : null}

      {needsChanges ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-xl font-bold text-amber-900">Modifiche richieste</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900 whitespace-pre-wrap">
            {order.admin_notes || "Sono necessarie modifiche al materiale."}
          </p>
          <label className="mt-4 block text-sm font-semibold text-amber-950">
            Carica da 1 a 3 banner (JPG, PNG, WEBP o GIF)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,.gif"
              multiple
              disabled={replacePending}
              className="mt-2 block w-full text-sm"
              onChange={(e) => {
                void replaceBanners(e.target.files);
              }}
            />
          </label>
          {replaceMessage ? (
            <p className="mt-2 text-sm text-emerald-700">{replaceMessage}</p>
          ) : null}
        </div>
      ) : null}

      {isRejected ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-xl font-bold text-red-900">Non approvata</h2>
          <p className="mt-2 text-sm leading-6 text-red-800 whitespace-pre-wrap">
            {order.rejection_reason || "La richiesta non è stata approvata."}
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Riepilogo</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Azienda</dt>
            <dd className="font-semibold text-slate-900">{order.company_name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Pacchetto</dt>
            <dd className="font-semibold text-slate-900">{order.package_name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Durata</dt>
            <dd className="font-semibold text-slate-900">
              {order.duration_months} mesi
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Prezzo</dt>
            <dd className="text-right font-semibold text-slate-900">
              {order.promo_applied &&
              order.list_price != null &&
              Number(order.list_price) !== chargeAmount ? (
                <span className="block">
                  <span className="mr-2 text-slate-400 line-through">
                    €{Number(order.list_price).toFixed(0)}
                  </span>
                  <span className="text-[#E67E22]">
                    €{chargeAmount.toFixed(0)}
                  </span>
                </span>
              ) : (
                <>€{chargeAmount.toFixed(0)}</>
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
            <dt className="text-slate-500">URL</dt>
            <dd className="max-w-[60%] truncate font-semibold text-[#075EAE]">
              <a
                href={order.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {order.website_url}
              </a>
            </dd>
          </div>
        </dl>

        {getOrderBannerUrls(order).length > 0 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {getOrderBannerUrls(order).map((url, index) => (
              <div
                key={url}
                className="relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <Image
                  src={url}
                  alt={`Banner ${order.company_name} ${index + 1}`}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        ) : null}

        {awaitingPayment ? (
          <button
            type="button"
            onClick={() => void startPayPal()}
            disabled={pending}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#E67E22] px-5 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:opacity-60"
          >
            {pending ? "Reindirizzamento..." : "Paga con PayPal"}
          </button>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
