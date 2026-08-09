/** Parse a price typed by Italian users (comma decimals, €, spaces). */
export function parsePrice(value: string): number | null {
  const trimmed = value.trim().replace(/\s/g, "").replace(/€/g, "");

  if (!trimmed) {
    return null;
  }

  let normalized = trimmed;

  if (trimmed.includes(",") && trimmed.includes(".")) {
    // European thousands + decimal: 1.500,50
    normalized = trimmed.replace(/\./g, "").replace(",", ".");
  } else if (trimmed.includes(",")) {
    // Decimal comma: 15,50
    normalized = trimmed.replace(",", ".");
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const amount = Number(normalized);

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

/** Add https:// when users paste a domain without a protocol. */
export function normalizeTicketUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^\/\//.test(trimmed)) {
    return `https:${trimmed}`;
  }

  return `https://${trimmed}`;
}

export function isValidTicketUrl(value: string): boolean {
  try {
    const url = new URL(normalizeTicketUrl(value));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
