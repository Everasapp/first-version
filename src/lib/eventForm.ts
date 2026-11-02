/** Parse a price typed by Italian users (comma decimals, €, spaces). */
export function parsePrice(value: string): number | null {
  const trimmed = value
    .trim()
    .replace(/[\s\u00a0\u202f]/g, "")
    .replace(/€/g, "")
    .replace(/，/g, ",");

  if (!trimmed) {
    return null;
  }

  let normalized = trimmed;
  const lastComma = trimmed.lastIndexOf(",");
  const lastDot = trimmed.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      normalized = trimmed.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = trimmed.replace(/,/g, "");
    }
  } else if (lastComma >= 0) {
    normalized = trimmed.replace(",", ".");
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

/** Municipality stored for courses that have no physical venue in Sardinia. */
export const ONLINE_MUNICIPALITY = "Online";

export type AttendanceMode = "online" | "in_person";

/** Recognizes an existing online card from the municipality field, not from the title. */
export function isOnlineMunicipality(value: string | null | undefined) {
  return value?.trim() === ONLINE_MUNICIPALITY;
}

export function attendanceModeForMunicipality(
  value: string | null | undefined,
): AttendanceMode {
  return isOnlineMunicipality(value) ? "online" : "in_person";
}

export function placeValidationErrors(input: {
  attendance: AttendanceMode;
  area: string;
  city: string;
  venue: string;
}) {
  if (input.attendance === "online") {
    return {} as { area?: string; city?: string; venue?: string };
  }

  const errors: { area?: string; city?: string; venue?: string } = {};
  if (!input.area) errors.area = "Seleziona un'area.";
  if (!input.city || isOnlineMunicipality(input.city)) {
    errors.city = "Seleziona una città.";
  }
  if (!input.venue.trim()) errors.venue = "Inserisci il luogo o l'indirizzo.";
  return errors;
}

export function placeFieldsForSave(input: {
  attendance: AttendanceMode;
  city: string;
  venue: string;
  provinceForCity: string | null;
  storedProvince: string | null;
  storedOnline: boolean;
}) {
  const description = input.venue.trim();
  if (input.attendance === "online") {
    return {
      municipality: ONLINE_MUNICIPALITY,
      province: input.storedOnline ? (input.storedProvince ?? "") : "",
      location_name: description,
      address: description,
    };
  }

  return {
    municipality: input.city,
    province: input.provinceForCity,
    location_name: description,
    address: description,
  };
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
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}
