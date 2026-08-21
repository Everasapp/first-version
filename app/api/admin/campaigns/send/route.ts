import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  buildCampaignHtml,
  CAMPAIGN_FROM_EMAIL,
  CAMPAIGN_MAX_ATTACHMENTS,
  CAMPAIGN_REPLY_TO,
  COMMUNITY_CAMPAIGN_IMAGE_PATH,
  COMMUNITY_CAMPAIGN_IMAGE_MARKER,
  getCampaignTemplate,
  isImageContentType,
  parseEmailList,
  resolveAttachmentContentType,
  sanitizeAttachmentFilename,
  sendCampaignEmailViaResend,
  sleep,
  validateCampaignAttachments,
  type CampaignAttachmentMeta,
  type CampaignAttachmentPayload,
} from "@/src/lib/admin/email-campaigns";
import { getSiteUrl } from "@/src/lib/notifications/config";

export const runtime = "nodejs";
export const maxDuration = 300;

async function fileToBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    contentBase64: buffer.toString("base64"),
    sizeBytes: buffer.byteLength,
  };
}

async function parseAttachmentsFromForm(formData: FormData) {
  const files = formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length > CAMPAIGN_MAX_ATTACHMENTS) {
    throw new Error(`Massimo ${CAMPAIGN_MAX_ATTACHMENTS} allegati`);
  }

  const preview = files.map((file) => {
    const filename = sanitizeAttachmentFilename(file.name || "allegato");
    const contentType = resolveAttachmentContentType(filename, file.type);
    return {
      filename,
      contentType,
      sizeBytes: file.size,
    };
  });

  const validationError = validateCampaignAttachments(preview);
  if (validationError) {
    throw new Error(validationError);
  }

  const attachments: CampaignAttachmentPayload[] = [];
  let imageIndex = 0;

  for (const file of files) {
    const filename = sanitizeAttachmentFilename(file.name || "allegato");
    const contentType = resolveAttachmentContentType(filename, file.type);
    const { contentBase64, sizeBytes } = await fileToBase64(file);
    const isImage = isImageContentType(contentType);

    attachments.push({
      filename,
      content_type: contentType,
      size_bytes: sizeBytes,
      contentBase64,
      contentId: isImage ? `campaign-img-${imageIndex++}` : undefined,
    });
  }

  return attachments;
}

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const contentType = request.headers.get("content-type") || "";
  let subject = "";
  let message = "";
  let rawEmails = "";
  let templateId = "";
  let attachments: CampaignAttachmentPayload[] = [];

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      subject = String(formData.get("subject") || "").trim();
      message = String(formData.get("message") || "").trim();
      rawEmails = String(formData.get("emails") || "");
      templateId = String(formData.get("template") || "").trim();
      attachments = await parseAttachmentsFromForm(formData);
    } else {
      const body = (await request.json()) as {
        subject?: string;
        message?: string;
        emails?: string[] | string;
        template?: string;
      };
      subject = body.subject?.trim() || "";
      message = body.message?.trim() || "";
      templateId = body.template?.trim() || "";
      rawEmails =
        typeof body.emails === "string"
          ? body.emails
          : Array.isArray(body.emails)
            ? body.emails.join("\n")
            : "";
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Body richiesta non valido",
      },
      { status: 400 },
    );
  }

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

  const inlineImages = attachments
    .filter((file) => file.contentId)
    .map((file) => ({
      contentId: file.contentId!,
      filename: file.filename,
    }));

  const template = getCampaignTemplate(templateId || undefined);
  const hostedImages =
    template?.hostedImagePath
      ? [
          {
            url: `${getSiteUrl()}${template.hostedImagePath}`,
            alt: template.hostedImageAlt || "Immagine campagna",
          },
        ]
      : message.includes(COMMUNITY_CAMPAIGN_IMAGE_MARKER)
        ? [
            {
              url: `${getSiteUrl()}${COMMUNITY_CAMPAIGN_IMAGE_PATH}`,
              alt: "Come funziona la community EVERAS: Ci vado, Chi ci sarà, Incontra",
            },
          ]
        : [];

  const bodyHtml = buildCampaignHtml(
    subject,
    message,
    inlineImages,
    hostedImages,
  );
  const fromEmail = CAMPAIGN_FROM_EMAIL;
  const replyTo = CAMPAIGN_REPLY_TO;
  const attachmentMeta: CampaignAttachmentMeta[] = attachments.map((file) => ({
    filename: file.filename,
    content_type: file.content_type,
    size_bytes: file.size_bytes,
  }));

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
      attachments: attachmentMeta,
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
        attachments,
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
