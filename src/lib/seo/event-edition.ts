import { eventCategorySlugs } from "@/src/lib/event-categories";
import { isPublicEventActive } from "@/src/lib/eventActive";

type EventEditionCandidate = {
  id: string;
  slug: string | null;
  title: string;
  category?: string | null;
  categories?: string[] | null;
  municipality: string | null;
  start_at: string;
  end_at?: string | null;
};

function normalizeComparableText(value: string) {
  return value
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
/**
 * Conservative identity for annual editions of the same event.
 * Removes only explicit year / edition markers, never generic title words.
 */
export function eventEditionTitleKey(title: string) {
  return normalizeComparableText(
    title
      .replace(/\b(?:19|20)\d{2}\b/g, " ")
      .replace(
        /\b(?:\d{1,3}|[ivxlcdm]+)(?:\s*[ªºa])?\s*(?:edizione|edition|ed\.?)(?=\s|$)/gi,
        " ",
      )
      .replace(
        /\b(?:edizione|edition|ed\.?)\s*(?:n\.?\s*)?(?:\d{1,3}|[ivxlcdm]+)(?:\s*[ªºa])?\b/gi,
        " ",
      ),
  );
}

function sameMunicipality(left: string | null, right: string | null) {
  const leftKey = normalizeComparableText(left ?? "");
  const rightKey = normalizeComparableText(right ?? "");
  return leftKey.length > 0 && leftKey === rightKey;
}

function sharesCategory(
  current: Pick<EventEditionCandidate, "category" | "categories">,
  candidate: Pick<EventEditionCandidate, "category" | "categories">,
) {
  const currentSlugs = new Set(eventCategorySlugs(current));
  return eventCategorySlugs(candidate).some((slug) => currentSlugs.has(slug));
}

/**
 * Finds a later, currently public edition only when title, city and category
 * all match. This intentionally prefers false negatives over incorrect links.
 */
export function findNextEventEdition(
  current: EventEditionCandidate,
  candidates: EventEditionCandidate[],
  now = new Date(),
): EventEditionCandidate | null {
  const currentKey = eventEditionTitleKey(current.title);
  const currentStart = new Date(current.start_at).getTime();

  if (currentKey.length < 5 || !Number.isFinite(currentStart)) return null;

  return (
    candidates
      .filter((candidate) => {
        if (
          candidate.id === current.id ||
          !candidate.slug ||
          eventEditionTitleKey(candidate.title) !== currentKey ||
          !sameMunicipality(candidate.municipality, current.municipality) ||
          !sharesCategory(current, candidate) ||
          !isPublicEventActive(candidate.start_at, candidate.end_at, now)
        ) {
          return false;
        }

        const candidateStart = new Date(candidate.start_at).getTime();
        return Number.isFinite(candidateStart) && candidateStart > currentStart;
      })
      .sort(
        (left, right) =>
          new Date(left.start_at).getTime() -
          new Date(right.start_at).getTime(),
      )[0] ?? null
  );
}

