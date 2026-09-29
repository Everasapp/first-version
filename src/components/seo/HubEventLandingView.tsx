import Link from "next/link";
import type { ReactNode } from "react";

import HubLiteEventsGrid from "@/src/components/events/HubLiteEventsGrid";
import type { EventCardData } from "@/src/components/home/EventCard";
import EventLandingLayout, {
  HUB_COVER_IMAGE_SIZES,
  type EventLandingFaqItem,
  type EventLandingHighlightItem,
  type EventLandingLayoutProps,
  type EventLandingSectionBase,
} from "@/src/components/seo/EventLandingLayout";
import type { BreadcrumbItem } from "@/src/components/seo/Breadcrumbs";

type HubEventLandingViewProps = {
  eyebrow?: string;
  h1: string;
  subtitle?: string;
  intro: string;
  paragraphs?: string[];
  events: EventCardData[];
  resultCount?: number;
  sections?: EventLandingSectionBase[];
  errorMessage?: string | null;
  breadcrumbs: BreadcrumbItem[];
  jsonLd: Array<Record<string, unknown>>;
  faqs?: EventLandingFaqItem[];
  quickLinks?: Array<{ href: string; label: string }>;
  highlights?: EventLandingHighlightItem[];
  highlightsTitle?: string;
  relatedLinks?: Array<{ href: string; label: string }>;
  cover?: { src: string; alt: string };
  /** Hub LCP: cover should be the only high-priority image. */
  coverPriority?: boolean;
  /** Use next/image optimizer + responsive srcset for the hub cover. */
  optimizedCover?: boolean;
  coverImageSizes?: string;
  promo?: ReactNode;
};

function buildHubLiteEventsContent(
  sections: EventLandingSectionBase[] | undefined,
  events: EventCardData[],
): ReactNode {
  if (sections && sections.length > 0) {
    return sections.map((section) => (
      <section key={section.id} id={section.id} className="scroll-mt-24">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {section.title}
        </h2>
        {section.events.length > 0 ? (
          <div className="mt-5">
            <HubLiteEventsGrid events={section.events} />
            {section.cta ? (
              <div className="mt-5">
                <Link
                  href={section.cta.href}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#075EAE] transition hover:border-[#075EAE]"
                >
                  {section.cta.label}
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            {section.emptyHint ?? "Nessun evento in questa sezione al momento."}
          </p>
        )}
      </section>
    ));
  }

  if (events.length > 0) {
    return <HubLiteEventsGrid events={events} />;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <h2 className="text-xl font-bold text-slate-900">
        Nessun evento in programma
      </h2>
      <p className="mt-3 text-slate-600">
        Torna presto: aggiorniamo continuamente il calendario della Sardegna.
      </p>
      <Link
        href="/eventi"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#064a8a]"
      >
        Vedi tutti gli eventi
      </Link>
    </div>
  );
}

/**
 * `/eventi-sardegna` entry — hub-lite cards only.
 * Does not import EventsExploreGrid / EventCard / FavoriteButton / ShareEventButton.
 */
export default function HubEventLandingView({
  eyebrow,
  h1,
  subtitle,
  intro,
  paragraphs,
  events,
  resultCount,
  sections,
  errorMessage,
  breadcrumbs,
  jsonLd,
  faqs,
  quickLinks,
  highlights,
  highlightsTitle,
  relatedLinks,
  cover,
  coverPriority = true,
  optimizedCover = true,
  coverImageSizes = HUB_COVER_IMAGE_SIZES,
  promo,
}: HubEventLandingViewProps) {
  const layoutProps: Omit<EventLandingLayoutProps, "eventsContent"> = {
    eyebrow,
    h1,
    subtitle,
    intro,
    paragraphs,
    events,
    resultCount,
    errorMessage,
    breadcrumbs,
    jsonLd,
    faqs,
    quickLinks,
    highlights,
    highlightsTitle,
    relatedLinks,
    cover,
    coverPriority,
    optimizedCover,
    coverImageSizes,
    promo,
  };

  return (
    <EventLandingLayout
      {...layoutProps}
      eventsContent={buildHubLiteEventsContent(sections, events)}
    />
  );
}
