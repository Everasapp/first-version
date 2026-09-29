/**
 * Editorial calendar mode for an event listing.
 * Controls whether long intervals appear on oggi / weekend landings.
 */
export type EventScheduleMode =
  | "single"
  | "continuous"
  | "series"
  | "container";

export const EVENT_SCHEDULE_MODES: readonly EventScheduleMode[] = [
  "single",
  "continuous",
  "series",
  "container",
] as const;

export type EventScheduleModeOption = {
  value: EventScheduleMode;
  label: string;
  description: string;
};

export const EVENT_SCHEDULE_MODE_OPTIONS: readonly EventScheduleModeOption[] = [
  {
    value: "single",
    label: "Singolo appuntamento",
    description:
      "Un evento che si svolge nella data o nell’intervallo indicato.",
  },
  {
    value: "continuous",
    label: "Evento continuativo",
    description:
      "L’evento è realmente disponibile durante tutti i giorni compresi tra inizio e fine, per esempio una mostra.",
  },
  {
    value: "series",
    label: "Rassegna con date separate",
    description:
      "La pagina descrive una rassegna, ma i singoli appuntamenti devono avere schede separate. Non apparirà automaticamente in «oggi» o «weekend».",
  },
  {
    value: "container",
    label: "Contenitore o stagione",
    description:
      "Pagina generale di una stagione, un calendario o una manifestazione con più tappe. Non apparirà automaticamente in «oggi» o «weekend».",
  },
] as const;

const MODE_SET = new Set<string>(EVENT_SCHEDULE_MODES);

/** Safe parse for DB / form values; unknown or empty → `single`. */
export function parseEventScheduleMode(
  value: string | null | undefined,
): EventScheduleMode {
  if (typeof value === "string" && MODE_SET.has(value)) {
    return value as EventScheduleMode;
  }
  return "single";
}

export function eventScheduleModeLabel(mode: EventScheduleMode): string {
  return (
    EVENT_SCHEDULE_MODE_OPTIONS.find((option) => option.value === mode)
      ?.label ?? "Singolo appuntamento"
  );
}

/** True when Google Event markup with start/end interval is appropriate. */
export function scheduleModeUsesEventSchema(mode: EventScheduleMode): boolean {
  return mode === "single" || mode === "continuous";
}
