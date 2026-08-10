import Link from "next/link";
import { Heart } from "lucide-react";

import EventCard, {
  type EventCardData,
} from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import { requireProfile } from "@/src/lib/auth";
import { getFavoriteEvents } from "@/src/lib/favorites";
import { isOrganizer } from "@/src/lib/profile";

function formatEventDate(startAt: string, endAt: string | null) {
  const start = new Date(startAt);

  const date = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(start);

  if (!endAt) {
    return date;
  }

  const end = new Date(endAt);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (!sameDay) {
    return `${date} – ${new Intl.DateTimeFormat("it-IT", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Rome",
    }).format(end)}`;
  }

  return date;
}

export default async function PreferitiPage() {
  const { user, profile } = await requireProfile("/dashboard/preferiti");
  const favorites = await getFavoriteEvents(user.id);

  const cards: EventCardData[] = favorites.map((event) => {
    const numericPrice =
      event.price_from === null ? undefined : Number(event.price_from);

    return {
      id: event.slug,
      eventId: event.id,
      title: event.title,
      category: event.category,
      date: formatEventDate(event.start_at, event.end_at),
      startDate: event.start_at,
      endDate: event.end_at ?? undefined,
      location: event.location_name || event.municipality,
      imageUrl: event.image_url ?? "/images/event-placeholder.jpg",
      isFree: event.is_free,
      priceFrom:
        numericPrice !== undefined && Number.isFinite(numericPrice)
          ? numericPrice
          : undefined,
      isFavorite: true,
    };
  });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                {isOrganizer(profile) ? "Area account" : "Area personale"}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                I miei preferiti
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Gli eventi che hai salvato per ritrovarli facilmente.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
            >
              Torna alla dashboard
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          {cards.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Heart
                aria-hidden="true"
                className="mx-auto h-10 w-10 text-[#E67E22]"
              />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Nessun preferito ancora
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">
                Tocca il cuore su un evento per salvarlo qui.
              </p>
              <Link
                href="/eventi"
                className="mt-6 inline-flex rounded-2xl bg-[#E67E22] px-6 py-3 font-bold text-white transition hover:bg-[#C96A1A]"
              >
                Esplora eventi
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
