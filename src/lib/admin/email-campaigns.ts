import { getSiteUrl } from "@/src/lib/notifications/config";
import { escapeHtml } from "@/src/lib/notifications/format";

// Resend ha verificato mail.everas.it (non everas.it).
// Le risposte restano su info@everas.it (inoltro Outlook).
export const CAMPAIGN_FROM_EMAIL =
  process.env.CAMPAIGN_FROM_EMAIL?.trim() ||
  process.env.NEWSLETTER_FROM_EMAIL?.trim() ||
  "EVERAS <info@mail.everas.it>";

export const CAMPAIGN_REPLY_TO =
  process.env.CAMPAIGN_REPLY_TO?.trim() || "info@everas.it";

export const CAMPAIGN_MAX_ATTACHMENTS = 5;
export const CAMPAIGN_MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5 MB ciascuno
export const CAMPAIGN_MAX_TOTAL_ATTACHMENT_BYTES = 20 * 1024 * 1024; // 20 MB totali

const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const ALLOWED_ATTACHMENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
]);

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain",
  csv: "text/csv",
};

export type CampaignAttachmentMeta = {
  filename: string;
  content_type: string;
  size_bytes: number;
};

export type CampaignAttachmentPayload = CampaignAttachmentMeta & {
  contentBase64: string;
  /** Per immagini: content-id usato nel body HTML. */
  contentId?: string;
};

export function parseEmailList(raw: string): string[] {
  const parts = raw
    .split(/[\n,;]+/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  const unique = new Set<string>();
  for (const part of parts) {
    if (EMAIL_RE.test(part)) {
      unique.add(part);
    }
  }

  return Array.from(unique).sort((a, b) => a.localeCompare(b, "it"));
}

export function isValidCampaignEmail(email: string) {
  return EMAIL_RE.test(email.trim().toLowerCase());
}

export function parseCampaignId(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (
    !raw ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      raw,
    )
  ) {
    return null;
  }
  return raw;
}

export type CampaignTemplateId =
  | "community"
  | "rivendica-comuni"
  | "rivendica-organizzatori";

const RIVENDICA_SUBJECT =
  "Il vostro evento è già su EVERAS – rivendicate il vostro profilo gratuitamente";

function rivendicaIntro() {
  return `Buongiorno,

sono Marina Canalis, fondatrice di EVERAS, una nuova piattaforma dedicata agli eventi in Sardegna, nata con un obiettivo semplice: rendere più facile scoprire ciò che accade sul territorio e dare maggiore visibilità agli eventi locali.

L'idea nasce da un problema che probabilmente conoscete bene: in Sardegna vengono organizzati ogni giorno concerti, sagre, feste, mostre, manifestazioni culturali e sportive, ma le informazioni sono spesso distribuite tra siti istituzionali, social, locandine e pagine dei singoli organizzatori.

EVERAS vuole raccoglierle in un unico spazio, facilmente consultabile da cittadini e visitatori.

La piattaforma è online da poche settimane e sta iniziando a farsi conoscere, superando già 8.780 visualizzazioni.

Ho trovato particolarmente interessante il vostro evento e ho deciso di inserirlo personalmente su EVERAS per contribuire a dargli maggiore visibilità:

${EVENT_LINK_PLACEHOLDER}`;
}

function rivendicaOutro(audienceLine: string, pageLine: string) {
  return `Se lo desiderate, potete rivendicare gratuitamente il vostro profilo Organizzatore e gestire direttamente la vostra presenza sulla piattaforma.

Potrete così:
• modificare o integrare le informazioni degli eventi già presenti;
• pubblicare gratuitamente i vostri prossimi eventi;
• ${pageLine}
• utilizzare EVERAS come ulteriore canale per raggiungere persone interessate agli eventi e alle iniziative del territorio.

La pubblicazione degli eventi è gratuita.

Il mio obiettivo è far crescere EVERAS insieme ${audienceLine}, creando nel tempo un punto di riferimento unico per chi vuole sapere cosa fare e cosa succede sull'isola.

Se avete domande o desiderate aiuto per rivendicare il profilo, potete semplicemente rispondere a questa email: sarò felice di seguirvi personalmente.

Grazie per il vostro lavoro di valorizzazione del territorio e spero di avervi presto tra gli organizzatori di EVERAS.

Un caro saluto,

Marina Canalis
Fondatrice di EVERAS
everas.it`;
}

