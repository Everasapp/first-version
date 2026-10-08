import type { EventCardData } from "@/src/components/home/EventCard";
import {
  parseEventScheduleMode,
  type EventScheduleMode,
} from "@/src/lib/eventScheduleMode";

export type EventPeriodRange = { start: Date; end: Date };

type PeriodSortableEvent = Pick<
  EventCardData,
  "id" | "title" | "startDate" | "endDate" | "scheduleMode"
>;

const MODE_PRIORITY: Record<EventScheduleMode, number> = {
  single: 0,
  continuous: 1,
  series: 2,
  container: 3,
};

function timestamp(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const result = new Date(value).getTime();
  return Number.isFinite(result) ? result : fallback;
}

function compareTimestamp(a: number, b: number) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function relevanceBucket(event: PeriodSortableEvent, range: EventPeriodRange) {
  const start = timestamp(event.startDate, Number.POSITIVE_INFINITY);
  const startsInRange = start >= range.start.getTime() && start < range.end.getTime();
  const mode = parseEventScheduleMode(event.scheduleMode);

  // Appuntamenti realmente datati nella finestra precedono gli intervalli
  // iniziati in passato. Il tipo editoriale risolve i pareggi senza escludere
  // serie e contenitori dalle pagine mensili o generali.
  return (startsInRange ? 0 : 4) + MODE_PRIORITY[mode];
}

export function compareEventsForPeriod(
  a: PeriodSortableEvent,
  b: PeriodSortableEvent,
  range: EventPeriodRange,
) {
  const byRelevance = relevanceBucket(a, range) - relevanceBucket(b, range);
  if (byRelevance !== 0) return byRelevance;

  const byStart = compareTimestamp(
    timestamp(a.startDate, Number.POSITIVE_INFINITY),
    timestamp(b.startDate, Number.POSITIVE_INFINITY),
  );
  if (byStart !== 0) return byStart;

  const byEnd = compareTimestamp(
    timestamp(a.endDate, Number.POSITIVE_INFINITY),
    timestamp(b.endDate, Number.POSITIVE_INFINITY),
  );
  if (byEnd !== 0) return byEnd;

  const byTitle = a.title.localeCompare(b.title, "it");
  if (byTitle !== 0) return byTitle;
  return a.id.localeCompare(b.id, "it");
}

/** Non-mutating relevance sort for today, weekend, month and dated ranges. */
export function sortEventsForPeriod<T extends PeriodSortableEvent>(
  events: readonly T[],
  range: EventPeriodRange,
): T[] {
  return [...events].sort((a, b) => compareEventsForPeriod(a, b, range));
}
