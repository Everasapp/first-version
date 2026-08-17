export type OrganizerDirectoryPublic = {
  id: string;
  name: string;
  claim_status: "unclaimed" | "claimed";
  claimed_by_profile_id: string | null;
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
    claim_status: row.claim_status === "claimed" ? "claimed" : "unclaimed",
    claimed_by_profile_id:
      typeof row.claimed_by_profile_id === "string"
        ? row.claimed_by_profile_id
        : null,
  };
}
