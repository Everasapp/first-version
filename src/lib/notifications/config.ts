export const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || "m.canalis@live.it";

export const ADMIN_NOTIFICATION_NAME = "Everas Admin";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.everas.it"
  );
}

export function getEmailFromAddress() {
  return (
    process.env.CONTACT_FROM_EMAIL ||
    process.env.NEWSLETTER_FROM_EMAIL ||
    "EVERAS <onboarding@resend.dev>"
  );
}
