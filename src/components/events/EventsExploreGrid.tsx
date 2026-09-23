"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, LocateFixed, MapPin } from "lucide-react";

import EventCard, {
  type EventCardData,
} from "@/src/components/home/EventCard";
import { useUserLocation } from "@/src/hooks/useUserLocation";
import {
  sortEventsByProximity,
  sortEventsByUpcomingDate,
} from "@/src/utils/nearby-city";

type EventsExploreGridProps = {
  events: EventCardData[];
  /** Card renderizzate al primo paint (sopra la piega). */
  initialCount?: number;
  /** Quante card aggiungere a ogni “pagina” allo scroll. */
  batchSize?: number;
};

const DEFAULT_INITIAL = 9;
const DEFAULT_BATCH = 9;

/**
 * Griglia Esplora / ricerca:
 * - di default → per data (dal più vicino a oggi)
 * - «Ordina vicino a me» → prima i più vicini (opt-in)
 * - render progressivo: altre card solo quando il sentinello entra in viewport
 */
export default function EventsExploreGrid({
  events,
  initialCount = DEFAULT_INITIAL,
  batchSize = DEFAULT_BATCH,
}: EventsExploreGridProps) {
  const { coords, hasLocation, status, requestLocation } = useUserLocation();
  const [sortByNearby, setSortByNearby] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const useNearby =
    sortByNearby &&
    hasLocation &&
    typeof coords?.lat === "number" &&
    typeof coords?.lng === "number";

  const orderedEvents = useMemo(() => {
    if (useNearby && coords) {
      return sortEventsByProximity(events, coords.lat, coords.lng);
    }
    return sortEventsByUpcomingDate(events);
  }, [coords, events, useNearby]);

  // Reset window when the list or sort mode changes.
  useEffect(() => {
    setVisibleCount(Math.min(initialCount, orderedEvents.length || initialCount));
  }, [orderedEvents, initialCount, useNearby]);

  const visibleEvents = orderedEvents.slice(0, visibleCount);
  const hasMore = visibleCount < orderedEvents.length;
  const remaining = orderedEvents.length - visibleCount;

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisibleCount((current) =>
          Math.min(current + batchSize, orderedEvents.length),
        );
      },
      {
        root: null,
        rootMargin: "400px 0px",
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, batchSize, orderedEvents.length, visibleCount]);

  function handleSortNearby() {
    setSortByNearby(true);
    if (!hasLocation) {
      requestLocation();
    }
  }

  function loadMore() {
    setVisibleCount((current) =>
      Math.min(current + batchSize, orderedEvents.length),
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-500">
          {useNearby ? (
            <span className="inline-flex items-center gap-1.5 text-[#075EAE]">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              Prima i più vicini a te, poi per data
            </span>
          ) : (
            "Ordinati per data (dal più vicino a oggi)"
          )}
          {orderedEvents.length > initialCount ? (
            <span className="text-slate-400">
              {" "}
              · {Math.min(visibleCount, orderedEvents.length)} di{" "}
              {orderedEvents.length}
            </span>
          ) : null}
        </p>

        <div className="flex flex-wrap gap-2">
          {useNearby ? (
            <button
              type="button"
              onClick={() => setSortByNearby(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
            >
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              Ordina per data
            </button>
          ) : status !== "unavailable" ? (
            <button
              type="button"
              onClick={handleSortNearby}
              disabled={status === "prompting"}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#075EAE]/25 bg-[#075EAE]/5 px-4 py-2 text-sm font-bold text-[#075EAE] transition hover:bg-[#075EAE]/10 disabled:opacity-60"
            >
              <LocateFixed aria-hidden="true" className="h-4 w-4" />
              {status === "prompting"
                ? "Rilevo posizione…"
                : "Ordina vicino a me"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleEvents.map((event, index) => (
          <EventCard
            key={event.eventId || event.id}
            event={event}
            priority={index < 3}
          />
        ))}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="mt-8 flex flex-col items-center gap-3">
          <p className="text-sm text-slate-500" aria-live="polite">
            Altri {remaining} eventi in caricamento…
          </p>
          <button
            type="button"
            onClick={loadMore}
            className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#075EAE] transition hover:border-[#075EAE]"
          >
            Mostra altri eventi
          </button>
        </div>
      ) : null}
    </div>
  );
}
