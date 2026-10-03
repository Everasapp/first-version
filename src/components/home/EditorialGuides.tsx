import Link from "next/link";

const guides = [
  {
    href: "/cultura-sarda/nord-sardegna/sassari",
    title: "Sassari, tra un evento e l’altro",
    description: "Museo Sanna, centro storico e tradizioni dei gremi: scegli cosa approfondire prima di una mostra o di uno spettacolo.",
  },
  {
    href: "/cultura-sarda/centro-sardegna/nuoro",
    title: "Nuoro, una giornata di cultura",
    description: "Collega la visita al MAN alla città di Grazia Deledda: musei, storia e luoghi da conoscere oltre il programma dell’evento.",
  },
  {
    href: "/cultura-sarda/centro-sardegna/orgosolo",
    title: "Orgosolo, leggere il paese",
    description: "Murales, storia e tradizioni: una guida per capire ciò che incontri nelle strade e preparare una visita oltre i giorni di festa.",
  },
] as const;

export default function EditorialGuides() {
  return (
    <section aria-labelledby="editorial-guides-title" className="border-b border-slate-200 bg-slate-50 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">Prima di partire</p>
            <h2 id="editorial-guides-title" className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Un evento, un territorio da conoscere</h2>
          </div>
          <Link href="/cultura-sarda" prefetch={false} className="py-2 text-sm font-bold text-[#075EAE] hover:underline">Tutte le guide →</Link>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.href}>
              <Link href={guide.href} prefetch={false} className="block h-full rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#075EAE]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]">
                <h3 className="text-lg font-bold text-slate-900">{guide.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.description}</p>
                <span className="mt-3 inline-block text-sm font-bold text-[#075EAE]">Leggi la guida →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
