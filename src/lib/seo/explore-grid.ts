/** Cards rendered in the initial SSR HTML of EventsExploreGrid. */
export const EVENTS_EXPLORE_GRID_DEFAULT_INITIAL = 9;

/** Same event slice the explore grid shows before client “load more”. */
export function ssrVisibleExploreEvents<T>(events: readonly T[]): T[] {
  return events.slice(0, EVENTS_EXPLORE_GRID_DEFAULT_INITIAL);
}
