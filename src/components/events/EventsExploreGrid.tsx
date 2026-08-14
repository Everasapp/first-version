"use client";

import { useMemo } from "react";

import EventCard, {
  type EventCardData,
} from "@/src/components/home/EventCard";
import { useUserLocation } from "@/src/hooks/useUserLocation";
import { sortEventsByDateThenProximity } from "@/src/utils/nearby-city";

type EventsExploreGridProps = {
  events: EventCardData[];
};

/**
 * Griglia Esplora: data (dal più vicino a oggi),
 * poi vicinanza se la posizione è stata accettata.
 */
export default function EventsExploreGrid({ events }: EventsExploreGridProps) {
  const { coords, hasLocation } = useUserLocation();

  const orderedEvents = useMemo(() => {
    return sortEventsByDateThenProximity(
      events,
      hasLocation ? coords?.lat : null,
      hasLocation ? coords?.lng : null,
    );
  }, [coords?.lat, coords?.lng, events, hasLocation]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {orderedEvents.map((event) => (
        <EventCard key={event.eventId || event.id} event={event} />
      ))}
    </div>
  );
}
