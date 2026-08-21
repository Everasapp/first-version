"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import EventCard, { type EventCardData } from "@/src/components/home/EventCard";
import { useUserLocation } from "@/src/hooks/useUserLocation";
import { sortEventsByProximity } from "@/src/utils/nearby-city";

type HappeningTodayProps = {
  events: EventCardData[];
};

const AUTOPLAY_MS = 4500;

const AREA_ORDER = [
  "Nord Sardegna",
  "Centro Sardegna",
  "Sud Sardegna",
] as const;

/** Alterna le tre aree dopo il ranking (data / distanza). */
function interleaveByArea(events: EventCardData[]): EventCardData[] {
  const buckets: Record<string, EventCardData[]> = {
    "Nord Sardegna": [],
    "Centro Sardegna": [],
    "Sud Sardegna": [],
  };
  const other: EventCardData[] = [];

  for (const event of events) {
    const area = event.area;
    if (area && area in buckets) {
      buckets[area].push(event);
    } else {
      other.push(event);
    }
  }

  const result: EventCardData[] = [];
  const maxLen = Math.max(
    ...AREA_ORDER.map((area) => buckets[area].length),
    0,
  );

  for (let i = 0; i < maxLen; i += 1) {
    for (const area of AREA_ORDER) {
      const next = buckets[area][i];
      if (next) result.push(next);
    }
  }

  return [...result, ...other];
}

function cardOffsetLeft(card: HTMLElement, scroller: HTMLElement) {
  return (
    card.getBoundingClientRect().left -
    scroller.getBoundingClientRect().left +
    scroller.scrollLeft
  );
}

export default function HappeningToday({ events }: HappeningTodayProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const snapRestoreTimerRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { coords, hasLocation } = useUserLocation();

  const orderedEvents = useMemo(() => {
    const ranked = coords
      ? sortEventsByProximity(events, coords.lat, coords.lng)
      : events;
    return interleaveByArea(ranked);
  }, [coords, events]);

  function scrollByCard(direction: -1 | 1, { loop = false } = {}) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-today-card]"),
    );
    if (cards.length === 0) return;

    const current = scroller.scrollLeft;
    let activeIndex = 0;

    for (let i = 0; i < cards.length; i += 1) {
      if (cardOffsetLeft(cards[i], scroller) <= current + 12) {
        activeIndex = i;
      }
    }

    let nextIndex = activeIndex + direction;
    if (loop) {
      if (nextIndex >= cards.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = cards.length - 1;
    } else {
      nextIndex = Math.max(0, Math.min(cards.length - 1, nextIndex));
    }

    const targetLeft = cardOffsetLeft(cards[nextIndex], scroller);

    if (snapRestoreTimerRef.current !== null) {
      window.clearTimeout(snapRestoreTimerRef.current);
    }
    scroller.style.scrollSnapType = "none";
    scroller.scrollTo({ left: targetLeft, behavior: "smooth" });

    snapRestoreTimerRef.current = window.setTimeout(() => {
      scroller.style.scrollSnapType = "";
      snapRestoreTimerRef.current = null;
    }, 450);
  }

  useEffect(() => {
    if (orderedEvents.length < 2 || isPaused) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      scrollByCard(1, { loop: true });
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [orderedEvents.length, isPaused]);

  // Torna all'inizio quando cambia l'ordine per distanza.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !hasLocation) return;
    scroller.scrollTo({ left: 0, behavior: "auto" });
  }, [hasLocation, orderedEvents]);

  if (orderedEvents.length === 0) {
    return null;
  }

  return (
    <section className="overflow-x-clip border-b border-slate-200 bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E67E22]">
              Lunedì – domenica
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Hot this week
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              {hasLocation
                ? "Prima gli eventi vicino a te, bilanciati tra Nord, Centro e Sud Sardegna."
                : "Gli eventi della settimana in tutta la Sardegna: Nord, Centro e Sud."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Eventi precedenti"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] active:scale-95"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Eventi successivi"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] active:scale-95"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative mt-8 min-w-0 overflow-hidden contain-paint">
          <div
            className="pointer-events-none invisible w-72 select-none pb-2 sm:w-80 lg:w-[22rem]"
            aria-hidden="true"
          >
            <EventCard event={orderedEvents[0]} />
          </div>
          <div
            ref={scrollerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="absolute inset-0 snap-x snap-proximity overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 [touch-action:pan-x_pan-y] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max max-w-none gap-6 pr-16">
              {orderedEvents.map((event) => (
                <div
                  key={event.eventId}
                  data-today-card
                  className="w-72 shrink-0 snap-start sm:w-80 lg:w-[22rem]"
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/eventi?date=settimana"
          className="mt-8 inline-flex font-bold text-[#075EAE] hover:underline"
        >
          Tutti gli eventi di questa settimana →
        </Link>
      </div>
    </section>
  );
}
