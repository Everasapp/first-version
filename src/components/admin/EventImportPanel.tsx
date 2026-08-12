"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import {
  confidenceLabel,
  isoToRomeDateTime,
  type Confidence,
  type DuplicateCandidate,
  type EditableEventImport,
  type EventListingResult,
  type ExtractedEventDraft,
  type ListingEventCandidate,
  type OrganizerMatch,
} from "@/src/lib/admin/event-import";

type AnalyzeResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  draft?: ExtractedEventDraft;
  editable?: EditableEventImport;
  listing?: EventListingResult;
  organizerMatches?: OrganizerMatch[];
  duplicates?: DuplicateCandidate[];
  imageRightsNote?: string;
};

type ImportResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  event?: { id: string; slug: string | null };
  duplicate?: { id: string; slug: string | null; title: string };
};

function ConfidenceBadge({ level }: { level: Confidence }) {
  const styles =
    level === "high"
      ? "bg-emerald-100 text-emerald-800"
      : level === "medium"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${styles}`}
    >
      {confidenceLabel(level)}
    </span>
  );
}

function formatListingDate(value: string | null) {
  if (!value) return "Data non indicata";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventImportPanel() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [draft, setDraft] = useState<ExtractedEventDraft | null>(null);
  const [form, setForm] = useState<EditableEventImport | null>(null);
  const [listing, setListing] = useState<EventListingResult | null>(null);
  const [matches, setMatches] = useState<OrganizerMatch[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [imageNote, setImageNote] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.city.localeCompare(b.city, "it")),
    [],
  );

  const dateSpanDays = useMemo(() => {
    if (!form?.startDate || !form?.endDate) return null;
    const start = Date.parse(`${form.startDate}T00:00:00Z`);
    const end = Date.parse(`${form.endDate}T00:00:00Z`);
    if (Number.isNaN(start) || Number.isNaN(end)) return null;
    return Math.round((end - start) / 86_400_000);
  }, [form?.startDate, form?.endDate]);

  function patchForm(patch: Partial<EditableEventImport>) {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function analyzeUrl(
    targetUrl: string,
    clearListing = true,
    listingHint?: ListingEventCandidate | null,
  ) {
    setAnalyzing(true);
    setError(null);
    setSuccess(null);
    setSavedSlug(null);
    setDraft(null);
    setForm(null);
    setMatches([]);
    setDuplicates([]);
    setImageNote(null);
    if (clearListing) setListing(null);

    try {
      const response = await fetch("/api/admin/events/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = (await response.json()) as AnalyzeResponse;

      if (!response.ok) {
        setError(data.error || "Analisi non riuscita");
        return;
      }

      if (data.listing) {
        setListing(data.listing);
        setSuccess(data.message || null);
        return;
      }

      if (!data.editable || !data.draft) {
        setError(data.error || "Analisi non riuscita");
        return;
      }

      let editable = data.editable;
      // Prefer precise times/dates from the municipal listing (Solr) when page HTML is thinner
      if (listingHint) {
        const start = isoToRomeDateTime(listingHint.startAt);
        const end = isoToRomeDateTime(listingHint.endAt);
        if (start && (!editable.startDate || !editable.startTime)) {
          editable = {
            ...editable,
            startDate: editable.startDate || start.date,
            startTime: editable.startTime || start.time,
          };
        }
        if (end) {
          editable = {
            ...editable,
            endDate: editable.endDate || end.date,
            endTime: editable.endTime || end.time,
          };
        }
        if (!editable.description && listingHint.description) {
          editable = { ...editable, description: listingHint.description };
        }
      }

      setListing(null);
      setDraft(data.draft);
      setForm(editable);
      setMatches(data.organizerMatches || []);
      setDuplicates(data.duplicates || []);
      setImageNote(data.imageRightsNote || null);
      setUrl(targetUrl);
    } catch {
      setError("Errore di rete durante l'analisi");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleAnalyze(event: React.FormEvent) {
    event.preventDefault();
    await analyzeUrl(url, true);
  }

  async function handleImport(publish: boolean) {
    if (!form) return;
    setImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/events/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: form, publish }),
      });
      const data = (await response.json()) as ImportResponse;

      if (response.status === 409 && data.duplicate) {
        setError(
          data.error ||
            "Possibile duplicato. Usa “Importa comunque” o aggiorna l’esistente.",
        );
        return;
      }

      if (!response.ok) {
        setError(data.error || "Import non riuscito");
        return;
      }

      setSuccess(data.message || "Evento importato");
      setSavedSlug(data.event?.slug || null);
    } catch {
      setError("Errore di rete durante l'import");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleAnalyze}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h2 className="text-lg font-bold text-slate-900">Importa da URL</h2>
        <p className="mt-1 text-sm text-slate-600">
          Incolla l’URL di un singolo evento, oppure di un elenco comunale: ti
          mostriamo i risultati e scegli quale analizzare.
        </p>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            URL pagina evento
          </span>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.esempio.it/evento/..."
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#075EAE] focus:ring-2 focus:ring-[#075EAE]/20"
          />
        </label>
        <button
          type="submit"
          disabled={analyzing}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#E67E22] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:opacity-60"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Analisi in corso…
            </>
          ) : (
            "Analizza pagina"
          )}
        </button>
      </form>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {success && !listing ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p>{success}</p>
          {savedSlug ? (
            <Link
              href={`/eventi/${savedSlug}`}
              className="mt-2 inline-block font-semibold underline underline-offset-2"
            >
              Apri evento
            </Link>
          ) : null}
        </div>
      ) : null}

      {listing ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Elenco eventi trovato
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {listing.sourceName}: {listing.total} eventi totali. Seleziona un
            evento per caricarlo in verifica.
          </p>
          <ul className="mt-4 divide-y divide-slate-100">
            {listing.candidates.map((item) => (
              <li
                key={item.url}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatListingDate(item.startAt)}
                  </p>
                  {item.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={analyzing}
                  onClick={() => analyzeUrl(item.url, false, item)}
                  className="shrink-0 rounded-xl bg-[#075EAE] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#064a8a] disabled:opacity-60"
                >
                  Analizza questo
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {duplicates.length > 0 && form ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-bold text-amber-900">Possibile duplicato</h3>
          <p className="mt-1 text-sm text-amber-800">
            Questo evento potrebbe essere già presente in EVERAS.
          </p>
          <ul className="mt-3 space-y-2">
            {duplicates.map((dup) => (
              <li
                key={dup.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm"
              >
                <span>
                  <strong>{dup.title}</strong>
                  <span className="text-slate-500">
                    {" "}
                    · {dup.municipality} ·{" "}
                    {new Date(dup.start_at).toLocaleDateString("it-IT")}
                  </span>
                </span>
                <span className="flex gap-2">
                  {dup.slug ? (
                    <Link
                      href={`/eventi/${dup.slug}`}
                      className="font-semibold text-[#075EAE]"
                    >
                      Visualizza
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="font-semibold text-[#075EAE]"
                    onClick={() =>
                      patchForm({
                        updateExistingId: dup.id,
                        forceImport: false,
                      })
                    }
                  >
                    Aggiorna esistente
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <label className="mt-3 flex items-center gap-2 text-sm text-amber-900">
            <input
              type="checkbox"
              checked={form.forceImport}
              onChange={(e) =>
                patchForm({
                  forceImport: e.target.checked,
                  updateExistingId: e.target.checked
                    ? null
                    : form.updateExistingId,
                })
              }
            />
            Importa comunque (nuovo evento)
          </label>
        </section>
      ) : null}

      {form && draft ? (
        <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">Verifica evento</h2>
            <p className="mt-1 text-sm text-slate-600">
              Creatore tecnico: account admin. Organizzatore pubblico: nome sotto
              (profilo directory non rivendicato se creato).
            </p>
          </div>

          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Campo</th>
                <th className="px-4 py-3">Valore</th>
                <th className="px-4 py-3">Fonte</th>
                <th className="px-4 py-3">Affidabilità</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["title", "Titolo", draft.title],
                  ["description", "Descrizione", draft.description],
                  ["startDate", "Data inizio", draft.startDate],
                  ["startTime", "Ora inizio", draft.startTime],
                  ["endDate", "Data fine", draft.endDate],
                  ["endTime", "Ora fine", draft.endTime],
                  ["municipality", "Comune", draft.municipality],
                  ["province", "Provincia", draft.province],
                  ["locationName", "Location", draft.locationName],
                  ["address", "Indirizzo", draft.address],
                  ["organizerName", "Organizzatore", draft.organizerName],
                  ["category", "Categoria", draft.category],
                  ["imageUrl", "Immagine URL", draft.imageUrl],
                  ["ticketUrl", "Link prenotazione / biglietti", draft.ticketUrl],
                ] as const
              ).map(([key, label, extracted]) => (
                <tr key={key} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {label}
                  </td>
                  <td className="px-4 py-3">
                    {key === "description" ? (
                      <textarea
                        rows={4}
                        value={form[key]}
                        onChange={(e) => patchForm({ [key]: e.target.value })}
                        className="w-full min-w-[16rem] rounded-lg border border-slate-300 px-2.5 py-1.5"
                      />
                    ) : key === "municipality" ? (
                      <select
                        value={form.municipality}
                        onChange={(e) => {
                          const city = sortedCities.find(
                            (c) => c.city === e.target.value,
                          );
                          patchForm({
                            municipality: e.target.value,
                            province: city?.province || form.province,
                          });
                        }}
                        className="w-full min-w-[12rem] rounded-lg border border-slate-300 px-2.5 py-1.5"
                      >
                        <option value="">Seleziona</option>
                        {sortedCities.map((c) => (
                          <option key={c.id} value={c.city}>
                            {c.city} ({c.province})
                          </option>
                        ))}
                      </select>
                    ) : key === "category" ? (
                      <select
                        value={form.category}
                        onChange={(e) =>
                          patchForm({ category: e.target.value })
                        }
                        className="w-full min-w-[12rem] rounded-lg border border-slate-300 px-2.5 py-1.5"
                      >
                        <option value="">Seleziona</option>
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={
                          key.includes("Date")
                            ? "date"
                            : key.includes("Time")
                              ? "time"
                              : "text"
                        }
                        value={form[key]}
                        onChange={(e) => patchForm({ [key]: e.target.value })}
                        className="w-full min-w-[12rem] rounded-lg border border-slate-300 px-2.5 py-1.5"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {extracted.source || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBadge level={extracted.confidence} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-4 border-t border-slate-200 px-5 py-5">
            {form.imageUrl ? (
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Anteprima immagine
                </p>
                {imageNote ? (
                  <p className="mt-1 text-xs text-amber-700">{imageNote}</p>
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="Anteprima evento"
                  className="mt-2 max-h-48 rounded-xl border border-slate-200 object-cover"
                />
                <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.downloadImage}
                    onChange={(e) =>
                      patchForm({ downloadImage: e.target.checked })
                    }
                  />
                  Scarica e ottimizza immagine (WebP) — solo se i diritti lo
                  consentono
                </label>
              </div>
            ) : null}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Organizzatore
              </p>
              {matches.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {matches.map((m) => (
                    <label
                      key={`${m.kind}-${m.id}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="organizerMatch"
                        checked={
                          m.kind === "directory" &&
                          form.organizerDirectoryId === m.id
                        }
                        onChange={() =>
                          patchForm({
                            organizerDirectoryId:
                              m.kind === "directory" ? m.id : null,
                            createOrganizerDirectory: false,
                            organizerName: m.name,
                          })
                        }
                      />
                      <span>
                        {m.name}{" "}
                        <span className="text-slate-500">
                          ({m.kind === "directory" ? "directory" : "profilo"})
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-600">
                  Organizzatore non presente nel database.
                </p>
              )}
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.createOrganizerDirectory}
                  onChange={(e) =>
                    patchForm({
                      createOrganizerDirectory: e.target.checked,
                      organizerDirectoryId: e.target.checked
                        ? null
                        : form.organizerDirectoryId,
                    })
                  }
                />
                Crea nuovo profilo directory (Non rivendicato)
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
              <p>
                <strong>Creatore:</strong> Marina Canalis (admin)
              </p>
              <p className="mt-1">
                <strong>Organizzatore:</strong>{" "}
                {form.organizerName || "—"}
              </p>
              <p className="mt-1">
                <strong>Titolo:</strong> {form.title || "—"}
              </p>
              <p className="mt-1">
                <strong>Data:</strong> {form.startDate || "—"} {form.startTime}
                {form.endDate
                  ? ` → ${form.endDate} ${form.endTime}`.trimEnd()
                  : ""}
              </p>
              <p className="mt-1">
                <strong>Luogo:</strong> {form.municipality || "—"} (
                {form.province || "—"})
              </p>
              {dateSpanDays !== null && dateSpanDays > 14 ? (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                  Intervallo di {dateSpanDays} giorni: finché la data di fine non
                  è passata, l’evento comparirà come “In corso”. Lascia vuota la
                  data fine se è un evento di un solo giorno.
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={importing}
                onClick={() => handleImport(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#075EAE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#064a8a] disabled:opacity-60"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                Importa e pubblica
              </button>
              <button
                type="button"
                disabled={importing}
                onClick={() => handleImport(false)}
                className="inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE] disabled:opacity-60"
              >
                Salva come pending
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
