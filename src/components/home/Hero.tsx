import { preload } from "react-dom";

import HeroSearchLazy from "@/src/components/home/HeroSearchLazy";

export default function Hero() {
  // Decorative background: keep out of the LCP element tree so mobile LCP
  // can be the H1 text (paints with CSS). Still preload for visual quality.
  preload("/images/concert.webp", { as: "image", fetchPriority: "high" });

  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/concert.webp')",
        backgroundPosition: "60% center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,40,84,.68) 0%, rgba(5,75,140,.35) 45%, rgba(0,0,0,.10) 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 pb-9 pt-14 sm:px-8 sm:pb-12 sm:pt-18">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-200 sm:text-xs">
          EVERAS · Eventi in Sardegna
        </p>

        <h1 className="mt-3 max-w-3xl text-2xl font-black leading-[1.12] text-white sm:mt-4 sm:text-3xl lg:text-4xl">
          EVERAS: scopri eventi e cose da fare in Sardegna
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-5 text-blue-50 sm:mt-4 sm:text-base sm:leading-6">
          Eventi, sagre, concerti, workshop e attività in tutta l’isola — cerca
          per giorno, città o interesse.
        </p>

        <HeroSearchLazy />
      </div>
    </section>
  );
}
