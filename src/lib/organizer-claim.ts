import { parseSignupEmail } from "@/src/lib/auth-urls";

export type OrganizerDirectoryPublic = {
  id: string;
  name: string;
  slug: string | null;
  claim_status: "unclaimed" | "claimed";
  claimed_by_profile_id: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  address: string | null;
  phone: string | null;
  public_description: string | null;
  public_page_enabled: boolean;
};

export type ClaimOrganizerResult = {
  directory_id: string;
  name: string;
  events_transferred: number;
  became_organizer: boolean;
};

export function isDirectoryUnclaimed(
  directory: OrganizerDirectoryPublic | null | undefined,
) {
  return Boolean(directory && !directory.claimed_by_profile_id);
}

export function parseOrganizerDirectoryPublic(
  value: unknown,
): OrganizerDirectoryPublic | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.name !== "string") {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    slug: typeof row.slug === "string" && row.slug.trim() ? row.slug : null,
    claim_status: row.claim_status === "claimed" ? "claimed" : "unclaimed",
    claimed_by_profile_id:
      typeof row.claimed_by_profile_id === "string"
        ? row.claimed_by_profile_id
        : null,
    website: typeof row.website === "string" ? row.website : null,
    facebook: typeof row.facebook === "string" ? row.facebook : null,
    instagram: typeof row.instagram === "string" ? row.instagram : null,
    address: typeof row.address === "string" ? row.address : null,
    phone: typeof row.phone === "string" ? row.phone : null,
    public_description:
      typeof row.public_description === "string"
        ? row.public_description
        : null,
    public_page_enabled: row.public_page_enabled === true,
  };
}

export async function getSuggestedClaimEmail(
  supabase: {
    rpc: (
      fn: string,
      args: { p_directory_id: string },
    ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
  },
  directoryId: string,
) {
  const { data, error } = await supabase.rpc("suggested_claim_email", {
    p_directory_id: directoryId,
  });

  if (error) {
    console.error("Impossibile caricare l'email organizzatore:", error.message);
    return null;
  }

  return parseSignupEmail(typeof data === "string" ? data : null) || null;
}
