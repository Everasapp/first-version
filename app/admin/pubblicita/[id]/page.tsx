import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdminAdvertisingActions from "@/src/components/admin/AdminAdvertisingActions";
import {
  formatCtr,
  getAdvertisingDailyStats,
} from "@/src/lib/ads/banner-stats";
import { getOrderById } from "@/src/lib/ads/orders";
import { getOrderBannerUrls } from "@/src/lib/ads/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(value));
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    timeZone: "Europe/Rome",
  }).format(new Date(`${value}T12:00:00`));
}

export default async function AdminPubblicitaDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const impressions = Number(order.impressions_count ?? 0);
  const clicks = Number(order.clicks_count ?? 0);
  const daily = await getAdvertisingDailyStats(order.id, 14);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <p className="text-sm">
        <Link
          href="/admin/pubblicita"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          ← Pubblicità
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {order.company_name}
      </h1>
      <p className="mt-1 text-slate-600">
        {order.package_name} · €
        {Number(order.final_price ?? order.price).toFixed(0)} ·{" "}
        <span className="font-semibold">{order.status}</span>
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Visualizzazioni
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {impressions.toLocaleString("it-IT")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Click
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {clicks.toLocaleString("it-IT")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            CTR
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {formatCtr(impressions, clicks)}
          </p>
        </div>
      </div>

      {daily.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Giorno</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold">Click</th>
                <th className="px-4 py-3 font-semibold">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {daily.map((row) => (
                <tr key={row.day}>
                  <td className="px-4 py-2.5 text-slate-700">
                    {formatDay(row.day)}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">
                    {row.impressions.toLocaleString("it-IT")}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">
                    {row.clicks.toLocaleString("it-IT")}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">
                    {formatCtr(row.impressions, row.clicks)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">Dettaglio</h2>
          <dl className="mt-2">
            <Row label="Referente" value={order.contact_name} />
            <Row label="Email" value={order.email} />
            <Row label="Telefono" value={order.phone} />
            <Row
              label="Indirizzo"
              value={`${order.address}, ${order.postal_code} ${order.city} (${order.province})`}
            />
            <Row
              label="URL"
              value={
                <a
                  href={order.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#075EAE] hover:underline break-all"
                >
                  {order.website_url}
                </a>
              }
            />
            <Row label="Posizione" value={order.placement} />
            <Row label="Durata" value={`${order.duration_months} mesi`} />
            <Row
              label="Listino"
              value={
                order.list_price != null
                  ? `€${Number(order.list_price).toFixed(0)}`
                  : "—"
              }
            />
            <Row
              label="Promo"
              value={
                order.promo_price != null
                  ? `€${Number(order.promo_price).toFixed(0)}`
                  : "—"
              }
            />
            <Row
              label="Prezzo finale"
              value={`€${Number(order.final_price ?? order.price).toFixed(0)}${
                order.promo_applied ? " (promo applicata)" : ""
              }`}
            />
            <Row label="PayPal order" value={order.paypal_order_id || "—"} />
            <Row label="PayPal capture" value={order.paypal_capture_id || "—"} />
            <Row label="Creato" value={formatDateTime(order.created_at)} />
            <Row label="Inviato" value={formatDateTime(order.submitted_at)} />
            <Row label="Pagato" value={formatDateTime(order.paid_at)} />
            <Row label="Inizio" value={formatDateTime(order.start_date)} />
            <Row label="Scadenza" value={formatDateTime(order.expiration_date)} />
            <Row label="Approvato" value={formatDateTime(order.approved_at)} />
            <Row label="Rifiutato" value={formatDateTime(order.rejected_at)} />
            <Row
              label="Note admin"
              value={
                <span className="whitespace-pre-wrap">
                  {order.admin_notes || "—"}
                </span>
              }
            />
            <Row
              label="Motivazione rifiuto"
              value={
                <span className="whitespace-pre-wrap">
                  {order.rejection_reason || "—"}
                </span>
              }
            />
          </dl>

          {getOrderBannerUrls(order).length > 0 ? (
            <div className="mt-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Anteprima banner
              </p>
              {getOrderBannerUrls(order).map((url, index) => (
                <div key={url}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                      src={url}
                      alt={`Banner ${order.company_name} ${index + 1}`}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-[#075EAE] hover:underline"
                  >
                    Apri banner {index + 1}
                  </a>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <AdminAdvertisingActions order={order} />
      </div>
    </div>
  );
}
