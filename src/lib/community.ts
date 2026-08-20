import { categories } from "@/src/data/categories";

export const COMMUNITY_INTEREST_SLUGS = categories.map((item) => item.slug);

export const SOCIAL_INTENTS = ["solo", "meet", "friends"] as const;

export type SocialIntent = (typeof SOCIAL_INTENTS)[number];

export type CommunitySummary = {
  goingCount: number;
  meetCount: number;
};

export type CommunityPreviewPerson = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  interests: string[];
  socialIntent: SocialIntent | null;
  openToMeeting: boolean;
};

export type EventRsvp = {
  eventId: string;
  userId: string;
  status: "going";
  socialIntent: SocialIntent | null;
};

export function isSocialIntent(value: string | null | undefined): value is SocialIntent {
  return value === "solo" || value === "meet" || value === "friends";
}

export function communityDisplayName(
  displayName: string | null | undefined,
  fullName: string | null | undefined,
) {
  const custom = displayName?.trim();
  if (custom) return custom;
  const first = fullName?.trim().split(/\s+/)[0];
  if (first) return first;
  return "Persona su Everas";
}

export function interestLabel(slug: string) {
  return categories.find((item) => item.slug === slug)?.name ?? slug;
}

export function sanitizeInterests(values: string[]) {
  const allowed = new Set(COMMUNITY_INTEREST_SLUGS);
  const unique: string[] = [];
  for (const value of values) {
    if (!allowed.has(value) || unique.includes(value)) continue;
    unique.push(value);
    if (unique.length >= 6) break;
  }
  return unique;
}

export function formatGoingCount(count: number) {
  if (count <= 0) return "Ancora nessuno ha detto che ci va";
  if (count === 1) return "1 persona ci va";
  return `${count} persone ci vanno`;
}

export function formatMeetCount(count: number) {
  if (count <= 0) return "";
  if (count === 1) return "1 persona è aperta a conoscere gente nuova";
  return `${count} persone sono aperte a conoscere gente nuova`;
}

export function socialIntentLabel(intent: SocialIntent | null) {
  switch (intent) {
    case "solo":
      return "Vado da solo/a";
    case "meet":
      return "Aperto/a a conoscere persone nuove";
    case "friends":
      return "Vengo con amici";
    default:
      return null;
  }
}

export function sharedInterestLabels(mine: string[], theirs: string[]) {
  const mineSet = new Set(mine);
  return theirs.filter((slug) => mineSet.has(slug)).map(interestLabel);
}
