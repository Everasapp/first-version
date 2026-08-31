import type { EventCardData } from "@/src/components/home/EventCard";
import { resolveCategoryLabels } from "@/src/lib/event-categories";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { engagementFromRow } from "@/src/lib/event-engagement";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import type { OrganizerDirectoryPublic } from "@/src/lib/organizer-claim";

export const ORGANIZER_DIRECTORY_PUBLIC_SELECT =
  "id, name, slug, claim_status, claimed_by_profile_id, website, facebook, instagram, address, phone, public_description, public_page_enabled";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type OrganizerEventRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categories?: string[] | null;
  province: string | null;
  municipality: string;
  location_name: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  is_free: boolean;
  price_from: number | string | null;
  is_featured: boolean;
  views_count?: number | null;
  favorites_count?: number | null;
  shares_count?: number | null;
};

export function isProfileUuidParam(value: string) {
  return UUID_RE.test(value);
}

export function getOrganizerDirectoryHref(
  directory: Pick<
    OrganizerDirectoryPublic,
    "slug" | "public_page_enabled"
  > | null,
) {
  if (!directory?.public_page_enabled || !directory.slug) {
    return null;
  }
  return `/organizzatori/${directory.slug}`;
}

export function getOrganizerPublicHref(
  directory: Pick<
    OrganizerDirectoryPublic,
    "slug" | "public_page_enabled" | "claimed_by_profile_id"
  > | null,
  profileId?: string | null,
) {
  return (
    getOrganizerDirectoryHref(directory) ||
    (profileId ? `/organizzatori/${profileId}` : null)
  );
}

export function organizerKindLabel(name: string) {
  const value = name.trim().toLocaleLowerCase("it");
  if (value.startsWith("comune di ")) return "Comune";
  if (value.startsWith("pro loco")) return "Pro Loco";
  return "Organizzatore";
}

export function formatOrganizerEventDate(startAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(startAt));
}

export function toOrganizerEventCard(
  event: OrganizerEventRow,
  favoriteIds: Set<string>,
): EventCardData {
  const pricing = resolveEventPricing(event.is_free, event.price_from);
  const categoryLabels = resolveCategoryLabels(event);

  return {
    id: event.slug,
    eventId: event.id,
    title: event.title,
    category: categoryLabels[0] ?? event.category,
    categories: categoryLabels,
    date: formatOrganizerEventDate(event.start_at),
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    location: event.location_name || event.municipality,
    area: event.province ?? undefined,
    imageUrl: event.image_url ?? "/images/concert.webp",
    isFree: pricing.isFree,
    priceFrom: pricing.priceFrom,
    isFeatured: event.is_featured,
    isFavorite: favoriteIds.has(event.id),
    ...engagementFromRow(event),
  };
}

export function splitOrganizerEvents(
  events: OrganizerEventRow[],
  favoriteIds: Set<string>,
  now = new Date(),
) {
  const upcoming: EventCardData[] = [];
  const past: EventCardData[] = [];

  for (const event of events) {
    const card = toOrganizerEventCard(event, favoriteIds);
    if (isPublicEventActive(event.start_at, event.end_at, now)) {
      upcoming.push(card);
    } else {
      past.push(card);
    }
  }

  past.reverse();
  return { upcoming, past };
}

export function asHttpUrl(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
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
