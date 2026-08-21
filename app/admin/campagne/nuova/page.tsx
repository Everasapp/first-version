import Link from "next/link";

import NewCampaignForm from "@/src/components/admin/NewCampaignForm";
import { requireAdmin } from "@/src/lib/auth";
import {
  getCampaignTemplate,
  parseCampaignId,
  parseEmailList,
} from "@/src/lib/admin/email-campaigns";

export const dynamic = "force-dynamic";

type AdminNuovaCampagnaPageProps = {
  searchParams: Promise<{
    from?: string | string[];
    template?: string | string[];
  }>;
};

type NewsletterRecipientRow = {
  email: string | null;
  email_confirmed?: boolean | null;
};

export default async function AdminNuovaCampagnaPage({
  searchParams,
}: AdminNuovaCampagnaPageProps) {
  const { supabase } = await requireAdmin("/admin/campagne/nuova");
  const params = await searchParams;
  const fromId = parseCampaignId(params.from);
  const template = getCampaignTemplate(params.template);

  let initialSubject = "";
  let initialMessage = "";
  let initialRecipients = "";
  let isForward = false;
  let templateNote: string | null = null;

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
  } else if (template) {
    initialSubject = template.subject;
    initialMessage = template.message;

    const { data: newsletterRows, error: newsletterError } =
      await supabase.rpc("admin_newsletter_recipients");

    if (!newsletterError && newsletterRows) {
      const emails = parseEmailList(
        ((newsletterRows as NewsletterRecipientRow[]) || [])
          .filter((row) => row.email_confirmed !== false)
          .map((row) => row.email || "")
          .join("\n"),
      );
      initialRecipients = emails.join("\n");
      templateNote = `Template “nascita community” con ${emails.length} iscritti newsletter già caricati (utenti e organizzatori con opt-in). Rivedi il testo e conferma l’invio.`;
    } else {
      templateNote =
        "Template “nascita community” pronto. Usa “Carica iscritti newsletter” per i destinatari, poi conferma l’invio.";
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
        {isForward
          ? "Inoltra campagna"
          : template
            ? "Campagna community"
            : "Nuova campagna"}
      </h1>
      <p className="mt-2 text-slate-600">
        {isForward
          ? "Modifica oggetto, messaggio e destinatari, poi invia. Verrà creata una nuova campagna nello storico."
          : template
            ? "Messaggio e iscritti newsletter sono già compilati. Controlla tutto e invia solo quando sei pronta."
            : "Compila oggetto e messaggio, importa i destinatari e invia via Resend."}
      </p>

      {templateNote ? (
        <p className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          {templateNote}
        </p>
      ) : null}

      <NewCampaignForm
        initialSubject={initialSubject}
        initialMessage={initialMessage}
        initialRecipients={initialRecipients}
        isForward={isForward}
        templateId={template?.id}
        previewImageSrc={template?.hostedImagePath}
        previewImageAlt={template?.hostedImageAlt}
      />
    </div>
  );
}
