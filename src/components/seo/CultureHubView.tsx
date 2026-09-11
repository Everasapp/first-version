import Link from "next/link";

import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import CultureAreaCard from "@/src/components/seo/CultureAreaCard";
import JsonLd from "@/src/components/seo/JsonLd";
import {
  CULTURE_AREAS,
  citiesForCultureArea,
} from "@/src/lib/seo/cultura-areas";
import { CULTURE_HUB } from "@/src/lib/seo/cultura-towns";

type CultureHubViewProps = {
  jsonLd: Array<Record<string, unknown>>;
};

export default function CultureHubView({ jsonLd }: CultureHubViewProps) {
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
              items={[{ name: "Home", href: "/" }, { name: CULTURE_HUB.h1 }]}
            />

            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Musei e paesi
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {CULTURE_HUB.h1}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {CULTURE_HUB.description}
              </p>
              {CULTURE_HUB.paragraphs.map((paragraph) => (
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
            <p className="text-sm font-semibold text-slate-500">
              Nord, Centro e Sud
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Scegli l’area
            </h2>

            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CULTURE_AREAS.map((area) => (
                <li key={area.slug}>
                  <CultureAreaCard
                    area={area}
                    townCount={citiesForCultureArea(area).length}
                    priority
                  />
                </li>
              ))}
            </ul>

            <section className="mt-16 border-t border-slate-200 pt-12">
              <h2 className="text-2xl font-bold text-slate-900">
                Domande frequenti
              </h2>
              <div className="mt-6 space-y-4">
                {CULTURE_HUB.faqs.map((faq) => (
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

            <section className="mt-12 border-t border-slate-200 pt-10">
              <h2 className="text-lg font-bold text-slate-900">
                Esplora anche
              </h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                <li>
                  <Link
                    href="/eventi-sardegna"
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                  >
                    Eventi e sagre
                  </Link>
                </li>
                <li>
                  <Link
                    href="/eventi/sagre-tradizioni"
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                  >
                    Sagre e tradizioni
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
