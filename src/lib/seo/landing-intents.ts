/**
 * Intent map — Phase A (temporal + hub landings).
 * Used as the single source of truth for SERP copy on these routes.
 */

export type LandingIntent = {
  path: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  h1: string;
  /** Page `title` before the root `%s | EVERAS` template (except homepage absolute). */
  seoTitle: string;
  metaDescription: string;
  canonical: string;
  clusterRole: string;
};

/** Homepage uses absolute title (no template suffix). */
export const HOME_INTENT = {
  path: "/",
  primaryKeyword: "EVERAS",
  secondaryKeywords: [
    "eventi Sardegna",
    "sagre Sardegna",
    "cose da fare in Sardegna",
  ],
  searchIntent: "Brand / discovery: capire cos’è EVERAS e iniziare a cercare.",
  h1: "EVERAS: scopri eventi e cose da fare in Sardegna",
  seoTitle: "EVERAS | Eventi, sagre e cose da fare in Sardegna",
  metaDescription:
    "EVERAS è la piattaforma per scoprire eventi, sagre, concerti, workshop e attività in tutta la Sardegna. Cerca per giorno, città o interesse.",
  canonical: "/",
  clusterRole: "Brand entry. Non compete con il hub SEO /eventi-sardegna.",
} as const satisfies LandingIntent;

export const EVENTI_CATALOG_INTENT = {
  path: "/eventi",
  primaryKeyword: "cerca eventi Sardegna",
  secondaryKeywords: ["filtra eventi", "eventi per città", "eventi per categoria"],
  searchIntent: "Esplorazione / catalogo con filtri (città, data, categoria, testo).",
  h1: "Esplora gli eventi in Sardegna",
  seoTitle: "Cerca e filtra eventi in Sardegna",
  metaDescription:
    "Esplora il catalogo EVERAS: filtra eventi in Sardegna per città, categoria e data. Concerti, sagre, mostre e appuntamenti aggiornati.",
  canonical: "/eventi",
  clusterRole: "Tool di ricerca. Query filtrate → noindex.",
} as const satisfies LandingIntent;

export const EVENTI_SARDEGNA_HUB_INTENT = {
  path: "/eventi-sardegna",
  primaryKeyword: "eventi Sardegna",
  secondaryKeywords: [
    "eventi in Sardegna",
    "cosa fare in Sardegna",
    "calendario eventi Sardegna",
  ],
  searchIntent: "Hub editoriale: panoramica di cosa fare sull’isola.",
  h1: "Eventi in Sardegna",
  seoTitle: "Eventi in Sardegna: oggi, weekend e prossimi eventi",
  metaDescription:
    "Scopri eventi, sagre, concerti, festival e attività in Sardegna. Trova cosa fare oggi, questo weekend e nelle prossime settimane su EVERAS.",
  canonical: "/eventi-sardegna",
  clusterRole: "Landing SEO principale del cluster temporale e geografico.",
} as const satisfies LandingIntent;

export const OGGI_INTENT = {
  path: "/eventi-oggi",
  primaryKeyword: "eventi Sardegna oggi",
  secondaryKeywords: ["cosa fare oggi in Sardegna", "eventi oggi Sardegna"],
  searchIntent: "Urgenza: cosa c’è in programma nella giornata odierna.",
  h1: "Eventi Sardegna oggi",
  seoTitle: "Eventi Sardegna oggi",
  metaDescription:
    "Eventi Sardegna oggi: concerti, sagre e attività aggiornati. Scopri cosa fare oggi in tutta l’isola su EVERAS.",
  canonical: "/eventi-oggi",
  clusterRole: "Nodo «oggi» del cluster temporale.",
} as const satisfies LandingIntent;

export const DOMANI_INTENT = {
  path: "/eventi-domani",
  primaryKeyword: "eventi Sardegna domani",
  secondaryKeywords: ["cosa fare domani in Sardegna", "programma eventi domani"],
  searchIntent: "Pianificazione a 24h: programma di domani.",
  h1: "Eventi Sardegna domani",
  seoTitle: "Eventi Sardegna domani",
  metaDescription:
    "Eventi Sardegna domani: spettacoli, sagre e concerti con città e orari. Pianifica la giornata su EVERAS.",
  canonical: "/eventi-domani",
  clusterRole: "Nodo «domani»; complementa oggi senza clonarne la copy.",
} as const satisfies LandingIntent;

