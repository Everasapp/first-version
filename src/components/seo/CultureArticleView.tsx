import Image from "next/image";
import Link from "next/link";

import EventsExploreGrid from "@/src/components/events/EventsExploreGrid";
import type { EventCardData } from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import JsonLd from "@/src/components/seo/JsonLd";
import PhotoCredit from "@/src/components/seo/PhotoCredit";
import { cities } from "@/src/data/cities";
import { findCultureAreaByName } from "@/src/lib/seo/cultura-areas";
import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";
import { cityEventsPath } from "@/src/lib/seo/paths";

type CultureArticleViewProps = {
  article: CultureTownArticle;
  events: EventCardData[];
  jsonLd: Array<Record<string, unknown>>;
};

export default function CultureArticleView({
  article,
  events,
  jsonLd,
}: CultureArticleViewProps) {
  const eventsHref = cityEventsPath(article.town);
  const townPrep = /^[aeiouàèéìòù]/i.test(article.town) ? "ad" : "a";
  const city = cities.find(
    (item) =>
      item.city.toLocaleLowerCase("it") ===
      article.town.toLocaleLowerCase("it"),
  );
  const cultureArea = city ? findCultureAreaByName(city.area) : undefined;

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
                  ...(cultureArea
                    ? [{ name: cultureArea.h1, href: cultureArea.path }]
                    : []),
                  { name: article.town },
                ]}
              />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                {article.area} · {article.province}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
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

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">Storia</h2>
              {article.history.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600"
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">Tradizioni</h2>
              {article.traditionPhoto ? (
                <figure className="mt-6">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 sm:aspect-[21/9]">
                    <Image
                      src={article.traditionPhoto.src}
                      alt={article.traditionPhoto.alt}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      className="object-cover object-top"
                    />
                  </div>
                  <figcaption>
                    <PhotoCredit credit={article.traditionPhoto.credit} />
                  </figcaption>
                </figure>
              ) : null}
              <div className="mt-6 max-w-3xl space-y-8">
                {article.traditions.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-slate-600">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">
                Cosa visitare
              </h2>
              {article.visitPhoto ? (
                <figure className="mt-6">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 sm:aspect-[21/9]">
                    <Image
                      src={article.visitPhoto.src}
                      alt={article.visitPhoto.alt}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption>
                    <PhotoCredit credit={article.visitPhoto.credit} />
                  </figcaption>
                </figure>
              ) : null}
              <div className="mt-8 max-w-3xl space-y-8">
                {article.visit.map((place) => (
                  <div key={place.name}>
                    <h3 className="text-lg font-bold text-slate-900">
                      {place.name}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-slate-600">
                      {place.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 max-w-3xl border-t border-slate-200 pt-10">
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
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
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
                  Eventi {townPrep} {article.town}
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
                {`Al momento non ci sono appuntamenti in programma ${townPrep} ${article.town}. Quando Comuni e Pro Loco pubblicano sagre o concerti, li trovi sul calendario EVERAS.`}
              </p>
            )}

            <div className="mt-10">
              <Link
                href={cultureArea?.path ?? CULTURE_HUB_PATH}
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
              >
                {cultureArea
                  ? `← Paesi del ${cultureArea.h1}`
                  : "← Tutti i paesi"}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
