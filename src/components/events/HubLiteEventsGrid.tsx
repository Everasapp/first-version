import type { EventCardData } from "@/src/components/home/EventCard";
import HubLiteEventCard from "@/src/components/home/HubLiteEventCard";

type HubLiteEventsGridProps = {
  events: EventCardData[];
};

/**
 * Static SSR grid for `/eventi-sardegna`.
 * No client state, geolocation, infinite scroll, or full EventCard graph.
 * Events must already be ordered and capped by the hub selection helper.
 */
export default function HubLiteEventsGrid({ events }: HubLiteEventsGridProps) {
  if (events.length === 0) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <HubLiteEventCard key={event.eventId || event.id} event={event} />
      ))}
    </div>
  );
}
