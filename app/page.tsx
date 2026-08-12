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

function isHappeningOnRomeDay(event: EventRow, dayKey: string) {
  const startKey = formatRomeDayKey(new Date(event.start_at));
  const endKey = formatRomeDayKey(new Date(event.end_at || event.start_at));
  return startKey <= dayKey && endKey >= dayKey;
}

function isHappeningNow(event: EventRow, now: Date) {
  const start = new Date(event.start_at).getTime();
  const end = new Date(event.end_at || event.start_at).getTime();
  const current = now.getTime();
  return current >= start && current <= end;
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

function mapEvent(
  event: EventRow,
  options?: { happeningNow?: boolean },
): EventCardData {
  const pricing = resolveEventPricing(event.is_free, event.price_from);

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
    area: getArea(event),
    imageUrl: event.image_url ?? "/images/event-placeholder.jpg",
    isFree: pricing.isFree,
    priceFrom: pricing.priceFrom,
    isFeatured: event.is_featured,
    happeningNow: options?.happeningNow,
    statusLabel: options?.happeningNow ? "In corso" : undefined,
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
  const todayKey = formatRomeDayKey(now);
  const rows = (data ?? []) as EventRow[];

  const events = rows
    .filter((event) => {
      const eventEnd = event.end_at
        ? new Date(event.end_at)
        : new Date(event.start_at);

      return eventEnd >= now;
    })
    .map((event) => ({
      ...mapEvent(event),
      isFavorite: favoriteIds.has(event.id),
    }));

  const todayEvents = rows
    .filter((event) => {
      if (!isHappeningOnRomeDay(event, todayKey)) {
        return false;
      }

      const eventEnd = event.end_at
        ? new Date(event.end_at)
        : new Date(event.start_at);

      return eventEnd >= now;
    })
    .sort((a, b) => {
      const aNow = isHappeningNow(a, now) ? 0 : 1;
      const bNow = isHappeningNow(b, now) ? 0 : 1;
      if (aNow !== bNow) return aNow - bNow;
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (
        new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );
    })
    .map((event) => ({
      ...mapEvent(event, { happeningNow: isHappeningNow(event, now) }),
      isFavorite: favoriteIds.has(event.id),
    }));

  return (
    <>
      <Header />

      <main>
        <HappeningToday events={todayEvents} />

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
