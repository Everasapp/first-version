import Link from "next/link";

import { formatCtr } from "@/src/lib/ads/banner-stats";
import { createAdminClient } from "@/src/lib/supabase/admin";
import type { AdvertisingOrderRow } from "@/src/lib/ads/types";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  awaiting_payment: "In attesa pagamento",
  paid: "Pagato",
  awaiting_approval: "Da verificare",
  needs_changes: "Modifiche richieste",
  approved: "Approvato",
  active: "Attivo",
  rejected: "Rifiutato",
  expired: "Scaduto",
  cancelled: "Annullato",
  draft: "Bozza",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date(value));
}

export default async function AdminPubblicitaPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("advertising_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="text-red-600">
          Errore caricamento ordini: {error.message}
        </p>
      </div>
    );
  }

  const orders = (data ?? []) as AdvertisingOrderRow[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Pubblicità
      </h1>
      <p className="mt-2 text-slate-600">
        Ordini banner pubblicitari da verificare e gestire.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Azienda</th>
              <th className="px-4 py-3 font-semibold">Pacchetto</th>
              <th className="px-4 py-3 font-semibold">Posizione</th>
              <th className="px-4 py-3 font-semibold">Prezzo</th>
              <th className="px-4 py-3 font-semibold">Views</th>
              <th className="px-4 py-3 font-semibold">Click</th>
              <th className="px-4 py-3 font-semibold">CTR</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
              <th className="px-4 py-3 font-semibold">Scadenza</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nessun ordine pubblicitario.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const impressions = Number(order.impressions_count ?? 0);
                const clicks = Number(order.clicks_count ?? 0);
                return (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pubblicita/${order.id}`}
                        className="font-semibold text-[#075EAE] hover:underline"
                      >
                        {order.company_name}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatDate(order.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {order.package_name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {order.placement === "home" ? "Home" : "Interne"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      €{Number(order.final_price ?? order.price).toFixed(0)}
                      {order.promo_applied ? (
                        <span className="ml-1 text-xs font-semibold text-[#C96A1A]">
                          promo
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {impressions.toLocaleString("it-IT")}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {clicks.toLocaleString("it-IT")}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatCtr(impressions, clicks)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(order.expiration_date)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
