import type { EditableEventImport, ExtractedEventDraft } from "@/src/lib/admin/event-import";
import { stripHtml } from "@/src/lib/sanitizeHtml";

export type AutomaticImportStatus = "published" | "pending" | "draft";

export function hasValidImportDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function automaticImportAdmission(draft: ExtractedEventDraft): boolean | null {
  if (draft.isFree.value !== null) return draft.isFree.value;
  const price = Number.parseFloat((draft.priceFrom.value ?? "").replace(",", "."));
  return Number.isFinite(price) && price > 0 ? false : null;
}

export function hasUsableImportImage(imageUrl: string) {
  const url = imageUrl.trim();
  return /^https?:\/\//i.test(url)
    && !/\.(svg|ico)(\?|$)/i.test(url)
    && !/logo|placeholder|sprite|default[-_]?img/i.test(url);
}

/** Editorial triage, not a search-engine word-count requirement. */
export function automaticImportReviewReasons(editable: EditableEventImport, draft: ExtractedEventDraft) {
  const reasons: string[] = [];
  const text = stripHtml(editable.description).trim();
  if (text.length < 280 || /(?:\.\.\.|…)\s*$/.test(text)) reasons.push("descrizione incompleta");
  if (/abilitare javascript|protetto dagli spambots|accetta (?:tutti )?i cookie/i.test(text)) reasons.push("descrizione con testo tecnico della fonte");
  if (!hasUsableImportImage(editable.imageUrl)) reasons.push("immagine mancante o non utilizzabile");
  for (const [key, label] of [["title", "titolo"], ["description", "descrizione"], ["startDate", "data"], ["municipality", "comune"], ["category", "categoria"], ["imageUrl", "immagine"]] as const) {
    if (draft[key].confidence === "low") reasons.push(`${label} da verificare`);
  }
  if (!editable.startTime.trim()) reasons.push("orario da verificare");
  const place = editable.locationName.trim();
  if (!place || place.toLowerCase() === editable.sourceName.trim().toLowerCase()) reasons.push("luogo da verificare");
  if (!editable.category.trim()) reasons.push("categoria da verificare");
  // draftToEditable defaults missing prices to free: never auto-publish that guess.
  const price = Number.parseFloat((draft.priceFrom.value ?? "").replace(",", "."));
  if (draft.isFree.value !== true && !(Number.isFinite(price) && price > 0)) reasons.push("prezzo o gratuità da verificare");
  return reasons;
}

export function automaticImportStatus(publish: boolean, reviewReasons: readonly string[]): AutomaticImportStatus {
  return reviewReasons.length > 0 ? "draft" : publish ? "published" : "pending";
}

/** Drafts keep the source image URL; only publication uploads a copy to Storage. */
export async function prepareAutomaticImportImage(
  imageUrl: string,
  publish: boolean,
  reviewReasons: string[],
  upload: (url: string) => Promise<string>,
) {
  const reasons = [...reviewReasons];
  let storedImageUrl = hasUsableImportImage(imageUrl) ? imageUrl.trim() : null;
  let imageUploaded = false;
  if (automaticImportStatus(publish, reasons) === "published" && storedImageUrl) {
    try {
      storedImageUrl = await upload(storedImageUrl);
      imageUploaded = true;
    } catch {
      reasons.push("immagine non scaricabile: controllare prima di pubblicare");
    }
  }
  return { imageUrl: storedImageUrl, imageUploaded, reviewReasons: reasons, status: automaticImportStatus(publish, reasons) };
}
