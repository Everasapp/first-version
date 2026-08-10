export type UserRole = "utente" | "organizzatore" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  municipality: string | null;
  province: string | null;
  business_name: string | null;
  vat_number: string | null;
  organizer_since: string | null;
  created_at: string;
  updated_at: string;
};

export const PROFILE_SELECT =
  "id, full_name, role, avatar_url, municipality, province, business_name, vat_number, organizer_since, created_at, updated_at";

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
