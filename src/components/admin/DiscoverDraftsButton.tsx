"use client";

import { useState } from "react";
import { LoaderCircle, Search } from "lucide-react";

export default function DiscoverDraftsButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleDiscover() {
    const confirmed = window.confirm(
      "Cercare nuovi eventi su SassariToday, CagliariToday e Santa Teresa Gallura e salvarli come bozze (pending)?",
    );
    if (!confirmed) return;

    setIsRunning(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/events/discover-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 20 }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        importedCount?: number;
        discoveredNew?: number;
        skippedCount?: number;
        errorCount?: number;
        imported?: Array<{ title: string; slug: string; municipality: string }>;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Discovery non riuscita");
      }

      setMessage(
        `Trovati ${data.discoveredNew ?? 0} eventi nuovi, importate ${data.importedCount ?? 0} bozze.` +
          (data.skippedCount ? ` Saltati ${data.skippedCount}.` : "") +
          (data.errorCount ? ` Errori ${data.errorCount}.` : ""),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Discovery non riuscita");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="mb-6 flex flex-col items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
      <p className="text-sm text-blue-900">
        Scansione automatica di fonti esterne (CityNews e calendari comunali) per
        trovare eventi non ancora su EVERAS e salvarli come bozze da verificare.
      </p>
      <button
        type="button"
        onClick={handleDiscover}
        disabled={isRunning}
        className="inline-flex items-center gap-2 rounded-xl border border-[#075EAE]/30 bg-white px-4 py-2.5 text-sm font-bold text-[#075EAE] transition hover:bg-blue-100 disabled:opacity-60"
      >
        {isRunning ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="h-4 w-4" aria-hidden="true" />
        )}
        {isRunning ? "Ricerca in corso…" : "Cerca nuovi eventi e salva bozze"}
      </button>
      {message ? (
        <p className="text-sm font-medium text-emerald-700">{message}</p>
      ) : null}
      {error ? (
        <p className="text-sm font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
