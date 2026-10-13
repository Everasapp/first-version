import type { EventCardData } from "@/src/components/home/EventCard";

function hash(value: string): number {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result = Math.imul(result ^ value.charCodeAt(i), 16777619);
  }
  return result >>> 0;
}

/** Stable for each 15-minute window; no extra fetches or client-side reshuffle. */
export function mixWeekEvents(events: readonly EventCardData[], now: Date): EventCardData[] {
  const seed = Math.floor(now.getTime() / (15 * 60 * 1000));
  const shuffled = [...events].sort((a, b) =>
    hash(`${seed}:${a.eventId ?? a.id}`) - hash(`${seed}:${b.eventId ?? b.id}`) || a.id.localeCompare(b.id),
  );
  const groups = new Map<string, EventCardData[]>();
  for (const event of shuffled) {
    // Ignore URL query variants of the same creative. Missing covers stay independent.
    const key = event.imageUrl?.split(/[?#]/)[0] || `event:${event.eventId ?? event.id}`;
    const group = groups.get(key) ?? [];
    group.push(event);
    groups.set(key, group);
  }
  const result: EventCardData[] = [];
  let previous = "";
  while (groups.size) {
    const available = [...groups.entries()];
    const different = available.filter(([key]) => key !== previous);
    // Largest remaining group first prevents repeated covers piling up at the end.
    const candidates = different.length ? different : available;
    candidates.sort((a, b) => b[1].length - a[1].length);
    const [key, group] = candidates[0];
    result.push(group.shift()!);
    if (!group.length) groups.delete(key);
    previous = key;
  }
  return result;
}
