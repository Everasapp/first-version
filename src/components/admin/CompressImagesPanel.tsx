"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageDown, LoaderCircle } from "lucide-react";

type Stats = {
  totalWithImage: number;
  alreadyWebp: number;
  pending: number;
};

type CompressResult = {
  processed: number;
  converted: number;
  failed: number;
  remaining: number;
  results: Array<{
    id: string;
    slug: string;
    ok: boolean;
    error?: string;
    publicUrl?: string;
  }>;
};

async function readApiJson<T extends { error?: string }>(
  response: Response,
): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    throw new Error(
      response.ok
        ? "Risposta vuota dal server."
        : `Errore server (${response.status}). Su Vercel verifica SUPABASE_SERVICE_ROLE_KEY e riprova con lotti piccoli.`,
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Risposta non valida dal server (${response.status}). Riprova tra poco.`,
    );
  }
}

export default function CompressImagesPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<CompressResult | null>(null);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    setError("");
    try {
      const response = await fetch("/api/admin/images/compress");
      const payload = await readApiJson<Stats & { error?: string }>(response);
      if (!response.ok) {
        throw new Error(payload.error || "Impossibile caricare lo stato.");
      }
      setStats(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di rete.");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  async function runBatch() {
    setRunning(true);
    setError("");
    try {
      const response = await fetch("/api/admin/images/compress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 2 }),
      });
      const payload = await readApiJson<CompressResult & { error?: string }>(
        response,
      );
      if (!response.ok) {
        throw new Error(payload.error || "Compressione non riuscita.");
      }
      setLastRun(payload);
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di rete.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E67E22]/10 text-[#E67E22]">
          <ImageDown className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900">
            Comprimi immagini esistenti
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Scarica le foto già online (anche URL esterni), le converte in WebP
            ottimizzato e le salva su Storage EVERAS. Lotti da 2 per evitare
            timeout su Vercel.
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {loadingStats && !stats ? (
              <p className="text-slate-500">Caricamento…</p>
            ) : stats ? (
              <>
                <p>
                  <span className="font-semibold text-slate-900">
                    {stats.pending}
                  </span>{" "}
                  <span className="text-slate-600">da convertire</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    {stats.alreadyWebp}
                  </span>{" "}
                  <span className="text-slate-600">già WebP</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    {stats.totalWithImage}
                  </span>{" "}
                  <span className="text-slate-600">con immagine</span>
                </p>
              </>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void runBatch()}
              disabled={running || (stats?.pending ?? 0) === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#075EAE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#064E91] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Compressione in corso…
                </>
              ) : (
                "Comprimi prossime 2"
              )}
            </button>
            <button
              type="button"
              onClick={() => void loadStats()}
              disabled={running || loadingStats}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] disabled:opacity-50"
            >
              Aggiorna conteggio
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
            >
              {error}
            </p>
          )}

          {lastRun && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p>
                Ultimo lotto:{" "}
                <span className="font-semibold text-slate-900">
                  {lastRun.converted}
                </span>{" "}
                convertite
                {lastRun.failed > 0 ? (
                  <>
                    ,{" "}
                    <span className="font-semibold text-red-700">
                      {lastRun.failed} fallite
                    </span>
                  </>
                ) : null}
                . Restano circa{" "}
                <span className="font-semibold text-slate-900">
                  {lastRun.remaining}
                </span>
                .
              </p>
              {lastRun.results.some((item) => !item.ok) && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-red-700">
                  {lastRun.results
                    .filter((item) => !item.ok)
                    .map((item) => (
                      <li key={item.id}>
                        {item.slug}: {item.error}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
