/** Only source-confirmed registration deadlines; never infer these from start dates.
 * Entries expire automatically. Add or revise them only after checking the organizer.
 */
const sourceUrl = "https://www.comune.santateresagallura.ss.it/it/news/corsi-di-inglese-di-livello-base-intermedio-e-avanzato";
const santaTeresaDeadline = {
  closesAt: "2026-10-30T23:59:59.999+01:00",
  label: "30 ottobre 2026",
  sourceUrl,
  verifiedOn: "2026-10-23",
  timeSpecified: false,
} as const;

export const COURSE_REGISTRATION_DEADLINES: Readonly<Record<string, typeof santaTeresaDeadline>> = {
  "inglese-base-santa-teresa-gallura-2026-2027": santaTeresaDeadline,
  "inglese-intermedio-santa-teresa-gallura-2026-2027": santaTeresaDeadline,
  "inglese-avanzato-santa-teresa-gallura-2026-2027": santaTeresaDeadline,
};

export function getCourseDeadline(slug: string, now: Date = new Date()) {
  const deadline = COURSE_REGISTRATION_DEADLINES[slug];
  if (!deadline) return undefined;
  const remaining = new Date(deadline.closesAt).getTime() - now.getTime();
  // End-of-day is only the display cutoff when no submission hour is published.
  return remaining >= 0 && remaining <= 30 * 24 * 60 * 60 * 1000 ? deadline : undefined;
}
