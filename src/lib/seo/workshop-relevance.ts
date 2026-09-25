import type { EventCardData } from "@/src/components/home/EventCard";

/**
 * Relevance filter for the `/eventi/workshop-corsi` landing only.
 * Does not change DB categories.
 *
 * Formative cues are read from the **title** only: category labels always
 * contain “corsi” for this slug and would otherwise keep every mistag.
 */

const FORMATIVE =
  /\b(workshop|workshops|corsi|corso|laboratori|laboratorio|lezioni|lezione|seminari|seminario|masterclass|masterclasses|formativ[oaie]|impara(?:re)?|training|labs?)\b/i;

const HARD_NOISE =
  /\b(sagra|sagre|festa del borgo|feste di paese|festa di paese|cortes apertas|presentazione del libro|presentazione libro|concerto|concerti|dj\s*set|djset)\b/i;

/** True when the event is suitable for the corsi/workshop SEO landing. */
export function isWorkshopRelevantEvent(input: {
  title: string;
  category?: string;
  categories?: string[];
}): boolean {
  const title = input.title?.trim() ?? "";
  if (!title) return false;

  const hasFormative = FORMATIVE.test(title);

  if (HARD_NOISE.test(title) && !hasFormative) {
    return false;
  }

  if (!hasFormative) {
    return false;
  }

  return true;
}

export function filterWorkshopRelevantEvents(
  events: EventCardData[],
): EventCardData[] {
  return events.filter((event) =>
    isWorkshopRelevantEvent({
      title: event.title,
      category: event.category,
      categories: event.categories,
    }),
  );
}

type Tipologia = { key: string; label: string; match: RegExp };

const TIPOLOGIE: Tipologia[] = [
  {
    key: "danza",
    label: "corsi di danza",
    match: /\b(salsa|bachata|danza|ballo|cubana)\b/i,
  },
  {
    key: "foto",
    label: "workshop fotografici",
    match: /\b(fotograf|fotografa|fotografia|photo)\b/i,
  },
  {
    key: "scrittura",
    label: "laboratori di scrittura",
    match: /\b(scrittura|scrittiv|narra)\b/i,
  },
  {
    key: "creativi",
    label: "corsi e workshop creativi",
    match: /\b(creativ|pittura|ceramica|teatro)\b/i,
  },
  {
    key: "laboratori",
    label: "laboratori",
    match: /\b(laboratori|laboratorio)\b/i,
  },
  {
    key: "seminari",
    label: "seminari e incontri formativi",
    match: /\b(seminari|seminario|masterclass|formativ)\b/i,
  },
];

/** Labels for tipologies that appear at least once in the filtered set. */
export function workshopTipologiePresent(events: EventCardData[]): string[] {
  const found: string[] = [];
  for (const tipo of TIPOLOGIE) {
    if (events.some((event) => tipo.match.test(event.title))) {
      found.push(tipo.label);
    }
  }
  return found;
}
