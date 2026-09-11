import Link from "next/link";

import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import CultureTownCard from "@/src/components/seo/CultureTownCard";
import JsonLd from "@/src/components/seo/JsonLd";
import type { City } from "@/src/data/cities";
import type { CultureArea } from "@/src/lib/seo/cultura-areas";
import {
  CULTURE_AREAS,
  cultureTownPathForCity,
  groupCitiesByLetter,
} from "@/src/lib/seo/cultura-areas";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";
import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";

type CultureAreaViewProps = {
  area: CultureArea;
  cities: City[];
  featured: CultureTownArticle[];
  jsonLd: Array<Record<string, unknown>>;
};

export default function CultureAreaView({
  area,
  cities,
  featured,
  jsonLd,
}: CultureAreaViewProps) {
  const grouped = groupCitiesByLetter(cities);
  const otherAreas = CULTURE_AREAS.filter((item) => item.slug !== area.slug);

  return (
    <>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}

      <Header />

      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Cultura sarda", href: CULTURE_HUB_PATH },
                { name: area.h1 },
              ]}
            />

            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Cultura sarda
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {area.h1}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {area.description}
              </p>
              {area.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-3 text-base leading-relaxed text-slate-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {featured.length > 0 ? (
              <section>
                <p className="text-sm font-semibold text-slate-500">
                  {featured.length}{" "}
                  {featured.length === 1 ? "guida" : "guide"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  In evidenza
                </h2>
                <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((article, index) => (
                    <li key={article.slug}>
                      <CultureTownCard article={article} priority={index < 3} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className={featured.length > 0 ? "mt-16" : undefined}>
              <p className="text-sm font-semibold text-slate-500">
                {cities.length} {cities.length === 1 ? "comune" : "comuni"}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Paesi
              </h2>

              {grouped.length > 1 ? (
                <nav
                  aria-label="Indice alfabetico"
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {grouped.map(([letter]) => (
                    <a
                      key={letter}
                      href={`#lettera-${letter}`}
                      className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-sm font-bold text-[#075EAE] transition hover:border-[#075EAE]"
                    >
                      {letter}
                    </a>
                  ))}
                </nav>
              ) : null}

              <div className="mt-10 space-y-10">
                {grouped.map(([letter, towns]) => (
                  <section
                    key={letter}
                    id={`lettera-${letter}`}
                    className="scroll-mt-28"
                  >
                    <h3 className="border-b border-slate-200 pb-2 text-lg font-black text-slate-900">
                      {letter}
                    </h3>
                    <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                      {towns.map((city) => (
                        <li key={city.id}>
                          {area.townPagesLive ? (
                            <Link
                              href={cultureTownPathForCity(city)}
                              className="text-base font-semibold text-[#075EAE] transition hover:text-[#064E91]"
                            >
                              {city.city}
                            </Link>
                          ) : (
                            <span className="text-base text-slate-700">
                              {city.city}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </section>

            {area.faqs.length > 0 ? (
              <section className="mt-16 border-t border-slate-200 pt-12">
                <h2 className="text-2xl font-bold text-slate-900">
                  Domande frequenti
                </h2>
                <div className="mt-6 space-y-4">
                  {area.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
                    >
                      <summary className="cursor-pointer list-none font-bold text-slate-900">
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-12 border-t border-slate-200 pt-10">
              <h2 className="text-lg font-bold text-slate-900">
                Altre aree
              </h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {otherAreas.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={item.path}
                      className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                    >
                      {item.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
