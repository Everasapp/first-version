import Link from "next/link";

import NewCampaignForm from "@/src/components/admin/NewCampaignForm";
import { requireAdmin } from "@/src/lib/auth";
import {
  parseCampaignId,
  parseEmailList,
} from "@/src/lib/admin/email-campaigns";

export const dynamic = "force-dynamic";

type AdminNuovaCampagnaPageProps = {
  searchParams: Promise<{
    from?: string | string[];
  }>;
};

export default async function AdminNuovaCampagnaPage({
  searchParams,
}: AdminNuovaCampagnaPageProps) {
  const { supabase } = await requireAdmin("/admin/campagne/nuova");
  const params = await searchParams;
  const fromId = parseCampaignId(params.from);

  let initialSubject = "";
  let initialMessage = "";
  let initialRecipients = "";
  let isForward = false;

  if (fromId) {
    const [{ data: campaign }, { data: recipients }] = await Promise.all([
      supabase
        .from("email_campaigns")
        .select("id, subject, body_text")
        .eq("id", fromId)
        .maybeSingle(),
      supabase
        .from("email_campaign_recipients")
        .select("email")
        .eq("campaign_id", fromId),
    ]);

    if (campaign) {
      isForward = true;
      initialSubject = campaign.subject ?? "";
      initialMessage = campaign.body_text ?? "";
      initialRecipients = parseEmailList(
        (recipients || [])
          .map((row) => (typeof row.email === "string" ? row.email : ""))
          .join("\n"),
      ).join("\n");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link
        href={fromId ? `/admin/campagne/${fromId}` : "/admin/campagne"}
        className="text-sm font-semibold text-[#075EAE] hover:underline"
      >
        {fromId ? "← Torna alla campagna" : "← Torna alle campagne"}
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {isForward ? "Inoltra campagna" : "Nuova campagna"}
      </h1>
      <p className="mt-2 text-slate-600">
        {isForward
          ? "Modifica oggetto, messaggio e destinatari, poi invia. Verrà creata una nuova campagna nello storico."
          : "Compila oggetto e messaggio, importa i destinatari e invia via Resend."}
      </p>

      <NewCampaignForm
        initialSubject={initialSubject}
        initialMessage={initialMessage}
        initialRecipients={initialRecipients}
        isForward={isForward}
      />
    </div>
  );
}
