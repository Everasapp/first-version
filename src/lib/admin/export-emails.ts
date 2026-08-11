export function splitEmailField(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[;,\s]+/)
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.includes("@") && !part.includes(" "));
}

export function collectOrganizerEmails(
  rows: Array<{
    email?: string | null;
    pec?: string | null;
    email_cultura?: string | null;
    email_turismo?: string | null;
    email_eventi?: string | null;
  }>,
  options?: { includePec?: boolean },
): string[] {
  const includePec = options?.includePec ?? false;
  const set = new Set<string>();

  for (const row of rows) {
    for (const email of splitEmailField(row.email)) set.add(email);
    for (const email of splitEmailField(row.email_cultura)) set.add(email);
    for (const email of splitEmailField(row.email_turismo)) set.add(email);
    for (const email of splitEmailField(row.email_eventi)) set.add(email);
    if (includePec) {
      for (const email of splitEmailField(row.pec)) set.add(email);
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
