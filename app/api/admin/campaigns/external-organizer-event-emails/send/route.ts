import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  applyCampaignEventLink,
  buildCampaignHtml,
  CAMPAIGN_FROM_EMAIL,
  CAMPAIGN_REPLY_TO,
  getCampaignTemplate,
  sendCampaignEmailViaResend,
  sleep,
  type CampaignEventLink,
} from "@/src/lib/admin/email-campaigns";
import { listExternalOrganizerEventCampaignRecipients } from "@/src/lib/admin/organizer-event-campaign";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const template = getCampaignTemplate("rivendica-organizzatori");
  if (!template) {
    return NextResponse.json(
      { error: "Template rivendica-organizzatori non trovato" },
      { status: 500 },
    );
  }

  try {
    const { recipients, skipped } =
      await listExternalOrganizerEventCampaignRecipients(auth.supabase);

    if (recipients.length === 0) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        failed: 0,
        skipped,
        message: "Nessun destinatario da contattare.",
      });
    }

    const eventLinks = Object.fromEntries(
      recipients.map((row) => [
        row.email,
        {
          events: row.events.map((event) => ({
            url: event.url,
            title: event.title,
          })),
        } satisfies CampaignEventLink,
      ]),
    );

    const subject = template.subject;
    const message = template.message;
    const bodyHtml = buildCampaignHtml(subject, message);

    const { data: campaign, error: insertCampaignError } = await auth.supabase
      .from("email_campaigns")
      .insert({
        subject,
        body_text: message,
        body_html: bodyHtml,
        from_email: CAMPAIGN_FROM_EMAIL,
        reply_to: CAMPAIGN_REPLY_TO,
        status: "sending",
        total_recipients: recipients.length,
        sent_count: 0,
        failed_count: 0,
        created_by: auth.user.id,
        attachments: [],
      })
      .select("id")
      .single();

    if (insertCampaignError || !campaign) {
      return NextResponse.json(
        {
          error: `Creazione campagna fallita: ${
            insertCampaignError?.message || "errore sconosciuto"
          }`,
        },
        { status: 500 },
      );
    }

    const campaignId = campaign.id as string;

    const { error: insertRecipientsError } = await auth.supabase
      .from("email_campaign_recipients")
      .insert(
        recipients.map((row) => ({
          campaign_id: campaignId,
          email: row.email,
          status: "pending",
        })),
      );

    if (insertRecipientsError) {
      await auth.supabase
        .from("email_campaigns")
        .update({ status: "failed" })
        .eq("id", campaignId);

      return NextResponse.json(
        {
          error: `Salvataggio destinatari fallito: ${insertRecipientsError.message}`,
        },
        { status: 500 },
      );
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (const recipient of recipients) {
      const email = recipient.email;

      try {
        const html = buildCampaignHtml(
          subject,
          applyCampaignEventLink(message, eventLinks[email]!),
        );

        const result = await sendCampaignEmailViaResend({
          to: email,
          subject,
          html,
          from: CAMPAIGN_FROM_EMAIL,
          replyTo: CAMPAIGN_REPLY_TO,
        });

        sentCount += 1;
        await auth.supabase
          .from("email_campaign_recipients")
          .update({
            status: "sent",
            resend_id: result.id,
            sent_at: new Date().toISOString(),
            error: null,
          })
          .eq("campaign_id", campaignId)
          .eq("email", email);
      } catch (error) {
        failedCount += 1;
        const messageText =
          error instanceof Error ? error.message : "Invio fallito";
        errors.push({ email, error: messageText });
        await auth.supabase
          .from("email_campaign_recipients")
          .update({
            status: "failed",
            error: messageText,
          })
          .eq("campaign_id", campaignId)
          .eq("email", email);
      }

      await sleep(120);
    }

    const finalStatus =
      failedCount === 0 ? "sent" : sentCount === 0 ? "failed" : "partial";

    await auth.supabase
      .from("email_campaigns")
      .update({
        status: finalStatus,
        sent_count: sentCount,
        failed_count: failedCount,
        sent_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    return NextResponse.json({
      ok: true,
      campaignId,
      sent: sentCount,
      failed: failedCount,
      status: finalStatus,
      recipientCount: recipients.length,
      skipped,
      errors: errors.slice(0, 20),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invio campagna organizzatori esterni non riuscito",
      },
      { status: 500 },
    );
  }
}
