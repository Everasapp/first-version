import {
  parseEventScheduleMode,
  type EventScheduleMode,
} from "@/src/lib/eventScheduleMode";

/** Listing contexts that decide how `schedule_mode` affects inclusion. */
export type EventTemporalContext = "daily" | "weekend" | "month" | "general";

export type EventRangeInput = {
  startAt: string;
  endAt?: string | null;
  scheduleMode?: EventScheduleMode | string | null;
};

export type DateTimeRange = {
  start: Date;
  end: Date;
};

/**
 * Half-open style overlap used across SEO landings:
 * eventStart < range.end && eventEnd >= range.start
 * Missing end_at → treated as a single instant equal to start_at.
 */
export function eventIntervalOverlapsRange(
  event: Pick<EventRangeInput, "startAt" | "endAt">,
  range: DateTimeRange,
): boolean {
  const eventStart = new Date(event.startAt);
  if (Number.isNaN(eventStart.getTime())) {
    return false;
  }
  const eventEnd = event.endAt ? new Date(event.endAt) : eventStart;
  if (Number.isNaN(eventEnd.getTime())) {
    return false;
  }
  return eventStart < range.end && eventEnd >= range.start;
}

/**
 * Whether an event should appear in a temporal listing window.
 *
 * - daily / weekend: `series` and `container` are excluded (need separate occurrence cards)
 * - month / general: all modes may appear when the interval overlaps
 *
 * Does not replace `isPublicEventActive` — apply that filter first when listing public events.
 */
export function eventAppearsInRange(
  event: EventRangeInput,
  range: DateTimeRange,
  context: EventTemporalContext,
): boolean {
  const mode = parseEventScheduleMode(event.scheduleMode);

  if (
    (context === "daily" || context === "weekend") &&
    (mode === "series" || mode === "container")
  ) {
    return false;
  }

  return eventIntervalOverlapsRange(event, range);
}

/** Map `getDateRange` filter keys to a temporal context. */
export function temporalContextForDateFilter(
  filter: string | undefined | null,
): EventTemporalContext | null {
  if (!filter) return null;
  if (filter === "weekend") return "weekend";
  // oggi | domani | domenica | settimana | YYYY-MM-DD
  return "daily";
}
