import Image from "next/image";
import Link from "next/link";

import type { WeeklyTownGuideCard } from "@/src/lib/home/weekly-town-guides";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";

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
              Tre comuni con eventi in programma: apri la guida per storia,
              tradizioni e cosa visitare. La selezione cambia ogni lunedì.
            </p>
          </div>

          <Link
            href={CULTURE_HUB_PATH}
            className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-[#075EAE]/25 bg-[#075EAE]/5 px-5 py-2.5 text-sm font-bold text-[#075EAE] transition hover:bg-[#075EAE]/10 lg:self-auto"
          >
            Tutte le guide →
          </Link>
        </div>

        <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          {towns.map((town, index) => (
            <li
              key={town.href}
              className="group animate-[fadeUp_0.55s_ease-out_both]"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <Link
                href={town.href}
                className="block overflow-hidden rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-200 sm:aspect-[3/4]">
                  <Image
                    src={town.imageSrc}
                    alt={town.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">
                      {town.areaLabel}
                    </p>
                    <h3 className="mt-1 text-2xl font-black tracking-tight text-white">
                      {town.town}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold text-white/85">
                      {town.eventCount === 1
                        ? "1 evento questa settimana"
                        : `${town.eventCount} eventi questa settimana`}
                    </p>
                    <span className="mt-3 inline-flex text-sm font-bold text-white transition group-hover:translate-x-0.5">
                      Apri la guida →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
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
