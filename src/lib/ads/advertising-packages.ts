/**
 * Configurazione centrale pacchetti pubblicitari EVERAS.
 *
 * Campagna di lancio: "EVERAS Banner Campaign" — Special Launch Price
 * per i primi LAUNCH_PROMO_LIMIT clienti paganti.
 *
 * PAGAMENTO: Orders API PayPal. Il prezzo inviato a PayPal è sempre
 * final_price bloccato sull'ordine (non ricalcolato dalla config).
 */

export type AdvertisingPlacementId = "home" | "internal";

export type AdvertisingPackage = {
  id: string;
  name: string;
  placement: AdvertisingPlacementId;
  durationMonths: 3 | 6 | 12;
  /** Prezzo di listino (€). */
  listPrice: number;
  /**
   * Prezzo promozionale di lancio (€), se previsto.
   * Applicato solo finché restano slot promo (primi N clienti paganti).
   */
  promoPrice: number | null;
  currency: "EUR";
  description: string;
  /** Se true, il pacchetto è acquistabile (Orders API). */
  active: boolean;
  /**
   * Opzionale — link PayPal NCP di riferimento (NON inventare URL).
   * Il checkout ufficiale usa Orders API.
   */
  paypalPaymentLink: string | null;
};

export type AdvertisingPlacementGroup = {
  id: AdvertisingPlacementId;
  title: string;
  description: string;
  packages: AdvertisingPackage[];
};

/** Limite clienti paganti con prezzo promozionale. */
export const LAUNCH_PROMO_LIMIT = 10;

/**
 * Slot già considerati utilizzati all'avvio campagna
 * (es. primi clienti gestiti fuori sistema).
 * Il conteggio reale dei pagamenti si somma a questo valore.
 * Display iniziale: 2/10 → restano 8 promozioni (dalla 3ª alla 10ª).
 */
export const LAUNCH_PROMO_USED_OFFSET = 2;

export const LAUNCH_CAMPAIGN = {
  name: "EVERAS Banner Campaign",
  eyebrow: "Special Launch Price",
  headlineActive: "Prezzi speciali per i primi 10 clienti",
  headlineEnded: "La promozione di lancio è terminata.",
  tagline: "Special Launch Price",
} as const;

export const ADVERTISING_PACKAGES: AdvertisingPackage[] = [
  {
    id: "home-3m",
    name: "Banner Home - 3 mesi",
    placement: "home",
    durationMonths: 3,
    // Listino = promo × 1,30 arrotondato · Promo = PayPal (€60)
    listPrice: 78,
    promoPrice: 60,
    currency: "EUR",
    description: "Presenza del tuo banner sulla Home di EVERAS per 3 mesi.",
    active: true,
    // PayPal NCP: https://www.paypal.com/ncp/payment/JW4SJWAUCR8R2
    paypalPaymentLink: "https://www.paypal.com/ncp/payment/JW4SJWAUCR8R2",
  },
  {
    id: "home-6m",
    name: "Banner Home - 6 mesi",
    placement: "home",
    durationMonths: 6,
    // Listino = promo × 1,30 arrotondato · Promo = PayPal (€100)
    listPrice: 130,
    promoPrice: 100,
    currency: "EUR",
    description: "Presenza del tuo banner sulla Home di EVERAS per 6 mesi.",
    active: true,
    // PayPal NCP: https://www.paypal.com/ncp/payment/D4AQR4USK6648
    paypalPaymentLink: "https://www.paypal.com/ncp/payment/D4AQR4USK6648",
  },
  {
    id: "home-12m",
    name: "Banner Home - 12 mesi",
    placement: "home",
    durationMonths: 12,
    // Listino = promo × 1,30 arrotondato · Promo = PayPal (€180)
    listPrice: 234,
    promoPrice: 180,
    currency: "EUR",
    description: "Presenza del tuo banner sulla Home di EVERAS per 12 mesi.",
    active: true,
    // PayPal NCP: https://www.paypal.com/ncp/payment/Z2N2SEMSHAFMJ
    paypalPaymentLink: "https://www.paypal.com/ncp/payment/Z2N2SEMSHAFMJ",
  },
  {
    id: "internal-3m",
    name: "Banner pagine interne - 3 mesi",
    placement: "internal",
    durationMonths: 3,
    listPrice: 60,
    promoPrice: 40,
    currency: "EUR",
    description:
      "Presenza del tuo banner sulle pagine interne di EVERAS per 3 mesi.",
    active: true,
    // PayPal NCP: https://www.paypal.com/ncp/payment/TTRDT9MD59GMW
    paypalPaymentLink: "https://www.paypal.com/ncp/payment/TTRDT9MD59GMW",
  },
  {
    id: "internal-6m",
    name: "Banner pagine interne - 6 mesi",
    placement: "internal",
    durationMonths: 6,
    listPrice: 90,
    promoPrice: 60,
    currency: "EUR",
    description:
      "Presenza del tuo banner sulle pagine interne di EVERAS per 6 mesi.",
    active: true,
    // PayPal NCP: https://www.paypal.com/ncp/payment/2YT77ZRFWMA8E
    paypalPaymentLink: "https://www.paypal.com/ncp/payment/2YT77ZRFWMA8E",
  },
  {
    id: "internal-12m",
    name: "Banner pagine interne - 12 mesi",
    placement: "internal",
    durationMonths: 12,
    listPrice: 160,
    promoPrice: 110,
    currency: "EUR",
    description:
      "Presenza del tuo banner sulle pagine interne di EVERAS per 12 mesi.",
    active: true,
    // PayPal NCP: https://www.paypal.com/ncp/payment/M9TSSZGHYJRYJ
    paypalPaymentLink: "https://www.paypal.com/ncp/payment/M9TSSZGHYJRYJ",
  },
];