export const WEEKEND_EVERGREEN_INTENT = {
  path: "/eventi-weekend",
  primaryKeyword: "eventi Sardegna questo weekend",
  secondaryKeywords: [
    "eventi Sardegna weekend",
    "cosa fare in Sardegna nel weekend",
  ],
  searchIntent: "Fine settimana corrente (rolling Fri–Sun).",
  h1: "Eventi Sardegna questo weekend",
  seoTitle: "Eventi Sardegna questo weekend",
  metaDescription:
    "Eventi Sardegna questo weekend: sagre, concerti, festival e attività da venerdì a domenica su EVERAS.",
  canonical: "/eventi-weekend",
  clusterRole: "Evergreen del weekend. I weekend datati supportano, non sostituiscono.",
} as const satisfies LandingIntent;

export const DOMENICA_INTENT = {
  path: "/eventi-domenica",
  primaryKeyword: "eventi Sardegna domenica",
  secondaryKeywords: [
    "cosa fare domenica in Sardegna",
    "eventi domenica Sardegna",
  ],
  searchIntent: "Solo la domenica del weekend in corso (o odierna se è già domenica).",
  h1: "Eventi Sardegna domenica",
  seoTitle: "Eventi Sardegna domenica",
  metaDescription:
    "Eventi Sardegna domenica: sagre, concerti e feste di paese della prossima domenica, con comune e orario su EVERAS.",
  canonical: "/eventi-domenica",
  clusterRole: "Nodo «domenica»; più stretto del weekend evergreen, non lo sostituisce.",
} as const satisfies LandingIntent;

export const SUD_OGGI_INTENT = {
  path: "/eventi-sud-sardegna-oggi",
  primaryKeyword: "eventi Sud Sardegna oggi",
  secondaryKeywords: [
    "eventi Cagliari oggi",
    "cosa fare oggi Sud Sardegna",
  ],
  searchIntent: "Urgenza geografica: solo oggi, solo comuni del Sud.",
  h1: "Eventi Sud Sardegna oggi",
  seoTitle: "Eventi Sud Sardegna oggi",
  metaDescription:
    "Eventi Sud Sardegna oggi: Cagliari, Campidano, Sulcis e Sarrabus. Cosa fare oggi nel Sud dell’isola su EVERAS.",
  canonical: "/eventi-sud-sardegna-oggi",
  clusterRole: "Incrocio area + oggi. Non clona Eventi Sardegna oggi.",
} as const satisfies LandingIntent;

export const CALENDARIO_2026_INTENT = {
  path: "/eventi-sardegna/2026",
  primaryKeyword: "calendario eventi Sardegna 2026",
  secondaryKeywords: [
    "eventi Sardegna 2026",
    "sagre Sardegna 2026",
    "calendario sagre Sardegna 2026",
  ],
  searchIntent:
    "Pianificazione annuale: cosa c’è in Sardegna nel 2026, mese per mese.",
  h1: "Calendario eventi Sardegna 2026",
  seoTitle: "Calendario eventi Sardegna 2026",
  metaDescription:
    "Calendario eventi in Sardegna 2026: sagre, concerti, festival e feste di paese mese per mese, con date e comuni su EVERAS.",
  canonical: "/eventi-sardegna/2026",
  clusterRole:
    "Hub annuale. I mesi e i weekend datati sono nodi figli; l’hub evergreen resta /eventi-sardegna.",
} as const satisfies LandingIntent;

export const GRATUITI_INTENT = {
  path: "/eventi-gratuiti",
  primaryKeyword: "eventi gratuiti Sardegna",
  secondaryKeywords: ["ingressi liberi Sardegna", "cose da fare gratis Sardegna"],
  searchIntent: "Selezione solo free / ingresso libero.",
  h1: "Eventi gratuiti in Sardegna",
  seoTitle: "Eventi gratuiti in Sardegna",
  metaDescription:
    "Eventi gratuiti e a ingresso libero in Sardegna: concerti, sagre e appuntamenti aggiornati su EVERAS.",
  canonical: "/eventi-gratuiti",
  clusterRole: "Filtro prezzo nel cluster; linkato da hub e date.",
} as const satisfies LandingIntent;

/**
 * Dated weekends (`/eventi-sardegna/{date-slug}`):
 * - Self-canonical (date-specific content).
 * - Never canonical → /eventi-weekend.
 * - Index only with useful events (`landingRobots`).
 * - Copy stresses “queste date”; CTAs point to evergreen weekend.
 */
export const DATED_WEEKEND_POLICY = {
  canonical: "self" as const,
  evergreenHref: "/eventi-weekend",
  evergreenLabel: "Eventi Sardegna questo weekend",
  indexRule: "landingRobots(eventCount) — noindex se 0 eventi",
};
