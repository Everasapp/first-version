import Link from "next/link";
import { Search } from "lucide-react";

import EventCard, {
  type EventCardData,
} from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import { categories } from "@/src/data/categories";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { createClient } from "@/src/lib/supabase/server";

type CategoriesPageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

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

function mapEvent(event: EventRow, isFavorite: boolean): EventCardData {
  const pricing = resolveEventPricing(event.is_free, event.price_from);

  const categoryName =
    categories.find((category) => category.slug === event.category)?.name ??
    event.category;

  return {
    id: event.slug,
    eventId: event.id,
    title: event.title,
    category: categoryName,
    date: formatEventDate(event.start_at),
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    location: event.location_name || event.municipality,
    area: event.province ?? undefined,
    imageUrl: event.image_url ?? "/images/concert.webp",
    isFree: pricing.isFree,
    priceFrom: pricing.priceFrom,
    isFeatured: event.is_featured,
    isFavorite,
  };
}

function resolveCategoryParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || "";
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;
  const selectedCategory = resolveCategoryParam(params.category);

  const selectedCategoryMeta = categories.find(
    (category) => category.slug === selectedCategory,
  );

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

  const now = new Date();
  const events = ((data ?? []) as EventRow[])
    .filter((event) =>
      isPublicEventActive(event.start_at, event.end_at, now),
    )
    .filter((event) => {
      if (!selectedCategory) {
        return true;
      }

      const normalized = event.category?.toLocaleLowerCase("it") ?? "";
      return (
        normalized === selectedCategory.toLocaleLowerCase("it") ||
        normalized ===
          selectedCategoryMeta?.name.toLocaleLowerCase("it")
      );
    })
    .map((event) => mapEvent(event, favoriteIds.has(event.id)));

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Categorie
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {selectedCategoryMeta
                ? selectedCategoryMeta.name
                : "Eventi per categoria"}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              {selectedCategoryMeta
                ? `Risultati per ${selectedCategoryMeta.name} in Sardegna.`
                : "Scegli una categoria oppure sfoglia subito tutti gli eventi."}
            </p>

            <div className="mt-6">
              <Link
                href="/#ricerca"
                className="inline-flex items-center gap-2 rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:bg-[#064a8a]"
              >
                <Search aria-hidden="true" className="h-4 w-4" />
                Nuova ricerca
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 sm:gap-2.5">
              <Link
                href="/categorie"
                aria-current={!selectedCategory ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-bold transition sm:px-4 ${
                  !selectedCategory
                    ? "bg-[#075EAE] text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE]"
                }`}
              >
                Tutte
              </Link>

              {categories.map((category) => {
                const isActive = selectedCategory === category.slug;

                return (
                  <Link
                    key={category.id}
                    href={`/categorie?category=${encodeURIComponent(category.slug)}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full px-3.5 py-2 text-sm font-bold transition sm:px-4 ${
                      isActive
                        ? "bg-[#075EAE] text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE]"
                    }`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {error ? (
              <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                Non è stato possibile caricare gli eventi: {error.message}
              </div>
            ) : null}

            <p className="text-sm font-semibold text-slate-500">
              {events.length}{" "}
              {events.length === 1 ? "evento trovato" : "eventi trovati"}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Risultati
            </h2>

            {events.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  Nessun evento in questa categoria
                </h3>
                <p className="mt-3 text-slate-600">
                  Prova un&apos;altra categoria o esplora tutti gli eventi.
                </p>
                <Link
                  href="/categorie"
                  className="mt-6 inline-flex font-bold text-[#075EAE] hover:underline"
                >
                  Vedi tutte le categorie
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
