import Link from "next/link";
import { Mail } from "lucide-react";

import { requireAdmin } from "@/src/lib/auth";
import {
  campaignStatusLabel,
  type EmailCampaignRow,
} from "@/src/lib/admin/email-campaigns";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(value));
}

function statusClass(status: EmailCampaignRow["status"]) {
  switch (status) {
    case "sent":
      return "bg-emerald-100 text-emerald-800";
    case "partial":
      return "bg-amber-100 text-amber-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "sending":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function AdminCampagnePage() {
  const { supabase } = await requireAdmin("/admin/campagne");

  const { data, error } = await supabase
    .from("email_campaigns")
    .select(
      "id, subject, status, total_recipients, sent_count, failed_count, created_at, sent_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(`Impossibile caricare le campagne: ${error.message}`);
  }

  const campaigns = (data || []) as EmailCampaignRow[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Campagne email
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Invia messaggi ai comuni/organizzatori via Resend. Mittente:{" "}
            info@mail.everas.it · risposte: info@everas.it.
          </p>
        </div>
        <Link
          href="/admin/campagne/nuova"
          className="inline-flex items-center gap-2 rounded-xl bg-[#E67E22] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Nuova campagna
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <p className="font-semibold text-slate-800">Nessuna campagna ancora</p>
          <p className="mt-2 text-sm text-slate-600">
            Crea la prima campagna e importa l’elenco email.
          </p>
          <Link
            href="/admin/campagne/nuova"
            className="mt-5 inline-flex rounded-xl border border-[#075EAE] px-4 py-2 text-sm font-bold text-[#075EAE]"
          >
            Nuova campagna
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Oggetto</th>
                <th className="px-4 py-3 font-semibold">Destinatari</th>
                <th className="px-4 py-3 font-semibold">Inviati</th>
                <th className="px-4 py-3 font-semibold">Errori</th>
                <th className="px-4 py-3 font-semibold">Stato</th>
                <th className="px-4 py-3 font-semibold">Dettaglio</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-slate-100 align-top"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {formatDate(campaign.sent_at || campaign.created_at)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {campaign.subject}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {campaign.total_recipients}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {campaign.sent_count}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {campaign.failed_count}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                        campaign.status,
                      )}`}
                    >
                      {campaignStatusLabel(campaign.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/campagne/${campaign.id}`}
                      className="font-semibold text-[#075EAE] hover:underline"
                    >
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
