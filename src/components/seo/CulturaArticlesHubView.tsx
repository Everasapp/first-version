import Link from "next/link";
import Image from "next/image";

import type { EventCardData } from "@/src/components/home/EventCard";
import EventCard from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import ArticleFullPhoto from "@/src/components/seo/ArticleFullPhoto";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import CulturaArticlesFeaturedGrid from "@/src/components/seo/CulturaArticlesFeaturedGrid";
import CulturaSources from "@/src/components/seo/CulturaSources";
import JsonLd from "@/src/components/seo/JsonLd";
import PhotoCredit from "@/src/components/seo/PhotoCredit";
import type { CulturaArticle } from "@/src/lib/seo/cultura-articles";
import { CULTURA_ARTICLES_HUB } from "@/src/lib/seo/cultura-articles";
import {
  CULTURA_GUIDE_INDEX,
  CULTURA_PILLAR_HERO,
  CULTURA_PILLAR_SECTIONS,
  CULTURA_PILLAR_SOURCES,
} from "@/src/lib/seo/cultura-pillar";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";

type CulturaArticlesHubViewProps = {
  jsonLd: Array<Record<string, unknown>>;
  events?: EventCardData[];
  otherArticles?: CulturaArticle[];
};

export default function CulturaArticlesHubView({
  jsonLd,
  events = [],
  otherArticles = [],
}: CulturaArticlesHubViewProps) {
  const liveGuides = CULTURA_GUIDE_INDEX.filter((item) => item.phase === 1);
  const laterGuides = CULTURA_GUIDE_INDEX.filter((item) => item.phase !== 1);

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
                  { name: "Cultura sarda" },
                ]}
              />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Cultura sarda
              </p>
              <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {CULTURA_ARTICLES_HUB.h1}
              </h1>
              {CULTURA_ARTICLES_HUB.intro.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
            <ArticleFullPhoto
              src={CULTURA_PILLAR_HERO.src}
              alt={CULTURA_PILLAR_HERO.alt}
              credit={{
                author: "EVERAS",
                license: "Illustrazione originale",
                licenseUrl: "https://www.everas.it/cultura",
                sourceUrl: "https://www.everas.it/cultura",
                sourceLabel: "Cultura sarda",
                creditPrefix: "Illustrazione",
              }}
              priority
            />

            {CULTURA_PILLAR_SECTIONS.map((section, index) => {
              const imageFirst = index % 2 === 0;
              return (
                <section
                  key={section.title}
                  className="mt-14 border-t border-slate-200 pt-12"
                >
                  <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10">
                    <figure
                      className={`min-w-0 ${imageFirst ? "" : "md:order-2"}`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <figcaption>
                        <PhotoCredit credit={section.image.credit} />
                      </figcaption>
                    </figure>

                    <div
                      className={`min-w-0 ${imageFirst ? "" : "md:order-1"}`}
                    >
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
                      {section.href ? (
                        <p className="mt-5">
                          <Link
                            href={section.href}
                            className="text-sm font-bold text-[#075EAE] hover:underline"
                          >
                            {section.hrefLabel ?? "Apri la guida"} →
                          </Link>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </section>
              );
            })}

            <section className="mt-12 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Eventi collegati
              </h2>
              {events.length > 0 ? (
                <>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                    Sagre e tradizioni pubblicate sul calendario. La data sta
                    sulla scheda, non in questa guida.
                  </p>
                  <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.slice(0, 9).map((event) => (
                      <li key={event.eventId}>
                        <EventCard event={event} />
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                  In questo momento non ci sono sagre in evidenza nel
                  calendario. Puoi esplorare i paesi o{" "}
                  <Link
                    href="/pubblica"
                    className="font-semibold text-[#075EAE] hover:underline"
                  >
                    pubblicare un evento
                  </Link>{" "}
                  se lo organizzi.
                </p>
              )}
            </section>

            <section className="mt-12 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Guide di questa sezione
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                {laterGuides.length === 0
                  ? "Le guide di questa sezione sono online. Da qui si va ai comuni e al calendario, senza duplicare le schede festa già esistenti."
                  : `${liveGuides.length} testi sono online. Le altre voci restano in indice: arrivano senza duplicare queste pagine.`}
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {liveGuides.map((guide) => (
                  <li key={guide.href}>
                    <Link
                      href={guide.href}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#075EAE]"
                    >
                      <p className="font-bold text-slate-900">{guide.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {guide.blurb}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              {laterGuides.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {laterGuides.map((guide) => (
                    <li key={guide.href}>
                      <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                        Prossima: {guide.label}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            {otherArticles.length > 0 ? (
              <section className="mt-12 border-t border-slate-200 pt-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  Altri approfondimenti
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                  Personaggi, zona blu, spiagge, golf: testi autonomi, non
                  sostituti delle guide pillar.
                </p>
                <CulturaArticlesFeaturedGrid articles={otherArticles} />
              </section>
            ) : null}

            <CulturaSources sources={CULTURA_PILLAR_SOURCES} />
          </div>
        </article>

        <section className="border-t border-slate-200 bg-slate-50 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Continua
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Paesi e calendario
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
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
                  href="/eventi-sardegna"
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                >
                  Eventi e sagre
                </Link>
              </li>
              <li>
                <Link
                  href="/pubblica"
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                >
                  Pubblica un evento
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
