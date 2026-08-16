import Link from "next/link";
import { notFound } from "next/navigation";

import DeleteCampaignButton from "@/src/components/admin/DeleteCampaignButton";
import { requireAdmin } from "@/src/lib/auth";
import {
  campaignStatusLabel,
  formatBytes,
  type CampaignAttachmentMeta,
  type EmailCampaignRecipientRow,
  type EmailCampaignRow,
} from "@/src/lib/admin/email-campaigns";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string | null) {
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

export default async function AdminCampagnaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin(`/admin/campagne/${id}`);

  const [{ data: campaign, error: campaignError }, { data: recipients, error: recipientsError }] =
    await Promise.all([
      supabase.from("email_campaigns").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("email_campaign_recipients")
        .select("id, campaign_id, email, status, error, resend_id, sent_at, created_at")
        .eq("campaign_id", id)
        .order("email", { ascending: true }),
    ]);

  if (campaignError) {
    throw new Error(campaignError.message);
  }
  if (recipientsError) {
    throw new Error(recipientsError.message);
  }
  if (!campaign) {
    notFound();
  }

  const row = campaign as EmailCampaignRow;
  const recipientRows = (recipients || []) as EmailCampaignRecipientRow[];
  const attachments = (row.attachments || []) as CampaignAttachmentMeta[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <Link
        href="/admin/campagne"
        className="text-sm font-semibold text-[#075EAE] hover:underline"
      >
        ← Torna alle campagne
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {row.subject}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Inviata: {formatDate(row.sent_at)} · Da {row.from_email} · Reply-to{" "}
            {row.reply_to}
          </p>
          <p className="mt-2">
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {campaignStatusLabel(row.status)} · {row.sent_count}/
              {row.total_recipients} inviati · {row.failed_count} errori
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/campagne/nuova"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE]"
          >
            Nuova campagna
          </Link>
          <DeleteCampaignButton
            campaignId={row.id}
            subject={row.subject}
            redirectToList
            isSending={row.status === "sending"}
          />
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Messaggio
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-slate-800">{row.body_text}</p>
      </section>

      {attachments.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Allegati ({attachments.length})
          </h2>
          <ul className="mt-3 space-y-2">
            {attachments.map((file) => (
              <li
                key={`${file.filename}-${file.size_bytes}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-slate-900">
                  {file.filename}
                </span>
                <span className="text-slate-500">
                  {file.content_type} · {formatBytes(file.size_bytes)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
              <th className="px-4 py-3 font-semibold">Dettaglio</th>
              <th className="px-4 py-3 font-semibold">Inviata</th>
            </tr>
          </thead>
          <tbody>
            {recipientRows.map((recipient) => (
              <tr
                key={recipient.id}
                className="border-b border-slate-100 align-top"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {recipient.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      recipient.status === "sent"
                        ? "bg-emerald-100 text-emerald-800"
                        : recipient.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {recipient.status === "sent"
                      ? "Inviata"
                      : recipient.status === "failed"
                        ? "Errore"
                        : "In attesa"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {recipient.error || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                  {formatDate(recipient.sent_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
