import { describe, expect, it, vi } from "vitest";
import { draftToEditable, emptyField, type ExtractedEventDraft } from "./event-import";
import { automaticImportAdmission, automaticImportReviewReasons, automaticImportStatus, hasValidImportDate, prepareAutomaticImportImage } from "./event-import-quality";

function completeDraft(): ExtractedEventDraft {
  return {
    title: emptyField("Concerto al Teatro Civico", "high"),
    description: emptyField("Il concerto propone un programma di musica da camera al Teatro Civico. Il pubblico può acquistare i biglietti presso il botteghino e scegliere tra i posti disponibili. L’esibizione comprende un recital per soprano e pianoforte, all’interno del festival cittadino, con accesso alla sala prima dell’inizio del programma.", "high"),
    startDate: emptyField("2026-10-16", "high"), startTime: emptyField("21:00", "high"),
    endDate: emptyField(), endTime: emptyField(),
    category: emptyField("musica-concerti", "medium"), subcategory: emptyField(),
    municipality: emptyField("Sassari", "high"), province: emptyField("SS", "high"),
    locationName: emptyField("Teatro Civico", "high"), address: emptyField("Corso Vittorio Emanuele", "high"),
    organizerName: emptyField(), organizerWebsite: emptyField(), organizerEmail: emptyField(), organizerPhone: emptyField(),
    imageUrl: emptyField("https://example.org/concert.jpg", "high"),
    isFree: emptyField(false, "medium"), priceFrom: emptyField("10,50", "medium"), ticketUrl: emptyField(),
    sourceUrl: "https://example.org/evento", sourceName: "Comune di Sassari",
  };
}

describe("automatic import editorial gate", () => {
  it("allows a complete reliable event and preserves manual pending mode", () => {
    const draft = completeDraft();
    const reasons = automaticImportReviewReasons(draftToEditable(draft), draft);
    expect(reasons).toEqual([]);
    expect(automaticImportStatus(true, reasons)).toBe("published");
    expect(automaticImportStatus(false, reasons)).toBe("pending");
  });

  it("does not infer free admission when the source has no price", () => {
    const draft = completeDraft(); draft.isFree = emptyField<boolean>(); draft.priceFrom = emptyField();
    const reasons = automaticImportReviewReasons(draftToEditable(draft), draft);
    expect(reasons).toContain("prezzo o gratuità da verificare");
    expect(automaticImportStatus(true, reasons)).toBe("draft");
    expect(automaticImportAdmission(draft)).toBeNull();
  });

  it("accepts explicit free admission without a numeric price", () => {
    const draft = completeDraft(); draft.isFree = emptyField(true, "medium"); draft.priceFrom = emptyField();
    expect(automaticImportReviewReasons(draftToEditable(draft), draft)).toEqual([]);
    expect(automaticImportAdmission(draft)).toBe(true);
  });

  it("rejects rollover dates instead of silently moving an event into another month", () => {
    expect(hasValidImportDate("2026-02-31")).toBe(false);
    expect(hasValidImportDate("2026-02-28")).toBe(true);
  });

  it("retains all review reasons for incomplete, uncertain imports", () => {
    const draft = completeDraft();
    draft.description = emptyField("Programma in aggiornamento…", "low");
    draft.imageUrl = emptyField("https://example.org/logo.png");
    draft.startDate.confidence = "low";
    draft.locationName.value = draft.sourceName;
    const reasons = automaticImportReviewReasons(draftToEditable(draft), draft);
    expect(reasons).toEqual(expect.arrayContaining(["descrizione incompleta", "descrizione da verificare", "data da verificare", "luogo da verificare", "immagine mancante o non utilizzabile"]));
    expect(automaticImportStatus(true, reasons)).toBe("draft");
  });

  it("catches long excerpts that remain truncated or contain crawler boilerplate", () => {
    const draft = completeDraft();
    draft.description.value = draft.description.value!.repeat(3) + "…";
    expect(automaticImportReviewReasons(draftToEditable(draft), draft)).toContain("descrizione incompleta");
    draft.description.value = draft.description.value!.replace(/…$/, " Questo indirizzo è protetto dagli spambots.");
    expect(automaticImportReviewReasons(draftToEditable(draft), draft)).toContain("descrizione con testo tecnico della fonte");
  });

  it("does not download or upload media for drafts", async () => {
    const upload = vi.fn();
    const result = await prepareAutomaticImportImage("", true, ["immagine mancante"], upload);
    expect(upload).not.toHaveBeenCalled();
    expect(result).toMatchObject({ status: "draft", imageUrl: null, imageUploaded: false });
  });

  it("keeps an otherwise complete event as a draft if the image upload fails", async () => {
    const result = await prepareAutomaticImportImage("https://example.org/concert.jpg", true, [], vi.fn().mockRejectedValue(new Error("Storage unavailable")));
    expect(result.status).toBe("draft");
    expect(result.reviewReasons).toContain("immagine non scaricabile: controllare prima di pubblicare");
    expect(result.imageUploaded).toBe(false);
  });

  it("publishes with the stored image only after a successful upload", async () => {
    const upload = vi.fn().mockResolvedValue("https://storage.example.org/concert.webp");
    const result = await prepareAutomaticImportImage("https://example.org/concert.jpg", true, [], upload);
    expect(result).toMatchObject({ status: "published", imageUrl: "https://storage.example.org/concert.webp", imageUploaded: true });
  });
});
