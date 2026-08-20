export type UserRole = "utente" | "organizzatore" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  interests: string[];
  open_to_meeting: boolean;
  show_in_community: boolean;
  municipality: string | null;
  province: string | null;
  business_name: string | null;
  vat_number: string | null;
  organizer_since: string | null;
  plan_id: string | null;
  newsletter_opt_in: boolean;
  newsletter_city: string | null;
  newsletter_category: string | null;
  newsletter_opted_at: string | null;
  newsletter_last_sent_at: string | null;
  newsletter_unsub_token: string;
  created_at: string;
  updated_at: string;
};

export const PROFILE_SELECT =
  "id, full_name, display_name, role, avatar_url, interests, open_to_meeting, show_in_community, municipality, province, business_name, vat_number, organizer_since, plan_id, newsletter_opt_in, newsletter_city, newsletter_category, newsletter_opted_at, newsletter_last_sent_at, newsletter_unsub_token, created_at, updated_at";

export function isOrganizerRole(role: UserRole | null | undefined) {
  return role === "organizzatore" || role === "admin";
}

export function isOrganizer(profile: Pick<Profile, "role"> | null | undefined) {
  return isOrganizerRole(profile?.role);
}

export function normalizeVatNumber(value: string) {
  return value.replace(/\s+/g, "").trim();
}

export function isValidVatNumber(value: string) {
  const cleaned = normalizeVatNumber(value);
  return cleaned === "" || /^[0-9]{11}$/.test(cleaned);
}
