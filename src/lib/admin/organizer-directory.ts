export type OrganizerClaimStatus = "unclaimed" | "claimed";

export type ContactFieldKey =
  | "email"
  | "pec"
  | "email_cultura"
  | "email_turismo"
  | "email_eventi"
  | "phone"
  | "address"
  | "facebook"
  | "instagram"
  | "page_contatti"
  | "page_cultura"
  | "page_turismo"
  | "page_eventi"
  | "page_amministrazione";

export type ContactFieldSource = {
  value: string;
  sourceUrl: string;
};

export type OrganizerDirectorySources = Partial<
  Record<ContactFieldKey, ContactFieldSource | ContactFieldSource[]>
>;

export type OrganizerDirectoryRow = {
  id: string;
  name: string;
  website: string | null;
  email: string | null;
  pec: string | null;
  phone: string | null;
  address: string | null;
  facebook: string | null;
  instagram: string | null;
  email_cultura: string | null;
  email_turismo: string | null;
  email_eventi: string | null;
  claim_status: OrganizerClaimStatus;
  claimed_by_profile_id: string | null;
  sources: OrganizerDirectorySources;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EmailCategory =
  | "pec"
  | "cultura"
  | "turismo"
  | "eventi"
  | "generale";

export type FoundContactItem = {
  id: string;
  field: ContactFieldKey | "email_generale";
  label: string;
  value: string;
  sourceUrl: string;
  selected: boolean;
  verified: boolean;
};

export const CONTACT_FIELD_LABELS: Record<
  ContactFieldKey | "email_generale",
  string
> = {
  email: "Email generale",
  email_generale: "Email generale",
  pec: "PEC",
  email_cultura: "Email Cultura",
  email_turismo: "Email Turismo",
  email_eventi: "Email Eventi",
  phone: "Telefono",
  address: "Indirizzo",
  facebook: "Facebook",
  instagram: "Instagram",
  page_contatti: "Pagina Contatti",
  page_cultura: "Pagina Cultura",
  page_turismo: "Pagina Turismo",
  page_eventi: "Pagina Eventi",
  page_amministrazione: "Pagina Amministrazione/Uffici",
};

export function classifyEmail(email: string): EmailCategory {
  const local = email.toLowerCase();
  if (local.includes("pec") || local.includes("@pec.")) return "pec";
  if (/cultura|culturale/.test(local)) return "cultura";
  if (/turismo|tourist|tourism/.test(local)) return "turismo";
  if (/eventi|spettacolo|manifestazion/.test(local)) return "eventi";
  return "generale";
}

export function emailCategoryToField(
  category: EmailCategory,
): ContactFieldKey | "email_generale" {
  switch (category) {
    case "pec":
      return "pec";
    case "cultura":
      return "email_cultura";
    case "turismo":
      return "email_turismo";
    case "eventi":
      return "email_eventi";
    default:
      return "email_generale";
  }
}
