import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  buildCampaignHtml,
  CAMPAIGN_FROM_EMAIL,
  CAMPAIGN_REPLY_TO,
  parseEmailList,
  sendCampaignEmailViaResend,
  sleep,
} from "@/src/lib/admin/email-campaigns";

export const runtime = "nodejs";
export const maxDuration = 300;

type SendBody = {
  subject?: string;
  message?: string;
  emails?: string[] | string;
};

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let body: SendBody;
  try {
    body = (await request.json()) as SendBody;
  } catch {
    return NextResponse.json({ error: "Body JSON non valido" }, { status: 400 });
  }

  const subject = body.subject?.trim() || "";
  const message = body.message?.trim() || "";
  const rawEmails =
    typeof body.emails === "string"
      ? body.emails
      : Array.isArray(body.emails)
        ? body.emails.join("\n")
        : "";

  if (!subject) {
    return NextResponse.json({ error: "Oggetto obbligatorio" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json(
      { error: "Messaggio obbligatorio" },
      { status: 400 },
    );
  }

  const emails = parseEmailList(rawEmails);
  if (emails.length === 0) {
    return NextResponse.json(
      { error: "Inserisci almeno un indirizzo email valido" },
      { status: 400 },
    );
  }

  if (emails.length > 500) {
    return NextResponse.json(
      { error: "Massimo 500 destinatari per campagna" },
      { status: 400 },
    );
  }

  const bodyHtml = buildCampaignHtml(subject, message);
  const fromEmail = CAMPAIGN_FROM_EMAIL;
  const replyTo = CAMPAIGN_REPLY_TO;

  const { data: campaign, error: insertCampaignError } = await auth.supabase
    .from("email_campaigns")
    .insert({
      subject,
      body_text: message,
      body_html: bodyHtml,
      from_email: fromEmail,
      reply_to: replyTo,
      status: "sending",
      total_recipients: emails.length,
      sent_count: 0,
      failed_count: 0,
      created_by: auth.user.id,
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
      emails.map((email) => ({
        campaign_id: campaignId,
        email,
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

  const { data: recipients, error: loadRecipientsError } = await auth.supabase
    .from("email_campaign_recipients")
    .select("id, email")
    .eq("campaign_id", campaignId);

  if (loadRecipientsError || !recipients) {
    return NextResponse.json(
      {
        error: `Lettura destinatari fallita: ${
          loadRecipientsError?.message || "errore sconosciuto"
        }`,
      },
      { status: 500 },
    );
  }

  let sentCount = 0;
  let failedCount = 0;
  const errors: Array<{ email: string; error: string }> = [];

  for (const recipient of recipients) {
    const email = recipient.email as string;
    const recipientId = recipient.id as string;

    try {
      const result = await sendCampaignEmailViaResend({
        to: email,
        subject,
        html: bodyHtml,
        from: fromEmail,
        replyTo,
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
        .eq("id", recipientId);
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
        .eq("id", recipientId);
    }

    // Soft rate limit to stay under Resend burst limits
    await sleep(120);
  }

  const finalStatus =
    failedCount === 0
      ? "sent"
      : sentCount === 0
        ? "failed"
        : "partial";

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
    errors: errors.slice(0, 20),
  });
}
