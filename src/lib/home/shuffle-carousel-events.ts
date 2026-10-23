import type { EventCardData } from "@/src/components/home/EventCard";

function coverKey(event: EventCardData) {
  return event.imageUrl?.split(/[?#]/)[0] || `event:${event.eventId ?? event.id}`;
}

/** Browser-only caller: shuffle on mount, never during rendering or server caching. */
export function shuffleCarouselEvents(
  events: readonly EventCardData[],
  random: () => number = Math.random,
): EventCardData[] {
  const result = [...events];
  // Fisher–Yates gives every course a chance to lead, regardless of cover group size.
  for (let i = result.length - 1; i > 0; i--) {
    const other = Math.floor(random() * (i + 1));
    [result[i], result[other]] = [result[other], result[i]];
  }
  // Keep the random first card. Separate repeated covers whenever a later alternative exists.
  for (let i = 1; i < result.length; i++) {
    const previous = coverKey(result[i - 1]);
    if (coverKey(result[i]) !== previous) continue;
    const alternative = result.findIndex((event, index) => index > i && coverKey(event) !== previous);
    if (alternative !== -1) [result[i], result[alternative]] = [result[alternative], result[i]];
  }
  return result;
}
