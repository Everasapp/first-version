import Header from "@/src/components/home/Header";
import Hero from "@/src/components/home/Hero";
import FeaturedEvents from "@/src/components/home/FeaturedEvents";
import CategoriesSection from "@/src/components/home/CategoriesSection";
import AreaSection from "@/src/components/home/AreaSection";
import type { EventCardData } from "@/src/components/home/EventCard";
import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
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

function formatEventDate(startAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(startAt));
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

function mapEvent(event: EventRow): EventCardData {
  const numericPrice =
    event.price_from === null ? undefined : Number(event.price_from);

  const categoryName =
    categories.find((category) => category.slug === event.category)?.name ??
    event.category;

  return {
    id: event.slug,
    title: event.title,
    category: categoryName,
    date: formatEventDate(event.start_at),
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    location: event.location_name || event.municipality,
    area: getArea(event),
    imageUrl: event.image_url ?? "/images/event-placeholder.jpg",
    isFree: event.is_free,
    priceFrom:
      numericPrice !== undefined && Number.isFinite(numericPrice)
        ? numericPrice
        : undefined,
    isFeatured: event.is_featured,
  };
}

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, category, province, municipality, location_name, start_at, end_at, image_url, is_free, price_from, is_featured",
    )
    .eq("status", "published")
    .order("start_at", { ascending: true });

  if (error) {
    console.error("Errore nel caricamento della homepage:", error);
  }

  const now = new Date();
  const events = ((data ?? []) as EventRow[])
    .filter((event) => {
      const eventEnd = event.end_at
        ? new Date(event.end_at)
        : new Date(event.start_at);

      return eventEnd >= now;
    })
    .map(mapEvent);

  return (
    <>
      <Header />

      <main>
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
