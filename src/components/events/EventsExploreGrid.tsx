"use client";

import { useMemo, useState } from "react";
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
};

/**
 * Griglia Esplora / ricerca:
 * - di default → per data (dal più vicino a oggi)
 * - «Ordina vicino a me» → prima i più vicini (opt-in)
 */
export default function EventsExploreGrid({ events }: EventsExploreGridProps) {
  const { coords, hasLocation, status, requestLocation } = useUserLocation();
  const [sortByNearby, setSortByNearby] = useState(false);

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

  function handleSortNearby() {
    setSortByNearby(true);
    if (!hasLocation) {
      requestLocation();
    }
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
        {orderedEvents.map((event) => (
          <EventCard key={event.eventId || event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
