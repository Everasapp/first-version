"use client";

import { useMemo } from "react";
import { LocateFixed, MapPin } from "lucide-react";

import EventCard, {
  type EventCardData,
} from "@/src/components/home/EventCard";
import { useUserLocation } from "@/src/hooks/useUserLocation";
import { sortEventsForExplore } from "@/src/utils/nearby-city";

type EventsExploreGridProps = {
  events: EventCardData[];
};

/**
 * Griglia Esplora / ricerca:
 * - con posizione → prima i più vicini, poi per data
 * - senza posizione → solo per data (dal più vicino a oggi)
 */
export default function EventsExploreGrid({ events }: EventsExploreGridProps) {
  const { coords, hasLocation, status, requestLocation } = useUserLocation();

  const orderedEvents = useMemo(() => {
    return sortEventsForExplore(
      events,
      hasLocation ? coords?.lat : null,
      hasLocation ? coords?.lng : null,
    );
  }, [coords?.lat, coords?.lng, events, hasLocation]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-500">
          {hasLocation ? (
            <span className="inline-flex items-center gap-1.5 text-[#075EAE]">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              Prima i più vicini a te, poi per data
            </span>
          ) : (
            "Ordinati per data (dal più vicino a oggi)"
          )}
        </p>

        {!hasLocation && status !== "unavailable" ? (
          <button
            type="button"
            onClick={requestLocation}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orderedEvents.map((event) => (
          <EventCard key={event.eventId || event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
