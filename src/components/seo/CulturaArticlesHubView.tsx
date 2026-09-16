import Image from "next/image";
import Link from "next/link";

import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import JsonLd from "@/src/components/seo/JsonLd";
import {
  CULTURA_ARTICLES,
  CULTURA_ARTICLES_HUB,
} from "@/src/lib/seo/cultura-articles";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";

type CulturaArticlesHubViewProps = {
  jsonLd: Array<Record<string, unknown>>;
};

function formatPublishedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CULTURA_ARTICLES.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={article.path}
                    className="group block overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white transition hover:border-[#075EAE]/35 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <Image
                        src={article.hero.src}
                        alt={article.hero.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="border-t border-slate-100 px-4 py-4 sm:px-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#075EAE]">
                        {formatPublishedAt(article.publishedAt)}
                      </p>
                      <h3 className="mt-1.5 text-xl font-black tracking-tight text-slate-900">
                        {article.h1}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {article.excerpt}
                      </p>
                      <span className="mt-3 inline-flex text-sm font-bold text-[#075EAE] transition group-hover:translate-x-0.5">
                        Leggi →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

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
