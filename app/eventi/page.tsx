import Header from "@/src/components/home/Header";
import EventSearchForm from "@/src/components/home/EventSearchForm";
import EventCard, {
  type EventCardData,
} from "@/src/components/home/EventCard";
import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import { formatEventDateRange } from "@/src/lib/formatEventDate";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { resolveEventStatusBadge } from "@/src/lib/eventStatusBadge";
import { createClient } from "@/src/lib/supabase/server";
import { eventMatchesQuery } from "@/src/utils/nearby-city";

type EventsPageProps = {
  searchParams: Promise<{
    area?: string;
    city?: string;
    category?: string;
    date?: string;
    q?: string;
  }>;
};

type DatabaseEvent = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  province: string | null;
  municipality: string | null;
  location_name: string | null;
  address: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  slug: string | null;
  is_free: boolean;
  price_from: number | string | null;
  ticket_url: string | null;
  status: string;
  is_featured: boolean;
};

const areaLabels: Record<string, string> = {
  "nord-sardegna": "Nord Sardegna",
  "centro-sardegna": "Centro Sardegna",
  "sud-sardegna": "Sud Sardegna",
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDateRange(filter: string) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  const weekendStart = addDays(today, daysUntilSaturday);
  const weekendEnd = addDays(weekendStart, 2);

  const weekEnd = addDays(today, 7);

  switch (filter) {
    case "oggi":
      return { start: today, end: tomorrow };
    case "domani":
      return { start: tomorrow, end: dayAfterTomorrow };
    case "weekend":
      return { start: weekendStart, end: weekendEnd };
    case "settimana":
      return { start: today, end: weekEnd };
    default:
      return null;
  }
}

function getEventArea(municipality: string | null) {
  if (!municipality) {
    return undefined;
  }

  return cities.find(
    (city) =>
      city.city.toLocaleLowerCase("it") ===
      municipality.toLocaleLowerCase("it"),
  )?.area;
}

function formatEventDate(startAt: string, endAt?: string | null) {
  return formatEventDateRange(startAt, endAt);
}

function mapDatabaseEvent(event: DatabaseEvent): EventCardData {
  const status = resolveEventStatusBadge(event.start_at, event.end_at);
  const pricing = resolveEventPricing(event.is_free, event.price_from);

  return {
    id: event.slug || event.id,
    eventId: event.id,
    title: event.title,
    category: event.category || "Evento",
    date: formatEventDate(event.start_at, event.end_at),
    startDate: event.start_at,
    endDate: event.end_at || undefined,
    location: event.municipality || event.location_name || "Sardegna",
    area: getEventArea(event.municipality),
    imageUrl: event.image_url || "/images/concert.png",
    isFree: pricing.isFree,
    priceFrom: pricing.priceFrom,
    isFeatured: event.is_featured,
    happeningNow: status.happeningNow,
    isActiveEvent: status.isActiveEvent,
    statusLabel: status.statusLabel,
  };
}

export default async function EventsPage({
  searchParams,
}: EventsPageProps) {
  const params = await searchParams;

  const selectedArea = params.area ?? "";
  const selectedCity = params.city ?? "";
  const selectedCategory = params.category ?? "";
  const selectedDate = params.date ?? "";
  const searchQuery = params.q?.trim() ?? "";

  const categoryNameBySlug = new Map(
    categories.map((category) => [category.slug, category.name]),
  );

  const selectedAreaLabel =
    selectedArea && selectedArea !== "tutta-sardegna"
      ? areaLabels[selectedArea]
      : undefined;

  const selectedCategoryName = categories.find(
    (category) => category.slug === selectedCategory,
  )?.name;

  const dateRange = getDateRange(selectedDate);

  const supabase = await createClient();

  const [{ data, error }, favoriteIds] = await Promise.all([
    supabase
      .from("events")
      .select(
        `
        id,
        title,
        description,
        category,
        province,
        municipality,
        location_name,
        address,
        start_at,
        end_at,
        image_url,
        slug,
        is_free,
        price_from,
        ticket_url,
        status,
        is_featured
      `,
      )
      .eq("status", "published")
      .order("start_at", { ascending: true }),
    getCurrentUserFavoriteIds(),
  ]);

  const databaseEvents = (data ?? []) as DatabaseEvent[];

  const filteredEvents = databaseEvents
    .filter((event) => {
      const eventStartDate = new Date(event.start_at);
      const eventArea = getEventArea(event.municipality);

      const matchesArea =
        !selectedAreaLabel || eventArea === selectedAreaLabel;

      const matchesCity =
        !selectedCity ||
        event.municipality?.toLocaleLowerCase("it") ===
          selectedCity.toLocaleLowerCase("it");

      const normalizedEventCategory =
        event.category?.toLocaleLowerCase("it") ?? "";

      const matchesCategory =
        !selectedCategory ||
        normalizedEventCategory ===
          selectedCategory.toLocaleLowerCase("it") ||
        normalizedEventCategory ===
          selectedCategoryName?.toLocaleLowerCase("it");

      const matchesDate =
        !dateRange ||
        (eventStartDate >= dateRange.start &&
          eventStartDate < dateRange.end);

      const matchesText = eventMatchesQuery(
        event,
        searchQuery,
        categoryNameBySlug,
      );

      return (
        matchesArea &&
        matchesCity &&
        matchesCategory &&
        matchesDate &&
        matchesText
      );
    })
    .map((event) => ({
      ...mapDatabaseEvent(event),
      isFavorite: favoriteIds.has(event.id),
    }));

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Esplora
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Eventi in Sardegna
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Cerca per parola chiave, zona, categoria e periodo. Usa «Vicino a
              me» per trovare eventi nella città più vicina.
            </p>

            <EventSearchForm
              variant="page"
              initialQuery={searchQuery}
              initialArea={selectedArea}
              initialCity={selectedCity}
              initialCategory={selectedCategory}
              initialDate={selectedDate}
            />
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {error && (
              <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                Non è stato possibile caricare gli eventi: {error.message}
              </div>
            )}

            <p className="text-sm font-semibold text-slate-500">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1
                ? "evento trovato"
                : "eventi trovati"}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Risultati
            </h2>

            {filteredEvents.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  Nessun evento trovato
                </h3>

                <p className="mt-3 text-slate-600">
                  Prova un&apos;altra parola chiave o modifica zona, categoria o
                  data.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}