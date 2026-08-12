import type { AdminNotificationType } from "@/src/lib/notifications/types";

/** Fire-and-forget verso l'API server-side (non blocca UX). */
export function requestAdminNotification(input: {
  type: AdminNotificationType;
  userId?: string;
  eventId?: string;
}) {
  void fetch("/api/notifications/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch((error) => {
    console.error("[notifications] requestAdminNotification failed:", error);
  });
}
