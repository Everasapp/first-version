import Link from "next/link";

import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import CulturaArticlesFeaturedGrid from "@/src/components/seo/CulturaArticlesFeaturedGrid";
import JsonLd from "@/src/components/seo/JsonLd";
import {
  CULTURA_ARTICLES,
  CULTURA_ARTICLES_HUB,
} from "@/src/lib/seo/cultura-articles";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";

type CulturaArticlesHubViewProps = {
  jsonLd: Array<Record<string, unknown>>;
};

export default function CulturaArticlesHubView({
  jsonLd,
}: CulturaArticlesHubViewProps) {
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
                { name: CULTURA_ARTICLES_HUB.h1 },
              ]}
            />

            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Approfondimenti
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {CULTURA_ARTICLES_HUB.h1}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {CULTURA_ARTICLES_HUB.description}
              </p>
              {CULTURA_ARTICLES_HUB.paragraphs.map((paragraph) => (
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
              In evidenza
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Articoli
            </h2>

            <CulturaArticlesFeaturedGrid articles={CULTURA_ARTICLES} />

            <section className="mt-16 border-t border-slate-200 pt-12">
              <h2 className="text-lg font-bold text-slate-900">
                Esplora anche
              </h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                <li>
                  <Link
                    href={CULTURE_HUB_PATH}
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                  >
                    Scopri la Sardegna
                  </Link>
                </li>
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
                    href="/eventi-sardegna/autunno-in-barbagia"
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                  >
                    Autunno in Barbagia
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
