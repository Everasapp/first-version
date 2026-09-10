import { resolveEventPricing } from "@/src/lib/eventPricing";

export function formatEventAdmission(
  isFree: boolean | string | number | null | undefined,
  priceFrom: number | string | null | undefined,
  ticketUrl?: string | null,
) {
  const pricing = resolveEventPricing(isFree, priceFrom);
  const hasTicket = Boolean(ticketUrl?.trim());

  if (pricing.isFree) {
    return {
      label: "Ingresso gratuito",
      detail: hasTicket
        ? "L’ingresso è gratuito. Può essere richiesta una prenotazione sul sito dell’organizzatore."
        : "L’ingresso è gratuito, senza biglietto.",
      ctaLabel: hasTicket ? "Prenota" : null,
    };
  }

  if (pricing.priceFrom !== undefined) {
    const amount = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(pricing.priceFrom);
    return {
      label: `Da ${amount}`,
      detail: hasTicket
        ? `Ingresso a pagamento, da ${amount}. I biglietti si acquistano sul sito dell’organizzatore.`
        : `Ingresso a pagamento, da ${amount}.`,
      ctaLabel: hasTicket ? "Acquista il biglietto" : null,
    };
  }

  return {
    label: "A pagamento",
    detail: hasTicket
      ? "Ingresso a pagamento. Prezzi e biglietti sul sito dell’organizzatore."
      : "Ingresso a pagamento. Controlla prezzi e prenotazioni con l’organizzatore.",
    ctaLabel: hasTicket ? "Acquista il biglietto" : null,
  };
}

export function formatHowToArrive(input: {
  locationName?: string | null;
  address?: string | null;
  municipality: string;
  province?: string | null;
}) {
  const city = input.municipality.trim();
  const venue = (input.locationName || "").trim() || city;
  const address = (input.address || "").trim();
  const province = (input.province || "").trim();
  const lower = (value: string) => value.toLocaleLowerCase("it");
  const venueIsCity = lower(venue) === lower(city);
  const addressIsCity = Boolean(address) && lower(address) === lower(city);
  const sameVenueAndAddress =
    Boolean(address) && lower(address) === lower(venue);

  const sentences: string[] = [];

  if (!venueIsCity) {
    sentences.push(`L’evento si svolge presso ${venue} a ${city}.`);
  } else {
    sentences.push(`L’evento si svolge a ${city}.`);
  }

  if (address && !addressIsCity && !sameVenueAndAddress) {
    const placeLine = [city, province].filter(Boolean).join(", ");
    sentences.push(`Indirizzo: ${address}${placeLine ? `, ${placeLine}` : ""}.`);
  }

  sentences.push(
    "Apri Google Maps per il percorso in auto, a piedi o con i mezzi pubblici.",
  );

  return sentences.join(" ");
}