export const ADVERTISING_PLACEMENT_GROUPS: AdvertisingPlacementGroup[] = [
  {
    id: "home",
    title: "Banner Home",
    description: "Massima visibilità sulla pagina principale di EVERAS.",
    packages: ADVERTISING_PACKAGES.filter((p) => p.placement === "home"),
  },
  {
    id: "internal",
    title: "Banner pagine interne",
    description: "Una presenza continuativa nelle pagine interne di EVERAS.",
    packages: ADVERTISING_PACKAGES.filter((p) => p.placement === "internal"),
  },
];

export function getAdvertisingPackage(id: string) {
  return ADVERTISING_PACKAGES.find((pkg) => pkg.id === id) ?? null;
}

export type ResolvedPackagePricing = {
  listPrice: number;
  promoPrice: number | null;
  finalPrice: number;
  promoApplied: boolean;
};

/**
 * Determina i prezzi da bloccare sull'ordine (lato server).
 * Non usare input dal browser.
 */
export function resolvePackagePricing(
  pkg: AdvertisingPackage,
  promoActive: boolean,
): ResolvedPackagePricing {
  const listPrice = pkg.listPrice;
  if (promoActive && pkg.promoPrice != null) {
    return {
      listPrice,
      promoPrice: pkg.promoPrice,
      finalPrice: pkg.promoPrice,
      promoApplied: true,
    };
  }
  return {
    listPrice,
    promoPrice: null,
    finalPrice: listPrice,
    promoApplied: false,
  };
}

export const ADVERTISING_STEPS = [
  {
    title: "Scegli il tuo spazio",
    body: "Seleziona la posizione e la durata del tuo banner.",
  },
  {
    title: "Compila i dati e carica il banner",
    body: "Inserisci i dati dell'attività e il materiale pubblicitario.",
  },
  {
    title: "Paga e attendi la verifica",
    body: "Completa il pagamento PayPal: pubblichiamo dopo l'approvazione.",
  },
] as const;

export const ADVERTISING_FAQS = [
  {
    question: "Quanto dura la pubblicità?",
    answer:
      "La durata dipende dal pacchetto scelto: 3, 6 oppure 12 mesi.",
  },
  {
    question: "Il banner è cliccabile?",
    answer:
      "Sì. Il banner può essere collegato al sito web o alla pagina online indicata dall'inserzionista.",
  },
  {
    question: "Quando viene pubblicato il banner?",
    answer:
      "Dopo il pagamento e la verifica del materiale pubblicitario.",
  },
  {
    question: "Posso modificare il banner?",
    answer:
      "Le modalità di modifica del materiale pubblicitario saranno concordate con EVERAS.",
  },
] as const;

export type AdvertisingOrderStatus =
  | "draft"
  | "awaiting_payment"
  | "paid"
  | "awaiting_approval"
  | "needs_changes"
  | "approved"
  | "active"
  | "rejected"
  | "expired"
  | "cancelled";

/** Scadenza in mesi di calendario (stesso giorno, clamp fine mese). */
export function addCalendarMonths(from: Date, months: number): Date {
  const result = new Date(from.getTime());
  const day = result.getDate();
  result.setMonth(result.getMonth() + months);
  if (result.getDate() < day) {
    result.setDate(0);
  }
  return result;
}

export function sanitizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
