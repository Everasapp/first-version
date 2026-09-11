import Link from "next/link";

import EventsExploreGrid from "@/src/components/events/EventsExploreGrid";
import type { EventCardData } from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import JsonLd from "@/src/components/seo/JsonLd";
import type { City } from "@/src/data/cities";
import type { CultureArea } from "@/src/lib/seo/cultura-areas";
import {
  cultureTownPathForCity,
  provinceLabel,
} from "@/src/lib/seo/cultura-areas";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";
import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";
import { cityEventsPath } from "@/src/lib/seo/paths";

type CultureTownStubViewProps = {
  area: CultureArea;
  city: City;
  nearby: City[];
  featured: CultureTownArticle[];
  events: EventCardData[];
  jsonLd: Array<Record<string, unknown>>;
};

function townPreposition(town: string) {
  return /^[aeiouàèéìòù]/i.test(town) ? "ad" : "a";
}

export default function CultureTownStubView({
  area,
  city,
  nearby,
  featured,
  events,
  jsonLd,
}: CultureTownStubViewProps) {
  const eventsHref = cityEventsPath(city.city);
  const townPrep = townPreposition(city.city);
  const province = provinceLabel(city.province);

  return (
    <>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}

      <Header />

      <main className="min-h-screen bg-white">
        <article>
          <header className="border-b border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
              <Breadcrumbs
                items={[
                  { name: "Home", href: "/" },
                  { name: "Cultura sarda", href: CULTURE_HUB_PATH },
                  { name: area.h1, href: area.path },
                  { name: city.city },
                ]}
              />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                {area.h1} · Provincia di {province}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                {city.city}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {`${city.city} è un comune del ${area.name}, in provincia di ${province}. Questa pagina è la scheda del paese nella guida Cultura sarda: da qui arrivi al calendario eventi e agli altri comuni dell’area.`}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Nella guida
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {featured.length > 0
                  ? `Le schede più ampie — musei, mestieri, cosa visitare — partono dai comuni già pubblicati nel ${area.name}. ${city.city} resta in directory per chi cerca il nome esatto, con gli appuntamenti in programma e i collegamenti ai paesi vicini.`
                  : `${city.city} è in directory con gli eventi in programma e i collegamenti agli altri comuni del ${area.name}. Le schede più ampie — musei, mestieri, cosa visitare — si aggiungono comune per comune.`}
              </p>
            </section>

            {featured.length > 0 ? (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900">
                  Guide del {area.h1}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {featured.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={article.path}
                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                      >
                        {article.town}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {nearby.length > 0 ? (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900">
                  Altri paesi
                </h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {nearby.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={cultureTownPathForCity(item)}
                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                      >
                        {item.city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </article>

        <section className="border-t border-slate-200 bg-slate-50 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                  Calendario
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Eventi {townPrep} {city.city}
                </h2>
              </div>
              <Link
                href={eventsHref}
                className="text-sm font-bold text-[#075EAE] hover:underline"
              >
                Vedi tutti gli eventi →
              </Link>
            </div>

            {events.length > 0 ? (
              <div className="mt-8">
                <EventsExploreGrid events={events} />
              </div>
            ) : (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600">
                {`Al momento non ci sono appuntamenti in programma ${townPrep} ${city.city}. Quando Comuni e Pro Loco pubblicano sagre o concerti, li trovi sul calendario EVERAS.`}
              </p>
            )}

            <div className="mt-10">
              <Link
                href={area.path}
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
              >
                {`← Paesi del ${area.h1}`}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
