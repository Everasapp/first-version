import Image from "next/image";
import Link from "next/link";

import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import JsonLd from "@/src/components/seo/JsonLd";
import PhotoCredit from "@/src/components/seo/PhotoCredit";
import type { CulturaArticle } from "@/src/lib/seo/cultura-articles";
import { CULTURA_ARTICLES_HUB_PATH } from "@/src/lib/seo/cultura-articles";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";

type CulturaArticleViewProps = {
  article: CulturaArticle;
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

export default function CulturaArticleView({
  article,
  jsonLd,
}: CulturaArticleViewProps) {
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
                  { name: "Cultura Sarda", href: CULTURA_ARTICLES_HUB_PATH },
                  { name: article.h1 },
                ]}
              />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Cultura Sarda · {formatPublishedAt(article.publishedAt)}
              </p>
              <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                {article.h1}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {article.intro}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 sm:aspect-[21/9]">
                <Image
                  src={article.hero.src}
                  alt={article.hero.alt}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
              </div>
              <figcaption>
                <PhotoCredit credit={article.hero.credit} />
              </figcaption>
            </figure>

            {article.sections.map((section) => (
              <section key={section.title} className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            {article.relatedLinks && article.relatedLinks.length > 0 ? (
              <section className="mt-12 border-t border-slate-200 pt-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  Luoghi su EVERAS
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                  Apri le guide dei comuni e le pagine collegate a questo
                  approfondimento.
                </p>
                <ul className="mt-6 flex flex-wrap gap-3">
                  {article.relatedLinks.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {article.faqs.length > 0 ? (
              <section className="mt-12 border-t border-slate-200 pt-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  Domande frequenti
                </h2>
                <div className="mt-6 space-y-4">
                  {article.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
                    >
                      <summary className="cursor-pointer list-none font-bold text-slate-900">
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-base leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </article>

        <section className="border-t border-slate-200 bg-slate-50 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Continua
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Paesi, eventi e calendario
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
              Dalla zona blu ai comuni: apri le guide dell’interno o il
              calendario delle feste.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {(article.relatedLinks ?? []).map((link) => (
                <li key={`footer-${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={CULTURE_HUB_PATH}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                >
                  Scopri la Sardegna
                </Link>
              </li>
              <li>
                <Link
                  href={CULTURA_ARTICLES_HUB_PATH}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                >
                  ← Tutti gli articoli
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
