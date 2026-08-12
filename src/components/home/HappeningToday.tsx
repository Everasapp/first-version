"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import EventCard, { type EventCardData } from "@/src/components/home/EventCard";

type HappeningTodayProps = {
  events: EventCardData[];
};

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

  if (events.length === 0) {
    return null;
  }

  function scrollByCard(direction: -1 | 1) {
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

    const nextIndex = Math.max(
      0,
      Math.min(cards.length - 1, activeIndex + direction),
    );
    const targetLeft = cardOffsetLeft(cards[nextIndex], scroller);

    // Evita il conflitto noto tra scroll smooth e snap-mandatory.
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

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E67E22]">
              In tempo reale
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Accade oggi
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Eventi in programma oggi in Sardegna, da vivere adesso.
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

        <div
          ref={scrollerRef}
          className="mt-8 flex snap-x snap-proximity gap-6 overflow-x-auto scroll-smooth pb-2 pr-[calc(100%-min(85vw,22rem))] sm:pr-[calc(100%-20rem)] lg:pr-[calc(100%-22rem)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((event) => (
            <div
              key={event.eventId}
              data-today-card
              className="w-[min(85vw,22rem)] shrink-0 snap-start sm:w-[20rem] lg:w-[22rem]"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        <Link
          href="/eventi?date=oggi"
          className="mt-8 inline-flex font-bold text-[#075EAE] hover:underline"
        >
          Tutti gli eventi di oggi →
        </Link>
      </div>
    </section>
  );
}
