"use client";

import { useRouter } from "next/navigation";
import { Compass, MapPin, Sun } from "lucide-react";

import EventSearchForm from "@/src/components/home/EventSearchForm";

export default function Hero() {
  const router = useRouter();

  function goToArea(area: string) {
    router.push(`/eventi?area=${area}`);
  }

  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/concert.png')",
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

      <div className="mx-auto flex min-h-[700px] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-200">
          Eventi in tutta la Sardegna
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
          Scopri cosa fare oggi in Sardegna
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50 sm:text-xl">
          Sagre, concerti, spettacoli, esperienze e attività vicino a te.
        </p>

        <EventSearchForm variant="hero" />

        <div className="mt-3 flex max-w-5xl flex-wrap gap-2">
          <button
            type="button"
            onClick={() => goToArea("nord-sardegna")}
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Compass aria-hidden="true" className="h-4 w-4" />
            Nord Sardegna
          </button>

          <button
            type="button"
            onClick={() => goToArea("centro-sardegna")}
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
            Centro Sardegna
          </button>

          <button
            type="button"
            onClick={() => goToArea("sud-sardegna")}
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Sun aria-hidden="true" className="h-4 w-4" />
            Sud Sardegna
          </button>
        </div>
      </div>
    </section>
  );
}
