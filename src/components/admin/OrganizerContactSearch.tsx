"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

import type { FoundContactItem } from "@/src/lib/admin/organizer-directory";

type SearchResponse = {
  ok: boolean;
  error?: string;
  startUrl?: string;
  pagesVisited?: number;
  pagesAnalyzed?: string[];
  items?: FoundContactItem[];
  skippedRobots?: number;
  name?: string;
};

type SaveResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  organizer?: { id: string; name: string; claim_status: string };
};

export default function OrganizerContactSearch() {
  const [name, setName] = useState("Comune di Sassari");
  const [website, setWebsite] = useState("https://www.comune.sassari.it");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    pagesVisited: number;
    pagesAnalyzed: string[];
    skippedRobots: number;
  } | null>(null);
  const [items, setItems] = useState<FoundContactItem[] | null>(null);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setItems(null);
    setMeta(null);

    try {
      const response = await fetch("/api/admin/organizer-contacts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, website }),
      });
      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        setError(data.error || "Ricerca non riuscita");
        return;
      }

      if (data.error && !data.items?.length) {
        setError(data.error);
      } else if (data.error) {
        setError(data.error);
      }

      setItems(data.items || []);
      setMeta({
        pagesVisited: data.pagesVisited || 0,
        pagesAnalyzed: data.pagesAnalyzed || [],
        skippedRobots: data.skippedRobots || 0,
      });
    } catch {
      setError("Errore di rete durante la ricerca");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!items) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/organizer-contacts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, website, items }),
      });
      const data = (await response.json()) as SaveResponse;

      if (!response.ok) {
        setError(data.error || "Salvataggio non riuscito");
        return;
      }

      setSuccess(
        data.message ||
          `Salvato: ${data.organizer?.name} (${data.organizer?.claim_status})`,
      );
    } catch {
      setError("Errore di rete durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function updateItem(id: string, patch: Partial<FoundContactItem>) {
    setItems((prev) =>
      prev ? prev.map((item) => (item.id === id ? { ...item, ...patch } : item)) : prev,
    );
  }

  function removeItem(id: string) {
    setItems((prev) => (prev ? prev.filter((item) => item.id !== id) : prev));
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSearch}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Nome organizzatore
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#075EAE] focus:ring-2 focus:ring-[#075EAE]/20"
              placeholder="Es. Comune di Sassari"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              URL del sito web
            </span>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#075EAE] focus:ring-2 focus:ring-[#075EAE]/20"
              placeholder="https://www.comune.sassari.it"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Ricerca in corso…
            </>
          ) : (
            "Cerca contatti"
          )}
        </button>
      </form>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </p>
      ) : null}

      {meta ? (
        <p className="text-sm text-slate-600">
          Pagine analizzate: {meta.pagesAnalyzed.length} / visitate:{" "}
          {meta.pagesVisited}
          {meta.skippedRobots > 0
            ? ` · saltate da robots.txt: ${meta.skippedRobots}`
            : ""}
        </p>
      ) : null}

      {items ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Seleziona</th>
                <th className="px-4 py-3 font-semibold">Campo</th>
                <th className="px-4 py-3 font-semibold">Valore</th>
                <th className="px-4 py-3 font-semibold">Fonte</th>
                <th className="px-4 py-3 font-semibold">Verificato</th>
                <th className="px-4 py-3 font-semibold">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const notFound = item.value === "Non trovato";
                return (
                  <tr key={item.id} className="border-b border-slate-100 align-top">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        disabled={notFound}
                        onChange={(e) =>
                          updateItem(item.id, { selected: e.target.checked })
                        }
                        aria-label={`Seleziona ${item.label}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.label}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          updateItem(item.id, {
                            value: e.target.value,
                            selected:
                              e.target.value.trim() !== "" &&
                              e.target.value !== "Non trovato"
                                ? true
                                : item.selected,
                          })
                        }
                        className={`w-full min-w-[14rem] rounded-lg border px-2.5 py-1.5 ${
                          notFound
                            ? "border-slate-200 bg-slate-50 text-slate-400"
                            : "border-slate-300 bg-white text-slate-900"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {item.sourceUrl ? (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-[#075EAE] underline-offset-2 hover:underline"
                        >
                          {item.sourceUrl}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={item.verified}
                        disabled={notFound}
                        onChange={(e) =>
                          updateItem(item.id, { verified: e.target.checked })
                        }
                        aria-label={`Verificato ${item.label}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-red-600 transition hover:bg-red-50"
                        aria-label={`Elimina ${item.label}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Elimina
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-4">
            <p className="text-xs text-slate-500">
              Solo i campi selezionati verranno salvati. Stato profilo:{" "}
              <strong>Non rivendicato</strong>.
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075EAE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#064a8a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Salvataggio…
                </>
              ) : (
                "Salva organizzatore"
              )}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
