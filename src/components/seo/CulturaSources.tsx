import type { CulturaSource } from "@/src/lib/seo/cultura-articles";

type CulturaSourcesProps = {
  sources: CulturaSource[];
};

export default function CulturaSources({ sources }: CulturaSourcesProps) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <h2 className="text-2xl font-bold text-slate-900">
        Fonti e approfondimenti
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
        Pagine istituzionali usate per verificare fatti. I testi EVERAS sono
        originali; orari e biglietti si confermano sulle fonti.
      </p>
      <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-slate-700">
        {sources.map((source) => (
          <li key={`${source.label}-${source.href}`}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#075EAE] hover:underline"
            >
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