export const COMMUNITY_CAMPAIGN_IMAGE_MARKER = "{{COMMUNITY_IMAGE}}";
export const COMMUNITY_CAMPAIGN_IMAGE_PATH =
  "/images/community/community-how-it-works.webp";

export const EVENT_LINK_MARKER = "{{EVENT_LINK}}";
export const EVENT_LINK_PLACEHOLDER = '👉 "LINK EVENTO"';

export type CampaignEventLink = {
  url: string;
  title?: string;
};

export function hasCampaignEventLinkPlaceholder(message: string) {
  return (
    message.includes(EVENT_LINK_MARKER) ||
    message.includes("LINK EVENTO")
  );
}

export function formatCampaignEventLink(link: CampaignEventLink) {
  const title = link.title?.trim();
  return title ? `${title}\n${link.url}` : link.url;
}

export function applyCampaignEventLink(
  message: string,
  link: CampaignEventLink,
) {
  const block = formatCampaignEventLink(link);
  return message
    .replaceAll(EVENT_LINK_PLACEHOLDER, `👉 ${block}`)
    .replaceAll(EVENT_LINK_MARKER, block)
    .replaceAll('👉 "LINK EVENTO"', `👉 ${block}`)
    .replaceAll('👉 “LINK EVENTO”', `👉 ${block}`)
    .replaceAll('"LINK EVENTO"', block)
    .replaceAll("“LINK EVENTO”", block)
    .replaceAll("LINK EVENTO", block);
}

export function parseCampaignEventLinks(raw: unknown): Record<
  string,
  CampaignEventLink
> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const links: Record<string, CampaignEventLink> = {};
  for (const [email, value] of Object.entries(
    raw as Record<string, unknown>,
  )) {
    const key = email.trim().toLowerCase();
    if (!key || !isValidCampaignEmail(key)) continue;

    if (typeof value === "string") {
      const url = value.trim();
      if (isSafeHttpUrl(url)) links[key] = { url };
      continue;
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const record = value as { url?: unknown; title?: unknown };
    const url = typeof record.url === "string" ? record.url.trim() : "";
    if (!isSafeHttpUrl(url)) continue;
    const title =
      typeof record.title === "string" ? record.title.trim() : undefined;
    links[key] = title ? { url, title } : { url };
  }

  return links;
}

export function getCampaignTemplate(
  id: string | string[] | undefined,
): {
  id: CampaignTemplateId;
  subject: string;
  message: string;
  hostedImagePath?: string;
  hostedImageAlt?: string;
} | null {
  const raw = Array.isArray(id) ? id[0] : id;

  if (raw === "rivendica-comuni") {
    return {
      id: "rivendica-comuni",
      subject: RIVENDICA_SUBJECT,
      message: `${rivendicaIntro()}

${rivendicaOutro(
  "ai Comuni, alle Pro Loco, alle associazioni e alle tante realtà che animano la Sardegna",
  "creare una pagina dedicata al Comune o alla Pro Loco con tutti gli appuntamenti organizzati",
)}`,
    };
  }

  if (raw === "rivendica-organizzatori") {
    return {
      id: "rivendica-organizzatori",
      subject: RIVENDICA_SUBJECT,
      message: `${rivendicaIntro()}

${rivendicaOutro(
  "a Comuni, Pro Loco, associazioni culturali, festival e organizzatori che animano la Sardegna",
  "creare una pagina dedicata alla vostra organizzazione con tutti gli appuntamenti",
)}`,
    };
  }

  if (raw !== "community") return null;

  return {
    id: "community",
    subject: "Su EVERAS nasce la community",
    hostedImagePath: COMMUNITY_CAMPAIGN_IMAGE_PATH,
    hostedImageAlt: "Come funziona la community EVERAS: Ci vado, Chi ci sarà, Incontra",
    message: `Ciao,

su EVERAS è nata la community: uno spazio semplice, intorno agli eventi, per far sapere se ci sarai e incontrare persone con cui condividere la serata.

${COMMUNITY_CAMPAIGN_IMAGE_MARKER}

Come funziona
• Apri un evento e tocca Ci vado
• Nella sezione Chi ci sarà vedi chi ha già scelto di partecipare
• Se vuoi, puoi indicare se sei aperto/a a conoscere persone nuove, se vai da solo/a o se vieni con amici

Non è una chat di incontri: è partecipazione reale agli eventi, sempre con rispetto.

Per iniziare, configura come compari nella community:
https://www.everas.it/dashboard/comunita

Oppure esplora gli eventi e marca quelli a cui andrai:
https://www.everas.it/eventi

Se hai dubbi o idee, rispondi pure a questa email: le leggo io.

A presto,
Marina
EVERAS

—
Ricevi questa email perché hai scelto di restare aggiornato/a su EVERAS.
Preferenze e disiscrizione: https://www.everas.it/dashboard/newsletter`,
  };
}

