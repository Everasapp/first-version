import Link from "next/link";
import { Search } from "lucide-react";

import EventsExploreGrid from "@/src/components/events/EventsExploreGrid";
import type { EventCardData } from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/src/components/seo/Breadcrumbs";
import JsonLd from "@/src/components/seo/JsonLd";

type FaqItem = { question: string; answer: string };

type EventLandingViewProps = {
  eyebrow?: string;
  h1: string;
  intro: string;
  events: EventCardData[];
  errorMessage?: string | null;
  breadcrumbs: BreadcrumbItem[];
  jsonLd: Array<Record<string, unknown>>;
  faqs?: FaqItem[];
  relatedLinks?: Array<{ href: string; label: string }>;
};

export default function EventLandingView({
  eyebrow = "Eventi in Sardegna",
  h1,
  intro,
  events,
  errorMessage,
  breadcrumbs,
  jsonLd,
  faqs = [],
  relatedLinks = [],
}: EventLandingViewProps) {
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
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  {intro}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  {events.length}{" "}
                  {events.length === 1 ? "evento trovato" : "eventi trovati"}
                </p>
              </div>

              <Link
                href="/#ricerca"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:bg-[#064a8a]"
              >
                <Search aria-hidden="true" className="h-4 w-4" />
                Nuova ricerca
              </Link>
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

            {events.length > 0 ? (
              <EventsExploreGrid events={events} />
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
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
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
