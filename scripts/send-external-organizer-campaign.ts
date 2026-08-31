import { createAdminClient } from "../src/lib/supabase/admin";
import { listExternalOrganizerEventCampaignRecipients } from "../src/lib/admin/organizer-event-campaign";
import {
  applyCampaignEventLink,
  buildCampaignHtml,
  CAMPAIGN_FROM_EMAIL,
  CAMPAIGN_REPLY_TO,
  getCampaignTemplate,
  sendCampaignEmailViaResend,
  sleep,
  type CampaignEventLink,
} from "../src/lib/admin/email-campaigns";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const supabase = createAdminClient();
  const template = getCampaignTemplate("rivendica-organizzatori");

  if (!template) {
    throw new Error("Template rivendica-organizzatori non trovato");
  }

  const { recipients, skipped } =
    await listExternalOrganizerEventCampaignRecipients(supabase);

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

  console.log(
    JSON.stringify(
      {
        dryRun,
        recipientCount: recipients.length,
        skippedCount: skipped.length,
        recipients: recipients.map((row) => ({
          name: row.name,
          email: row.email,
          eventCount: row.events.length,
          events: row.events.map((event) => event.title),
        })),
        skipped: skipped.slice(0, 20),
      },
      null,
      2,
    ),
  );

  if (dryRun || recipients.length === 0) {
    return;
  }

  const subject = template.subject;
  const message = template.message;
  const bodyHtml = buildCampaignHtml(subject, message);

  const { data: campaign, error: insertCampaignError } = await supabase
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
      created_by: null,
      attachments: [],
    })
    .select("id")
    .single();

  if (insertCampaignError || !campaign) {
    throw new Error(
      insertCampaignError?.message || "Creazione campagna fallita",
    );
  }

  const campaignId = campaign.id as string;

  const { error: insertRecipientsError } = await supabase
    .from("email_campaign_recipients")
    .insert(
      recipients.map((row) => ({
        campaign_id: campaignId,
        email: row.email,
        status: "pending",
      })),
    );

  if (insertRecipientsError) {
    throw new Error(
      `Salvataggio destinatari fallito: ${insertRecipientsError.message}`,
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
      await supabase
        .from("email_campaign_recipients")
        .update({
          status: "sent",
          resend_id: result.id,
          sent_at: new Date().toISOString(),
          error: null,
        })
        .eq("campaign_id", campaignId)
        .eq("email", email);

      console.log(`✓ ${email} (${recipient.events.length} eventi)`);
    } catch (error) {
      failedCount += 1;
      const messageText =
        error instanceof Error ? error.message : "Invio fallito";
      errors.push({ email, error: messageText });
      await supabase
        .from("email_campaign_recipients")
        .update({
          status: "failed",
          error: messageText,
        })
        .eq("campaign_id", campaignId)
        .eq("email", email);

      console.error(`✗ ${email}: ${messageText}`);
    }

    await sleep(120);
  }

  const finalStatus =
    failedCount === 0 ? "sent" : sentCount === 0 ? "failed" : "partial";

  await supabase
    .from("email_campaigns")
    .update({
      status: finalStatus,
      sent_count: sentCount,
      failed_count: failedCount,
      sent_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  console.log(
    JSON.stringify(
      {
        campaignId,
        sent: sentCount,
        failed: failedCount,
        status: finalStatus,
        errors,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
