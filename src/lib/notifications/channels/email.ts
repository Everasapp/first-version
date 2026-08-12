import { Resend } from "resend";

import {
  ADMIN_NOTIFICATION_EMAIL,
  getEmailFromAddress,
} from "@/src/lib/notifications/config";
import { buildAdminNotificationEmail } from "@/src/lib/notifications/templates";
import type { AdminNotificationPayload } from "@/src/lib/notifications/types";

/**
 * Canale email (Resend). Aggiungere qui push/Telegram/WhatsApp in futuro.
 */
export async function deliverAdminEmail(payload: AdminNotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY non configurata");
  }

  const { subject, html } = buildAdminNotificationEmail(payload);
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: getEmailFromAddress(),
    to: [ADMIN_NOTIFICATION_EMAIL],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || "Invio email Resend fallito");
  }
}
