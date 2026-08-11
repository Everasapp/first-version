export function splitEmailField(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[;,\s]+/)
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.includes("@") && !part.includes(" "));
}

/** Email utili per outreach: no PEC, no protocollo. */
export function isOutreachEmail(email: string) {
  const value = email.trim().toLowerCase();
  if (!value.includes("@")) return false;
  if (value.includes("pec")) return false;
  if (value.includes("protocollo")) return false;
  return true;
}

export function collectOrganizerEmails(
  rows: Array<{
    email?: string | null;
    pec?: string | null;
    email_cultura?: string | null;
    email_turismo?: string | null;
    email_eventi?: string | null;
  }>,
): string[] {
  const set = new Set<string>();

  for (const row of rows) {
    // Never include the dedicated PEC column.
    for (const email of splitEmailField(row.email)) {
      if (isOutreachEmail(email)) set.add(email);
    }
    for (const email of splitEmailField(row.email_cultura)) {
      if (isOutreachEmail(email)) set.add(email);
    }
    for (const email of splitEmailField(row.email_turismo)) {
      if (isOutreachEmail(email)) set.add(email);
    }
    for (const email of splitEmailField(row.email_eventi)) {
      if (isOutreachEmail(email)) set.add(email);
    }
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b, "it"));
}

export function chunkEmails(emails: string[], size = 30): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < emails.length; i += size) {
    chunks.push(emails.slice(i, i + size));
  }
  return chunks;
}