export function isImageContentType(contentType: string) {
  return contentType.startsWith("image/");
}

export function resolveAttachmentContentType(
  filename: string,
  declaredType?: string | null,
) {
  const declared = declaredType?.trim().toLowerCase() || "";
  if (declared && declared !== "application/octet-stream") {
    return declared;
  }
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return EXT_TO_MIME[ext] || declared || "application/octet-stream";
}

export function sanitizeAttachmentFilename(name: string) {
  const cleaned = name
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, 180) || "allegato";
}

export function validateCampaignAttachments(
  files: Array<{
    filename: string;
    contentType: string;
    sizeBytes: number;
  }>,
) {
  if (files.length > CAMPAIGN_MAX_ATTACHMENTS) {
    return `Massimo ${CAMPAIGN_MAX_ATTACHMENTS} allegati per campagna`;
  }

  let total = 0;
  for (const file of files) {
    if (file.sizeBytes <= 0) {
      return `Allegato vuoto: ${file.filename}`;
    }
    if (file.sizeBytes > CAMPAIGN_MAX_ATTACHMENT_BYTES) {
      return `«${file.filename}» supera i 5 MB`;
    }
    total += file.sizeBytes;
    const type = resolveAttachmentContentType(file.filename, file.contentType);
    if (!ALLOWED_ATTACHMENT_TYPES.has(type)) {
      return `Tipo non supportato per «${file.filename}» (${type}). Usa immagini, PDF, Word, Excel o testo.`;
    }
  }

  if (total > CAMPAIGN_MAX_TOTAL_ATTACHMENT_BYTES) {
    return "Gli allegati superano i 20 MB totali";
  }

  return null;
}

const CAMPAIGN_LINK_STYLE =
  "color:#075EAE;text-decoration:underline;word-break:break-word;";

const CAMPAIGN_TOKEN_RE =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)/gi;

function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function splitTrailingPunctuation(value: string) {
  const match = /[),.!?:;]+$/.exec(value);
  if (!match) {
    return { token: value, trailing: "" };
  }
  return {
    token: value.slice(0, -match[0].length),
    trailing: match[0],
  };
}

function campaignAnchor(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="${CAMPAIGN_LINK_STYLE}">${escapeHtml(label)}</a>`;
}

function linkifyCampaignToken(token: string) {
  const lower = token.toLowerCase();
  if (lower.startsWith("https://") || lower.startsWith("http://")) {
    return isSafeHttpUrl(token) ? campaignAnchor(token, token) : escapeHtml(token);
  }
  if (lower.startsWith("www.")) {
    const href = `https://${token}`;
    return isSafeHttpUrl(href) ? campaignAnchor(href, token) : escapeHtml(token);
  }
  if (EMAIL_RE.test(token)) {
    return campaignAnchor(`mailto:${token}`, token);
  }
  return escapeHtml(token);
}

export function linkifyCampaignMessage(message: string) {
  let html = "";
  let lastIndex = 0;

  for (const match of message.matchAll(CAMPAIGN_TOKEN_RE)) {
    const raw = match[0];
    const index = match.index ?? 0;
    html += escapeHtml(message.slice(lastIndex, index)).replaceAll("\n", "<br />");

    const { token, trailing } = splitTrailingPunctuation(raw);
    html +=
      (token ? linkifyCampaignToken(token) : "") + escapeHtml(trailing);
    lastIndex = index + raw.length;
  }

  html += escapeHtml(message.slice(lastIndex)).replaceAll("\n", "<br />");
  return html;
}

