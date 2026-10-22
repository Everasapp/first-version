import Link from "next/link";
import { preload } from "react-dom";

import { learningDisciplines } from "@/src/data/learning-disciplines";

import { LEARNING_PATH } from "@/src/lib/learning-courses";

const HERO_IMAGE = "/images/learning/imparare-sardegna-hero.webp";

export default function Hero() {
  // Decorative background: keep out of the LCP element tree so mobile LCP
  // can be the H1 text (paints with CSS). Still preload for visual quality.
  preload(HERO_IMAGE, { as: "image", fetchPriority: "high" });

  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,24,48,.78) 0%, rgba(4,32,64,.7) 58%, rgba(4,24,48,.78) 100%), linear-gradient(100deg, rgba(4,24,48,.55) 0%, rgba(4,24,48,.28) 48%, rgba(4,24,48,.45) 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 pb-9 pt-14 sm:px-8 sm:pb-12 sm:pt-18">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-200 sm:text-xs">
          EVERAS
        </p>

        <h1 className="mt-3 max-w-3xl text-2xl font-black leading-[1.12] text-white sm:mt-4 sm:text-3xl lg:text-4xl">
          Impara qualcosa di nuovo, vicino a te.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-5 text-blue-50 sm:mt-4 sm:text-base sm:leading-6">
          Sviluppa competenze per il lavoro oppure coltiva una passione:
          scopri formazione, corsi, workshop ed esperienze in Sardegna.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={`${LEARNING_PATH}#corsi-workshop`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#B95408] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#A94B06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Corsi e workshop
          </Link>
          <Link
            href={`${LEARNING_PATH}#formazione`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/80 bg-white/10 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Formazione per il lavoro
          </Link>
        </div>

        <form
          action={`${LEARNING_PATH}#ricerca`}
          method="get"
          role="search"
          aria-label="Cerca nel catalogo corsi"
          className="mt-6 grid max-w-5xl gap-3 rounded-2xl bg-white p-4 text-slate-900 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.25fr_1.6fr_2fr_auto]"
        >
          <label className="min-w-0 text-sm font-semibold">
            Zona
            <select
              name="area"
              defaultValue=""
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
            >
              <option value="">Tutte le zone</option>
              <option value="nord-sardegna">Nord Sardegna</option>
              <option value="centro-sardegna">Centro Sardegna</option>
              <option value="sud-sardegna">Sud Sardegna</option>
            </select>
          </label>
          <label className="min-w-0 text-sm font-semibold">
            Comune
            <input
              name="city"
              placeholder="Es. Sassari"
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
            />
          </label>
          <label className="min-w-0 text-sm font-semibold">
            Disciplina
            <select
              name="disciplina"
              defaultValue=""
              className="mt-2 min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
            >
              <option value="">Tutte le discipline</option>
              {learningDisciplines.map((discipline) => (
                <option key={discipline.slug} value={discipline.slug}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-0 text-sm font-semibold">
            Cosa vuoi imparare?
            <input
              type="search"
              name="q"
              placeholder="Es. inglese, ceramica, digitale"
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
            />
          </label>
          <button
            type="submit"
            className="min-h-11 self-end rounded-xl bg-[#075EAE] px-5 py-2 text-sm font-bold text-white hover:bg-[#064a8a] sm:col-span-2 lg:col-span-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
          >
            Cerca corsi
          </button>
        </form>
      </div>
    </section>
  );
}
