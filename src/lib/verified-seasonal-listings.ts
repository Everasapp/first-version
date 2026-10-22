/**
 * Annunci stagionali già verificati, distinti dalle date delle lezioni.
 * `reviewUntilDay` è il giorno di Roma in cui la verifica editoriale scade.
 * Non è l’ultima lezione: non va copiato in `end_at` né nei metadati SEO.
 *
 * La homepage rilegge i corsi pubblicati degli ultimi 120 giorni.
 * Questa scadenza resta dentro quella finestra rispetto all’avvio reale
 * (1 ottobre 2026), così non serve una query nuova.
 */
export const VERIFIED_SEASONAL_LISTINGS = [
  {
    slug: "corso-di-salsa-cubana-e-bachata-mtemfmsq",
    reviewUntilDay: "2027-01-21",
  },
] as const;

function romeDay(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export function isVerifiedSeasonalAnnouncementOpen(
  slug: string | null | undefined,
  now: Date,
) {
  if (!slug) return false;
  const listing = VERIFIED_SEASONAL_LISTINGS.find((item) => item.slug === slug);
  if (!listing) return false;
  return romeDay(now) <= listing.reviewUntilDay;
}
