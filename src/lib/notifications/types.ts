export type AdminNotificationType =
  | "user_registered"
  | "organizer_registered"
  | "event_published";

export type AdminNotificationPayload = {
  type: AdminNotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
};

export type EmailContent = {
  subject: string;
  html: string;
};