export function buildCampaignHtml(
  subject: string,
  message: string,
  inlineImages: Array<{ contentId: string; filename: string }> = [],
  hostedImages: Array<{ url: string; alt: string }> = [],
) {
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/images/everas-logo-v2.png`;

  const hostedBlock = (image: { url: string; alt: string }) =>
    `<div style="margin:20px 0;"><img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" width="504" style="display:block;width:100%;max-width:504px;height:auto;border-radius:16px;border:1px solid #e2e8f0;" /></div>`;

  let bodyHtml: string;
  if (
    message.includes(COMMUNITY_CAMPAIGN_IMAGE_MARKER) &&
    hostedImages.length > 0
  ) {
    const [before = "", after = ""] = message.split(
      COMMUNITY_CAMPAIGN_IMAGE_MARKER,
    );
    bodyHtml =
      linkifyCampaignMessage(before.trimEnd()) +
      hostedImages.map(hostedBlock).join("") +
      linkifyCampaignMessage(after.trimStart());
  } else {
    bodyHtml =
      linkifyCampaignMessage(message) +
      (hostedImages.length > 0
        ? hostedImages.map(hostedBlock).join("")
        : "");
  }

  const imagesHtml =
    inlineImages.length > 0
      ? `<div style="margin-top:20px;">${inlineImages
          .map(
            (image) =>
              `<img src="cid:${escapeHtml(image.contentId)}" alt="${escapeHtml(image.filename)}" style="display:block;width:100%;max-width:504px;height:auto;border-radius:12px;margin:0 0 12px;" />`,
          )
          .join("")}</div>`
      : "";

  return `<!DOCTYPE html>
<html lang="it">
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
            <tr>
              <td align="center" style="padding:0 0 18px;">
                <img src="${logoUrl}" alt="EVERAS" width="140" style="display:block;height:auto;max-width:140px;" />
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;padding:28px;">
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0f172a;font-weight:800;">
                  ${escapeHtml(subject)}
                </h1>
                <div style="color:#334155;font-size:15px;line-height:1.65;">
                  ${bodyHtml}
                </div>
                ${imagesHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 8px 0;text-align:center;color:#94a3b8;font-size:12px;line-height:1.5;">
                EVERAS · Eventi in Sardegna<br />
                <a href="${escapeHtml(siteUrl)}" style="color:#075EAE;text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a>
                · <a href="mailto:info@everas.it" style="color:#075EAE;text-decoration:none;">info@everas.it</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendCampaignEmailViaResend({
  to,
  subject,
  html,
  from,
  replyTo,
  attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
  from: string;
  replyTo: string;
  attachments?: CampaignAttachmentPayload[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY non configurata");
  }

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    reply_to: replyTo,
    subject,
    html,
  };

  if (attachments.length > 0) {
    payload.attachments = attachments.map((file) => {
      const item: Record<string, string> = {
        filename: file.filename,
        content: file.contentBase64,
        content_type: file.content_type,
      };
      if (file.contentId) {
        item.content_id = file.contentId;
      }
      return item;
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    error?: { message?: string };
  };

  if (!response.ok) {
    const message =
      body.error?.message ||
      body.message ||
      `Resend error ${response.status}`;
    throw new Error(message);
  }

  return { id: body.id ?? null };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type EmailCampaignRow = {
  id: string;
  subject: string;
  body_text: string;
  body_html: string;
  from_email: string;
  reply_to: string;
  status: "draft" | "sending" | "sent" | "partial" | "failed";
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
  attachments?: CampaignAttachmentMeta[] | null;
};

export type EmailCampaignRecipientRow = {
  id: string;
  campaign_id: string;
  email: string;
  status: "pending" | "sent" | "failed";
  error: string | null;
  resend_id: string | null;
  sent_at: string | null;
  created_at: string;
};

export function campaignStatusLabel(status: EmailCampaignRow["status"]) {
  switch (status) {
    case "draft":
      return "Bozza";
    case "sending":
      return "Invio in corso";
    case "sent":
      return "Inviata";
    case "partial":
      return "Parziale";
    case "failed":
      return "Fallita";
    default:
      return status;
  }
}
