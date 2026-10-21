import {
  ADMIN_NOTIFICATION_EMAIL,
  getEmailFromAddress,
} from "@/src/lib/notifications/config";
import {
  REAL_EMAIL_DISABLED_MESSAGE,
  postResendEmail,
} from "@/src/lib/notifications/resend-delivery";
import { buildAdminNotificationEmail } from "@/src/lib/notifications/templates";
import type { AdminNotificationPayload } from "@/src/lib/notifications/types";

/**
 * Canale email (Resend). Aggiungere qui push/Telegram/WhatsApp in futuro.
 */
export async function deliverAdminEmail(payload: AdminNotificationPayload) {
  const { subject, html } = buildAdminNotificationEmail(payload);
  const result = await postResendEmail({
    from: getEmailFromAddress(),
    to: [ADMIN_NOTIFICATION_EMAIL],
    subject,
    html,
  });

  if (result.blocked) {
    throw new Error(REAL_EMAIL_DISABLED_MESSAGE);
  }
  if (!result.ok) {
    throw new Error(result.message || "Invio email Resend fallito");
  }
}
