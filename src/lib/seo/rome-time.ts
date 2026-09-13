/** Shared Europe/Rome calendar helpers for SEO date landings and filters. */

const ROME_TZ = "Europe/Rome";

export function romeYmd(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function addDaysYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return `${utc.getUTCFullYear()}-${String(utc.getUTCMonth() + 1).padStart(2, "0")}-${String(utc.getUTCDate()).padStart(2, "0")}`;
}

export function zonedTimeToUtc(ymd: string, time: string, timeZone = ROME_TZ) {
  const utcGuess = new Date(`${ymd}T${time}Z`);
  const inZone = new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .format(utcGuess)
    .replace(" ", "T");
  const zoneAsUtc = new Date(`${inZone}Z`);
  return new Date(
    utcGuess.getTime() - (zoneAsUtc.getTime() - utcGuess.getTime()),
  );
}

/** Inclusive civil day in Europe/Rome → half-open UTC range [start, end). */
export function romeDayRange(ymd: string) {
  return {
    start: zonedTimeToUtc(ymd, "00:00:00"),
    end: zonedTimeToUtc(addDaysYmd(ymd, 1), "00:00:00"),
  };
}

export function formatRomeLongDay(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ROME_TZ,
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
