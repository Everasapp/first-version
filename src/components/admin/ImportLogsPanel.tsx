"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, Play } from "lucide-react";

export type ImportRunRow = {
  id: string;
  batch_id: string;
  source: string;
  started_at: string;
  completed_at: string | null;
  status: "started" | "success" | "error" | "partial";
  events_found: number;
  events_created: number;
  duplicates: number;
  skipped: number;
  errors: number;
  duration_ms: number | null;
  error_message: string | null;
  http_status: number | null;
  last_error_code: string | null;
  triggered_by: "cron" | "admin";
};

function statusLabel(status: ImportRunRow["status"]) {
  if (status === "success") return "success";
  if (status === "partial") return "partial";
  if (status === "error") return "error";
  return "started";
}

function statusClass(status: ImportRunRow["status"]) {
  if (status === "success") return "bg-emerald-50 text-emerald-800";
  if (status === "partial") return "bg-amber-50 text-amber-800";
  if (status === "error") return "bg-red-50 text-red-800";
  return "bg-slate-100 text-slate-700";
}

function formatRome(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    timeZone: "Europe/Rome",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ImportLogsPanel({ runs }: { runs: ImportRunRow[] }) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRunNow() {
    const confirmed = window.confirm(
      "Lanciare ora lo stesso importatore cloud del cron? Pubblica eventi nuovi con locandina e descrizione completa.",
    );
    if (!confirmed) return;

    setIsRunning(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/import-runs/run", {
        method: "POST",
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        batchId?: string;
        importedCount?: number;
        discoveredNew?: number;
        sourceResults?: Array<{ source: string; status: string }>;
      };
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || "Importer cloud non riuscito");
      }
      const sources = data.sourceResults?.length
        ? ` · ${data.sourceResults.length} fonti`
        : "";
      setMessage(
        `Batch ${data.batchId || "ok"}: trovati ${data.discoveredNew ?? 0}, pubblicati ${data.importedCount ?? 0}${sources}.`,
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Importer cloud non riuscito");
    } finally {
      setIsRunning(false);
    }
  }

  const batches = new Map<string, ImportRunRow[]>();
  for (const run of runs) {
    const list = batches.get(run.batch_id) || [];
    list.push(run);
    batches.set(run.batch_id, list);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
        <p className="text-sm text-blue-900">
          Usa lo stesso endpoint cloud del cron mattutino. Non parte un
          importatore locale.
        </p>
        <button
          type="button"
          onClick={handleRunNow}
          disabled={isRunning}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#075EAE]/30 bg-white px-4 py-2.5 text-sm font-bold text-[#075EAE] transition hover:bg-blue-100 disabled:opacity-60"
        >
          {isRunning ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
          {isRunning ? "Import in corso…" : "Run importer now"}
        </button>
        {message ? (
          <p className="mt-2 text-sm font-medium text-emerald-700">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
        ) : null}
      </div>

      {runs.length === 0 ? (
        <p className="text-sm text-slate-600">
          Nessuna run ancora. Il cron delle 08:00 o il pulsante sopra
          scriveranno una riga per ciascuna fonte.
        </p>
      ) : (
        Array.from(batches.entries()).map(([batchId, rows]) => {
          const first = rows[0];
          return (
            <section key={batchId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {formatRome(first.started_at)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {first.triggered_by === "admin" ? "manuale" : "cron"} ·{" "}
                    {rows.length} fonti · batch {batchId.slice(0, 8)}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-2">Fonte</th>
                      <th className="px-4 py-2">Esito</th>
                      <th className="px-4 py-2">Trovati</th>
                      <th className="px-4 py-2">Pubblicati</th>
                      <th className="px-4 py-2">Duplicati</th>
                      <th className="px-4 py-2">Errori</th>
                      <th className="px-4 py-2">Durata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100">
                        <td className="px-4 py-2 font-medium text-slate-900">
                          {row.source}
                          {row.last_error_code ? (
                            <span className="mt-0.5 block text-xs font-normal text-slate-500">
                              {row.last_error_code}
                              {row.http_status ? ` · HTTP ${row.http_status}` : ""}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${statusClass(row.status)}`}
                          >
                            {statusLabel(row.status)}
                          </span>
                        </td>
                        <td className="px-4 py-2">{row.events_found}</td>
                        <td className="px-4 py-2">{row.events_created}</td>
                        <td className="px-4 py-2">{row.duplicates}</td>
                        <td className="px-4 py-2">{row.errors}</td>
                        <td className="px-4 py-2 text-slate-600">
                          {row.duration_ms != null
                            ? `${(row.duration_ms / 1000).toFixed(1)} s`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
