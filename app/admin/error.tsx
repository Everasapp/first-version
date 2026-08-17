"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Questa pagina admin non si è caricata
      </h1>
      <p className="mt-3 text-slate-600">
        {error.message || "Errore inatteso. Riprova tra qualche secondo."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-[#075EAE] px-4 py-2.5 text-sm font-bold text-white"
      >
        Riprova
      </button>
    </div>
  );
}
