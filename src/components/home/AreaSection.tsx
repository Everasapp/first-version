"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import EventCard, { type EventCardData } from "./EventCard";
import type { City } from "@/src/data/cities";
import { sortEventsByUpcomingDate } from "@/src/utils/nearby-city";

type AreaSectionProps = {
  title: string;
  area: City["area"];
  description: string;
  image: string;
  events?: EventCardData[];
};

const areaSlugs: Record<string, string> = {
  "Nord Sardegna": "nord-sardegna",
  "Centro Sardegna": "centro-sardegna",
  "Sud Sardegna": "sud-sardegna",
};

const AUTOPLAY_MS = 4500;

function cardOffsetLeft(card: HTMLElement, scroller: HTMLElement) {
  return (
    card.getBoundingClientRect().left -
    scroller.getBoundingClientRect().left +
    scroller.scrollLeft
  );
}

export default function AreaSection({
  title,
  area,
  description,
  image,
  events = [],
}: AreaSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const snapRestoreTimerRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const areaEvents = useMemo(() => {
    const filtered = events.filter((event) => event.area === area);
    return sortEventsByUpcomingDate(filtered);
  }, [area, events]);

  function scrollByCard(direction: -1 | 1, { loop = false } = {}) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-area-card]"),
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
    if (areaEvents.length < 2 || isPaused) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      scrollByCard(1, { loop: true });
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [areaEvents.length, isPaused]);

  if (areaEvents.length === 0) {
    return null;
  }

  const areaHref = `/eventi?area=${areaSlugs[area] ?? ""}`;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative h-56 overflow-hidden rounded-[32px] sm:h-72">
          <Image
            src={image}
            alt={title}
            title={title}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

          <div className="absolute inset-0 flex max-w-2xl flex-col justify-end p-6 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
              Esplora il territorio
            </p>

            <h2 className="mt-2 text-3xl font-black text-white sm:text-5xl">
              {title}
            </h2>

            <p className="mt-3 text-sm text-white/85 sm:text-lg">
              {description}
            </p>

            <Link
              href={areaHref}
              className="mt-5 inline-flex w-fit rounded-2xl bg-white px-5 py-3 font-bold text-[#075EAE] transition hover:bg-slate-100"
            >
              Scopri tutti →
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-500">
            {areaEvents.length}{" "}
            {areaEvents.length === 1 ? "evento" : "eventi"}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label={`Eventi precedenti ${title}`}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] active:scale-95"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label={`Eventi successivi ${title}`}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] active:scale-95"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="mt-5 flex min-w-0 snap-x snap-proximity gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 pr-[calc(100%-min(85vw,22rem))] sm:pr-[calc(100%-20rem)] lg:pr-[calc(100%-22rem)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {areaEvents.map((event) => (
            <div
              key={event.eventId || event.id}
              data-area-card
              className="w-[min(85vw,22rem)] shrink-0 snap-start sm:w-[20rem] lg:w-[22rem]"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
