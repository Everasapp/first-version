import "server-only";

import { deliverAdminEmail } from "@/src/lib/notifications/channels/email";
import type { AdminNotificationPayload } from "@/src/lib/notifications/types";

/**
 * Punto unico per le notifiche admin.
 * Oggi: email Resend. Domani: altri canali senza cambiare i caller.
 */
export async function sendAdminNotification(
  payload: AdminNotificationPayload,
): Promise<void> {
  try {
    await deliverAdminEmail(payload);
    // Futuro: await deliverAdminPush(payload); await deliverTelegram(payload);
  } catch (error) {
    console.error("[notifications] Invio notifica admin fallito:", {
      type: payload.type,
      title: payload.title,
      error,
    });
  }
}
