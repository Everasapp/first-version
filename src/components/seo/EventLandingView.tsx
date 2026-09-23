import Link from "next/link";
import { Search } from "lucide-react";

import EventsExploreGrid from "@/src/components/events/EventsExploreGrid";
import type { EventCardData } from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/src/components/seo/Breadcrumbs";
import FaqAnswer from "@/src/components/seo/FaqAnswer";
import JsonLd from "@/src/components/seo/JsonLd";

type FaqItem = { question: string; answer: string };

type EventLandingSection = {
  id: string;
  title: string;
  events: EventCardData[];
  emptyHint?: string;
};

type HighlightItem = {
  href: string;
  label: string;
  meta?: string;
};

type ScheduleRow = {
  datesLabel: string;
  place: string;
  href?: string;
  note?: string;
};

type EventLandingViewProps = {
  eyebrow?: string;
  h1: string;
  subtitle?: string;
  intro: string;
  paragraphs?: string[];
  events: EventCardData[];
  /** When the grid is capped, pass the full matching total so the badge stays truthful. */
  resultCount?: number;
  sections?: EventLandingSection[];
  errorMessage?: string | null;
  breadcrumbs: BreadcrumbItem[];
  jsonLd: Array<Record<string, unknown>>;
  faqs?: FaqItem[];
  quickLinks?: Array<{ href: string; label: string }>;
  highlights?: HighlightItem[];
  highlightsTitle?: string;
  scheduleRows?: ScheduleRow[];
  scheduleTitle?: string;
  relatedLinks?: Array<{ href: string; label: string }>;
  cover?: { src: string; alt: string };
  /**
   * Cards rendered in the initial SSR HTML per EventsExploreGrid.
   * Omit to keep the grid default (9). Hub pages may raise this for crawlability.
   */
  eventsGridInitialCount?: number;
};

export default function EventLandingView({
  eyebrow = "Eventi in Sardegna",
  h1,
  subtitle,
  intro,
  paragraphs = [],
  events,
  resultCount,
  sections,
  errorMessage,
  breadcrumbs,
  jsonLd,
  faqs = [],
  quickLinks = [],
  highlights = [],
  highlightsTitle = "Da non perdere",
  scheduleRows = [],
  scheduleTitle = "Calendario tappe",
  relatedLinks = [],
  cover,
  eventsGridInitialCount,
}: EventLandingViewProps) {
  const hasSections = Boolean(sections && sections.length > 0);
  const listedCount = resultCount ?? events.length;

  return (
    <>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}

      <Header />

      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
            <Breadcrumbs items={breadcrumbs} />

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                  {eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  {h1}
                </h1>
              </div>

              <Link
                href="/#ricerca"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:bg-[#064a8a]"
              >
                <Search aria-hidden="true" className="h-4 w-4" />
                Nuova ricerca
              </Link>
            </div>

            {cover ? (
              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                {/* Same-origin generated asset; skip next/image optimization. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover.src}
                  alt={cover.alt}
                  width={1200}
                  height={630}
                  className="h-auto w-full bg-white"
                />
              </div>
            ) : null}

            <div className="mt-6 max-w-3xl">
              {subtitle ? (
                <p className="text-lg font-medium leading-snug text-slate-800">
                  {subtitle}
                </p>
              ) : null}
              <p
                className={`${subtitle ? "mt-3" : ""} text-base leading-relaxed text-slate-600`}
              >
                {intro}
              </p>
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-3 text-base leading-relaxed text-slate-600"
                >
                  {paragraph}
                </p>
              ))}
              <p className="mt-3 text-sm font-semibold text-slate-500">
                {listedCount}{" "}
                {listedCount === 1 ? "evento trovato" : "eventi trovati"}
                {resultCount !== undefined && resultCount > events.length
                  ? ` · ${events.length} in evidenza qui sotto`
                  : null}
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {errorMessage ? (
              <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                Non è stato possibile caricare gli eventi: {errorMessage}
              </div>
            ) : null}

            {quickLinks.length > 0 ? (
              <nav
                aria-label="Collegamenti rapidi"
                className="mb-8 flex flex-wrap gap-2"
              >
                {quickLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ) : null}

            {highlights.length > 0 ? (
              <section className="mb-10" aria-labelledby="landing-highlights">
                <h2
                  id="landing-highlights"
                  className="text-xl font-bold text-slate-900 sm:text-2xl"
                >
                  {highlightsTitle}
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        className="flex flex-col rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-[#075EAE]/40 hover:shadow-sm"
                      >
                        <span className="font-bold text-slate-900">
                          {item.label}
                        </span>
                        {item.meta ? (
                          <span className="mt-0.5 text-sm text-slate-500">
                            {item.meta}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {scheduleRows.length > 0 ? (
              <section className="mb-10" aria-labelledby="landing-schedule">
                <h2
                  id="landing-schedule"
                  className="text-xl font-bold text-slate-900 sm:text-2xl"
                >
                  {scheduleTitle}
                </h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Date
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Paese
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Scheda
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleRows.map((row) => (
                        <tr
                          key={`${row.datesLabel}-${row.place}-${row.href ?? row.note ?? ""}`}
                          className="border-t border-slate-100"
                        >
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                            {row.datesLabel}
                          </td>
                          <td className="px-4 py-3 text-slate-700">{row.place}</td>
                          <td className="px-4 py-3">
                            {row.href ? (
                              <Link
                                href={row.href}
                                className="font-semibold text-[#075EAE] hover:underline"
                              >
                                {row.note ?? "Apri evento"}
                              </Link>
                            ) : (
                              <span className="text-slate-500">
                                {row.note ?? "In aggiornamento"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            <div id="elenco-eventi" className="scroll-mt-24 space-y-12">
              {hasSections ? (
                sections!.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {section.title}
                    </h2>
                    {section.events.length > 0 ? (
                      <div className="mt-5">
                        <EventsExploreGrid
                          events={section.events}
                          initialCount={eventsGridInitialCount}
                        />
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-600">
                        {section.emptyHint ??
                          "Nessun evento in questa sezione al momento."}
                      </p>
                    )}
                  </section>
                ))
              ) : events.length > 0 ? (
                <EventsExploreGrid
                  events={events}
                  initialCount={eventsGridInitialCount}
                />
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
                  <h2 className="text-xl font-bold text-slate-900">
                    Nessun evento in programma
                  </h2>
                  <p className="mt-3 text-slate-600">
                    Torna presto: aggiorniamo continuamente il calendario della
                    Sardegna.
                  </p>
                  <Link
                    href="/eventi"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#064a8a]"
                  >
                    Vedi tutti gli eventi
                  </Link>
                </div>
              )}
            </div>

            {faqs.length > 0 ? (
              <section className="mt-16 border-t border-slate-200 pt-12">
                <h2 className="text-2xl font-bold text-slate-900">
                  Domande frequenti
                </h2>
                <div className="mt-6 space-y-4">
                  {faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
                    >
                      <summary className="cursor-pointer list-none font-bold text-slate-900">
                        {faq.question}
                      </summary>
                      <FaqAnswer text={faq.answer} />
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedLinks.length > 0 ? (
              <section className="mt-12 border-t border-slate-200 pt-10">
                <h2 className="text-lg font-bold text-slate-900">
                  Esplora anche
                </h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {relatedLinks.map((link) => (
                    <li key={link.href}>
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
          </div>
        </section>
      </main>
    </>
  );
}
