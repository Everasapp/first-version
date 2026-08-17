export type SavedOrganizerOption = {
  id: string;
  name: string;
  label: string;
};

function websiteHost(website: string | null | undefined) {
  if (!website?.trim()) {
    return "";
  }

  try {
    const withProtocol = website.includes("://")
      ? website
      : `https://${website}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function mapSavedOrganizerOption(row: {
  id: string;
  name: string;
  website?: string | null;
  claim_status?: string | null;
}): SavedOrganizerOption {
  const host = websiteHost(row.website);
  const status =
    row.claim_status === "claimed" ? "rivendicato" : "non rivendicato";
  const parts = [row.name.trim() || "Organizzatore"];
  if (host) {
    parts.push(host);
  }
  if (row.claim_status) {
    parts.push(status);
  }

  return {
    id: row.id,
    name: row.name.trim() || "Organizzatore",
    label: parts.join(" · "),
  };
}

export function parseSavedOrganizerOptions(
  value: unknown,
): SavedOrganizerOption[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const mapped = value.flatMap((row) => {
    if (!row || typeof row !== "object") {
      return [];
    }

    const item = row as Record<string, unknown>;
    if (typeof item.id !== "string" || typeof item.name !== "string") {
      return [];
    }

    return [
      mapSavedOrganizerOption({
        id: item.id,
        name: item.name,
        website: typeof item.website === "string" ? item.website : null,
        claim_status:
          typeof item.claim_status === "string" ? item.claim_status : null,
      }),
    ];
  });

  return mapped.sort((a, b) => a.name.localeCompare(b.name, "it"));
}
