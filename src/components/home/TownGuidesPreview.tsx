import Image from "next/image";
import Link from "next/link";

import type { WeeklyTownGuideCard } from "@/src/lib/home/weekly-town-guides";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";

const TOWN_FUMETTI = [
  {
    src: "/images/home/comune-fumetto-costa.webp",
    alt: "Simbolo grafico di un nuraghe e motivi sardi",
  },
  {
    src: "/images/home/comune-fumetto-interno.webp",
    alt: "Simbolo grafico di un paese sardo e motivo tessuto",
  },
  {
    src: "/images/home/comune-fumetto-piazza.webp",
    alt: "Simbolo grafico della Sardegna e motivi tradizionali",
  },
] as const;

type TownGuidesPreviewProps = {
  towns: WeeklyTownGuideCard[];
};

export default function TownGuidesPreview({ towns }: TownGuidesPreviewProps) {
  if (towns.length === 0) {
    return (
      <section className="overflow-x-clip bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-10 sm:px-10 sm:py-12">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Guide dei comuni
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Scopri i paesi oltre il calendario
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              Storia, tradizioni e cosa visitare, comune per comune. Questa
              settimana non ci sono ancora eventi collegati alle guide in
              evidenza.
            </p>
            <Link
              href={CULTURE_HUB_PATH}
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#075EAE] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#064a8a]"
            >
              Vai alle guide
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-x-clip bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Guide dei comuni
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Dove succede qualcosa questa settimana
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              Tre comuni con almeno due eventi in programma: apri la guida per
              storia, tradizioni e cosa visitare. La selezione cambia ogni
              lunedì.
            </p>
          </div>

          <Link
            href={CULTURE_HUB_PATH}
            className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-[#075EAE]/25 bg-[#075EAE]/5 px-5 py-2.5 text-sm font-bold text-[#075EAE] transition hover:bg-[#075EAE]/10 lg:self-auto"
          >
            Tutte le guide →
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
          {towns.map((town, index) => {
            const fumetto = TOWN_FUMETTI[index % TOWN_FUMETTI.length];

            return (
              <li
                key={town.href}
                className="group animate-[fadeUp_0.55s_ease-out_both]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <Link
                  href={town.href}
                  className="block overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white transition hover:border-[#075EAE]/35 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
                >
                  {/* ~60% dell’altezza precedente (aspect 3/4 → 5/4) */}
                  <div className="relative aspect-[5/4] overflow-hidden bg-[#F7F9FC]">
                    <Image
                      src={fumetto.src}
                      alt={fumetto.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-3 transition duration-500 ease-out group-hover:scale-[1.03] sm:p-4"
                    />
                  </div>
                  <div className="border-t border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#075EAE]">
                      {town.areaLabel}
                    </p>
                    <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                      {town.town}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {town.eventCount === 1
                        ? "1 evento questa settimana"
                        : `${town.eventCount} eventi questa settimana`}
                    </p>
                    <span className="mt-2.5 inline-flex text-sm font-bold text-[#075EAE] transition group-hover:translate-x-0.5">
                      Apri la guida →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
