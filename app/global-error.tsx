"use client";

import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  const retry = unstable_retry ?? reset;

  return (
    <html lang="it">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Questa pagina non si è caricata
          </h1>
          <p className="mt-3 text-slate-600">
            Errore inatteso sul server. Riprova tra qualche secondo.
          </p>
          {error.digest ? (
            <p className="mt-2 text-xs text-slate-400">Codice: {error.digest}</p>
          ) : null}
          {retry ? (
            <button
              type="button"
              onClick={() => retry()}
              className="mt-6 rounded-xl bg-[#075EAE] px-4 py-2.5 text-sm font-bold text-white"
            >
              Riprova
            </button>
          ) : null}
        </div>
      </body>
    </html>
  );
}
