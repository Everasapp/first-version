export type Confidence = "high" | "medium" | "low";

export type ExtractedField<T = string> = {
  value: T | null;
  confidence: Confidence;
  source: string;
};

export type ExtractedEventDraft = {
  title: ExtractedField;
  description: ExtractedField;
  startDate: ExtractedField; // YYYY-MM-DD
  startTime: ExtractedField; // HH:mm
  endDate: ExtractedField;
  endTime: ExtractedField;
  category: ExtractedField;
  subcategory: ExtractedField;
  municipality: ExtractedField;
  province: ExtractedField;
  locationName: ExtractedField;
  address: ExtractedField;
  organizerName: ExtractedField;
  organizerWebsite: ExtractedField;
  organizerEmail: ExtractedField;
  organizerPhone: ExtractedField;
  imageUrl: ExtractedField;
  isFree: ExtractedField<boolean>;
  priceFrom: ExtractedField;
  ticketUrl: ExtractedField;
  sourceUrl: string;
  sourceName: string;
};

export type EditableEventImport = {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  category: string;
  subcategory: string;
  municipality: string;
  province: string;
  locationName: string;
  address: string;
  organizerName: string;
  organizerWebsite: string;
  organizerEmail: string;
  organizerPhone: string;
  imageUrl: string;
  downloadImage: boolean;
  isFree: boolean;
  priceFrom: string;
  ticketUrl: string;
  sourceUrl: string;
  sourceName: string;
  organizerDirectoryId: string | null;
  createOrganizerDirectory: boolean;
  forceImport: boolean;
  updateExistingId: string | null;
};

export type OrganizerMatch = {
  id: string;
  name: string;
  website: string | null;
  kind: "directory" | "profile";
};

export type DuplicateCandidate = {
  id: string;
  slug: string | null;
  title: string;
  start_at: string;
  municipality: string;
  source_url: string | null;
  organizer_display_name: string | null;
};

/** Evento trovato in una pagina elenco (es. sito comunale Design Italia). */
export type ListingEventCandidate = {
  title: string;
  url: string;
  startAt: string | null;
  endAt: string | null;
  description: string | null;
};

export type EventListingResult = {
  sourceUrl: string;
  sourceName: string;
  total: number;
  candidates: ListingEventCandidate[];
};

export function confidenceLabel(level: Confidence) {
  switch (level) {
    case "high":
      return "Alta";
    case "medium":
      return "Media";
    default:
      return "Bassa";
  }
}

export function emptyField<T = string>(
  value: T | null = null,
  confidence: Confidence = "low",
  source = "",
): ExtractedField<T> {
  return { value, confidence, source };
}

export function draftToEditable(draft: ExtractedEventDraft): EditableEventImport {
  return {
    title: draft.title.value?.trim() || "",
    description: draft.description.value?.trim() || "",
    startDate: draft.startDate.value || "",
    startTime: draft.startTime.value || "",
    endDate: draft.endDate.value || "",
    endTime: draft.endTime.value || "",
    category: draft.category.value || "",
    subcategory: draft.subcategory.value || "",
    municipality: draft.municipality.value || "",
    province: draft.province.value || "",
    locationName: draft.locationName.value || "",
    address: draft.address.value || "",
    organizerName: draft.organizerName.value || "",
    organizerWebsite: draft.organizerWebsite.value || "",
    organizerEmail: draft.organizerEmail.value || "",
    organizerPhone: draft.organizerPhone.value || "",
    imageUrl: draft.imageUrl.value || "",
    downloadImage: false,
    isFree: draft.isFree.value ?? true,
    priceFrom: draft.priceFrom.value || "",
    ticketUrl: draft.ticketUrl.value || "",
    sourceUrl: draft.sourceUrl,
    sourceName: draft.sourceName,
    organizerDirectoryId: null,
    createOrganizerDirectory: false,
    forceImport: false,
    updateExistingId: null,
  };
}

export function normalizeTitleKey(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Converte un ISO (es. da Solr) in data/ora wall-clock Europe/Rome. */
export function isoToRomeDateTime(iso: string | null | undefined): {
  date: string;
  time: string;
} | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(parsed);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const time = `${get("hour")}:${get("minute")}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return { date, time };
}

export function daysBetween(startDate: string, endDate: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return null;
  }
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.round((end - start) / 86_400_000);
}
