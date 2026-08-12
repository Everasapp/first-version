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
