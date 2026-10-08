import Link from "next/link";

type ExpiredEventNoticeProps = {
  municipality: string;
  cityPath: string;
  categoryLabel: string;
  categoryPath: string;
  nextEdition?: {
    slug: string;
    title: string;
    date: string;
  } | null;
};

export default function ExpiredEventNotice({
  municipality,
  cityPath,
  categoryLabel,
  categoryPath,
  nextEdition,
}: ExpiredEventNoticeProps) {
  const categoryCta = /sardegna/i.test(categoryLabel)
    ? categoryLabel
    : `${categoryLabel} in Sardegna`;

  return (
    <section
      aria-labelledby="expired-event-title"
      className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">
        Edizione conclusa
      </p>
      <h2
        id="expired-event-title"
        className="mt-2 text-2xl font-black text-slate-900"
      >
        Questo evento è terminato
      </h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
        Conserviamo online date, programma e informazioni di questa edizione.
        Per scegliere cosa fare ora, consulta gli appuntamenti aggiornati a{" "}
        {municipality} o nella stessa categoria.
      </p>

      {nextEdition ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
            Nuova edizione disponibile
          </p>
          <Link
            href={`/eventi/${nextEdition.slug}`}
            className="mt-2 inline-flex text-lg font-black text-[#075EAE] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075EAE] focus-visible:ring-offset-2"
          >
            {nextEdition.title}
          </Link>
          <p className="mt-1 text-sm text-slate-600">{nextEdition.date}</p>
        </div>
      ) : null}

      <nav aria-label="Alternative aggiornate all'evento terminato" className="mt-5">
        <ul className="flex flex-wrap gap-3">
          <li>
            <Link
              href={cityPath}
              className="inline-flex min-h-11 items-center rounded-full bg-[#075EAE] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#064a8a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075EAE] focus-visible:ring-offset-2"
            >
              Eventi attuali a {municipality}
            </Link>
          </li>
          <li>
            <Link
              href={categoryPath}
              className="inline-flex min-h-11 items-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#075EAE] transition hover:border-[#075EAE] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075EAE] focus-visible:ring-offset-2"
            >
              {categoryCta}
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
