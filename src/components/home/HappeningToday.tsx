"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import MonsteraHotWeekAd from "@/src/components/ads/MonsteraHotWeekAd";
import EventCard, { type EventCardData } from "@/src/components/home/EventCard";

type HappeningTodayProps = {
  events: EventCardData[];
};

const AUTOPLAY_MS = 4500;
const INITIAL_CARDS = 6;
const BATCH_CARDS = 6;

export default function HappeningToday({ events }: HappeningTodayProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const snapRestoreTimerRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_CARDS);

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_CARDS, events.length || INITIAL_CARDS));
  }, [events]);

  const visibleEvents = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisibleCount((current) =>
          Math.min(current + BATCH_CARDS, events.length),
        );
      },
      {
        root: scrollerRef.current,
        rootMargin: "0px 320px",
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, events.length, visibleCount]);

  function scrollByCard(direction: -1 | 1, { loop = false } = {}) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-today-card]"),
    );
    if (cards.length === 0) return;

    // Batch geometry reads before any style writes (avoids layout thrashing).
    const scrollLeft = scroller.scrollLeft;
    const scrollerLeft = scroller.getBoundingClientRect().left;
    const offsets = cards.map(
      (card) =>
        card.getBoundingClientRect().left - scrollerLeft + scrollLeft,
    );

    let activeIndex = 0;
    for (let i = 0; i < offsets.length; i += 1) {
      if (offsets[i] <= scrollLeft + 12) {
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

    const targetLeft = offsets[nextIndex];

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
    if (events.length < 2 || isPaused) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    // Delay autoplay so LCP can settle on the first cards (PSI ~LCP window).
    let timer: number | null = null;
    const startId = window.setTimeout(() => {
      timer = window.setInterval(() => {
        scrollByCard(1, { loop: true });
      }, AUTOPLAY_MS);
    }, 8000);

    return () => {
      window.clearTimeout(startId);
      if (timer !== null) window.clearInterval(timer);
    };
  }, [events.length, isPaused]);

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-x-clip border-b border-slate-200 bg-slate-50 py-8 sm:py-10 xl:overflow-visible">
      <div className="relative mx-auto w-full min-w-0 max-w-7xl px-5 sm:px-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E67E22]">
              Lunedì – domenica
            </p>
            <h2 className="mt-1.5 text-2xl font-bold text-slate-900 sm:mt-2 sm:text-3xl">
              Hot this week
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-slate-600 sm:mt-2 sm:text-base">
              Prima le novità appena pubblicate, bilanciate tra Nord, Centro e
              Sud Sardegna.
              {events.length > INITIAL_CARDS ? (
                <span className="text-slate-500">
                  {" "}
                  · {events.length} eventi questa settimana — scorri per
                  vederli tutti
                </span>
              ) : null}
            </p>

            <div className="mt-3 flex items-center gap-2 xl:hidden">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Eventi precedenti"
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] active:scale-95"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Eventi successivi"
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] active:scale-95"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative z-10 hidden shrink-0 items-start gap-2 xl:flex">
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

        <MonsteraHotWeekAd />

        <div className="relative mt-5 min-w-0 sm:mt-6">
          <div
            ref={scrollerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            onPointerDown={() => setIsPaused(true)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="snap-x snap-proximity overflow-x-auto overscroll-x-contain scroll-smooth py-2 [touch-action:pan-x_pan-y] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max max-w-none items-stretch gap-6 pr-16">
              {visibleEvents.map((event, index) => (
                <div
                  key={event.eventId}
                  data-today-card
                  className="flex h-full w-72 shrink-0 snap-start sm:w-80 lg:w-[22rem]"
                >
                  <EventCard event={event} priority={index < 2} />
                </div>
              ))}
              {hasMore ? (
                <div
                  ref={sentinelRef}
                  className="flex w-12 shrink-0 items-center justify-center"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          </div>
        </div>

        <Link
          href="/eventi-sardegna"
          className="mt-8 inline-flex font-bold text-[#075EAE] hover:underline"
        >
          Eventi e sagre in Sardegna →
        </Link>
      </div>
    </section>
  );
}
