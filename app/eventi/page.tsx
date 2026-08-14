import Link from "next/link";
import { Search } from "lucide-react";

import Header from "@/src/components/home/Header";
import EventsExploreGrid from "@/src/components/events/EventsExploreGrid";
import type { EventCardData } from "@/src/components/home/EventCard";
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

const dateLabels: Record<string, string> = {
  oggi: "Oggi",
  domani: "Domani",
  weekend: "Questo weekend",
  settimana: "Questa settimana",
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
    municipality: event.municipality || undefined,
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

  const selectedDateLabel = selectedDate ? dateLabels[selectedDate] : undefined;

  const filterChips = [
    searchQuery ? `“${searchQuery}”` : null,
    selectedCity || null,
    selectedAreaLabel && !selectedCity ? selectedAreaLabel : null,
    selectedCategoryName || null,
    selectedDateLabel || null,
  ].filter(Boolean) as string[];

  const pageTitle = selectedCity
    ? `Eventi a ${selectedCity}`
    : selectedAreaLabel
      ? `Eventi in ${selectedAreaLabel}`
      : searchQuery
        ? `Risultati per “${searchQuery}”`
        : selectedCategoryName
          ? selectedCategoryName
          : selectedDateLabel
            ? `Eventi · ${selectedDateLabel}`
            : "Eventi in Sardegna";

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
  const now = new Date();

  const filteredEvents = databaseEvents
    .filter((event) => {
      const eventStartDate = new Date(event.start_at);
      const eventEndDate = event.end_at
        ? new Date(event.end_at)
        : eventStartDate;

      // Senza filtro data: solo eventi ancora validi (dal più vicino a oggi in poi)
      const matchesUpcoming =
        Boolean(dateRange) || eventEndDate >= now;

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
        matchesUpcoming &&
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
    }))
    .sort((a, b) => {
      const startA = new Date(a.startDate).getTime();
      const startB = new Date(b.startDate).getTime();
      return startA - startB;
    });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                  Risultati
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  {pageTitle}
                </h1>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1
                    ? "evento trovato"
                    : "eventi trovati"}
                </p>

                {filterChips.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {filterChips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <Link
                href="/#ricerca"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:bg-[#064a8a]"
              >
                <Search aria-hidden="true" className="h-4 w-4" />
                Nuova ricerca
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {error && (
              <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                Non è stato possibile caricare gli eventi: {error.message}
              </div>
            )}

            {filteredEvents.length > 0 ? (
              <EventsExploreGrid events={filteredEvents} />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  Nessun evento trovato
                </h3>

                <p className="mt-3 text-slate-600">
                  Prova una nuova ricerca dalla home, oppure cambia zona o data.
                </p>

                <Link
                  href="/#ricerca"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#064a8a]"
                >
                  <Search aria-hidden="true" className="h-4 w-4" />
                  Nuova ricerca
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}