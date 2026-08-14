import Header from "@/src/components/home/Header";
import Hero from "@/src/components/home/Hero";
import HappeningToday from "@/src/components/home/HappeningToday";
import FeaturedEvents from "@/src/components/home/FeaturedEvents";
import CategoriesSection from "@/src/components/home/CategoriesSection";
import AreaSection from "@/src/components/home/AreaSection";
import type { EventCardData } from "@/src/components/home/EventCard";
import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import { formatEventDateRange } from "@/src/lib/formatEventDate";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { resolveEventStatusBadge } from "@/src/lib/eventStatusBadge";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { createClient } from "@/src/lib/supabase/server";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  province: string | null;
  municipality: string;
  location_name: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  is_free: boolean;
  price_from: number | string | null;
  is_featured: boolean;
};

function formatRomeDayKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function addDayKeys(dayKey: string, days: number) {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

/** Lunedì–domenica della settimana corrente (Europe/Rome). */
function getRomeMondaySundayKeys(now: Date) {
  const todayKey = formatRomeDayKey(now);
  const [year, month, day] = todayKey.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
  const offsetFromMonday = weekday === 0 ? 6 : weekday - 1;
  const mondayKey = addDayKeys(todayKey, -offsetFromMonday);
  const sundayKey = addDayKeys(mondayKey, 6);
  return { mondayKey, sundayKey };
}

/** Eventi con inizio nella settimana corrente lun–dom. */
function startsInRomeCalendarWeek(event: EventRow, now: Date) {
  const startKey = formatRomeDayKey(new Date(event.start_at));
  const { mondayKey, sundayKey } = getRomeMondaySundayKeys(now);
  return startKey >= mondayKey && startKey <= sundayKey;
}

function formatEventDate(startAt: string, endAt?: string | null) {
  return formatEventDateRange(startAt, endAt);
}

function getArea(event: EventRow) {
  const city = cities.find(
    (item) =>
      item.city.localeCompare(event.municipality, "it", {
        sensitivity: "base",
      }) === 0,
  );

  if (city?.area) {
    return city.area;
  }

  const province = event.province?.toUpperCase();

  if (["SS", "OT", "OLBIA-TEMPIO"].includes(province ?? "")) {
    return "Nord Sardegna";
  }

  if (["NU", "OR", "NUORO", "ORISTANO"].includes(province ?? "")) {
    return "Centro Sardegna";
  }

  return "Sud Sardegna";
}

function mapEvent(event: EventRow, now: Date = new Date()): EventCardData {
  const pricing = resolveEventPricing(event.is_free, event.price_from);
  const status = resolveEventStatusBadge(event.start_at, event.end_at, now);

  const categoryName =
    categories.find((category) => category.slug === event.category)?.name ??
    event.category;

  return {
    id: event.slug,
    eventId: event.id,
    title: event.title,
    category: categoryName,
    date: formatEventDate(event.start_at, event.end_at),
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    location: event.location_name || event.municipality,
    municipality: event.municipality,
    area: getArea(event),
    imageUrl: event.image_url ?? "/images/event-placeholder.jpg",
    isFree: pricing.isFree,
    priceFrom: pricing.priceFrom,
    isFeatured: event.is_featured,
    happeningNow: status.happeningNow,
    isActiveEvent: status.isActiveEvent,
    statusLabel: status.statusLabel,
  };
}

export default async function Home() {
  const supabase = await createClient();

  const [{ data, error }, favoriteIds] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, slug, title, category, province, municipality, location_name, start_at, end_at, image_url, is_free, price_from, is_featured",
      )
      .eq("status", "published")
      .order("start_at", { ascending: true }),
    getCurrentUserFavoriteIds(),
  ]);

  if (error) {
    console.error("Errore nel caricamento della homepage:", error);
  }

  const now = new Date();
  const rows = (data ?? []) as EventRow[];

  const events = rows
    .filter((event) =>
      isPublicEventActive(event.start_at, event.end_at, now),
    )
    .map((event) => ({
      ...mapEvent(event, now),
      isFavorite: favoriteIds.has(event.id),
    }));

  const weekEvents = rows
    .filter((event) => {
      if (!startsInRomeCalendarWeek(event, now)) {
        return false;
      }

      const status = resolveEventStatusBadge(event.start_at, event.end_at, now);
      if (status.isActiveEvent) {
        return false;
      }

      return isPublicEventActive(event.start_at, event.end_at, now);
    })
    .sort((a, b) => {
      const aStatus = resolveEventStatusBadge(a.start_at, a.end_at, now);
      const bStatus = resolveEventStatusBadge(b.start_at, b.end_at, now);
      const aRank = aStatus.happeningNow ? 0 : 1;
      const bRank = bStatus.happeningNow ? 0 : 1;
      if (aRank !== bRank) return aRank - bRank;
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (
        new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );
    })
    .map((event) => ({
      ...mapEvent(event, now),
      isFavorite: favoriteIds.has(event.id),
    }));

  return (
    <>
      <Header />

      <main>
        <HappeningToday events={weekEvents} />

        <Hero />

        <FeaturedEvents events={events} />

        <CategoriesSection />

        <AreaSection
          title="Nord Sardegna"
          area="Nord Sardegna"
          description="Dai tramonti di Alghero alle acque cristalline della Pelosa."
          image="/images/nord-sardegna.png"
          events={events}
        />

        <AreaSection
          title="Centro Sardegna"
          area="Centro Sardegna"
          description="Nel cuore della Sardegna tra montagne, borghi e tradizioni."
          image="/images/centro-sardegna.png"
          events={events}
        />

        <AreaSection
          title="Sud Sardegna"
          area="Sud Sardegna"
          description="Tra Cagliari, Chia e Villasimius, vivi il meglio del sud dell'isola."
          image="/images/sud-sardegna.png"
          events={events}
        />
      </main>
    </>
  );
}
