import CompressImagesPanel from "@/src/components/admin/CompressImagesPanel";

export default function ComprimiImmaginiPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Comprimi immagini
      </h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Converte le fotografie già pubblicate in WebP ottimizzato. Puoi
        ripetere il lotto finché il conteggio da convertire arriva a zero.
      </p>

      <div className="mt-8">
        <CompressImagesPanel />
      </div>
    </div>
  );
}
