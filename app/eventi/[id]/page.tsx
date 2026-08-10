import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Ticket,
} from "lucide-react";

import CalendarButton from "@/src/components/events/CalendarButton";
import FavoriteButton from "@/src/components/events/FavoriteButton";
import FollowOrganizerButton from "@/src/components/events/FollowOrganizerButton";
import ShareEventButton from "@/src/components/events/ShareEventButton";
import EventCard from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import { getCurrentUserCalendarEventIds } from "@/src/lib/calendar";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import {
  getCurrentUserFollowedOrganizerIds,
  getOrganizerDisplayName,
} from "@/src/lib/follows";
import { PROFILE_SELECT, type Profile } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  province: string | null;
  municipality: string;
  location_name: string | null;
  address: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  is_free: boolean;
  price_from: number | string | null;
  ticket_url: string | null;
  is_featured: boolean;
  organizer_id: string;
};

function formatEventDate(startAt: string, endAt: string | null) {
  const start = new Date(startAt);

  const date = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(start);

  const startTime = new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);

  if (!endAt) {
    return `${date} · ${startTime}`;
  }

  const end = new Date(endAt);
  const isSameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (isSameDay) {
    const endTime = new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(end);

    return `${date} · ${startTime}–${endTime}`;
  }

  const formattedEnd = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(end);

  return `${date} · ${startTime} – ${formattedEnd}`;
}

function mapEventForCard(event: EventRow, isFavorite = false) {
  const numericPrice =
    event.price_from === null ? undefined : Number(event.price_from);

  return {
    id: event.slug,
    eventId: event.id,
    title: event.title,
    category: event.category,
    area: event.province ?? "Sardegna",
    location: event.municipality,
    date: formatEventDate(event.start_at, event.end_at),
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    imageUrl: event.image_url ?? "/images/event-placeholder.jpg",
    isFree: event.is_free,
    priceFrom:
      numericPrice !== undefined && Number.isFinite(numericPrice)
        ? numericPrice
        : undefined,
    isFeatured: event.is_featured,
    isFavorite,
  };
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("title, description, image_url, municipality")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) {
    return {
      title: "Evento non trovato",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    data.description?.replace(/\\s+/g, " ").trim().slice(0, 155) ||
    `Scopri ${data.title} a ${data.municipality} su EVERAS.`;

  return {
    title: data.title,
    description,
    alternates: {
      canonical: `/eventi/${slug}`,
    },
    openGraph: {
      title: `${data.title} | EVERAS`,
      description,
      url: `/eventi/${slug}`,
      type: "article",
      images: data.image_url
        ? [{ url: data.image_url, alt: data.title }]
        : ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | EVERAS`,
      description,
      images: data.image_url
        ? [data.image_url]
        : ["/opengraph-image.png"],
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id: slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, description, category, province, municipality, location_name, address, start_at, end_at, image_url, is_free, price_from, ticket_url, is_featured, organizer_id",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Impossibile caricare l'evento: ${error.message}`);
  }

  if (!data) {
    notFound();
  }

  const event = data as EventRow;

  await supabase.rpc("increment_event_views", { event_id: event.id });

  const [
    { data: similarData, error: similarError },
    favoriteIds,
    calendarIds,
    followedIds,
    { data: organizerData },
  ] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, slug, title, description, category, province, municipality, location_name, address, start_at, end_at, image_url, is_free, price_from, ticket_url, is_featured, organizer_id",
      )
      .eq("status", "published")
      .eq("category", event.category)
      .neq("id", event.id)
      .order("start_at", { ascending: true })
      .limit(3),
    getCurrentUserFavoriteIds(),
    getCurrentUserCalendarEventIds(),
    getCurrentUserFollowedOrganizerIds(),
    supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", event.organizer_id)
      .maybeSingle(),
  ]);

  if (similarError) {
    console.error("Impossibile caricare gli eventi simili:", similarError);
  }

  const organizer = (organizerData as Profile | null) ?? null;
  const organizerName = organizer
    ? getOrganizerDisplayName(organizer)
    : "Organizzatore";
  const isFavorite = favoriteIds.has(event.id);
  const inCalendar = calendarIds.has(event.id);
  const isFollowing = followedIds.has(event.organizer_id);

  const similarEvents = ((similarData ?? []) as EventRow[]).map((item) =>
    mapEventForCard(item, favoriteIds.has(item.id)),
  );

  const numericPrice =
    event.price_from === null ? null : Number(event.price_from);
  const formattedPrice = event.is_free
    ? "Gratuito"
    : numericPrice !== null && Number.isFinite(numericPrice)
      ? `Da ${new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        }).format(numericPrice)}`
      : "A pagamento";

  const eventLocation = event.location_name || event.municipality;
  const locationDetails = [event.address, event.municipality, event.province]
    .filter(Boolean)
    .join(" · ");

  const mapAddress = [
    event.location_name,
    event.address,
    event.municipality,
    event.province,
    "Sardegna",
  ]
    .filter(Boolean)
    .join(", ");

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    mapAddress,
  )}&output=embed`;

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapAddress,
  )}`;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 sm:pt-12">
          <div className="relative overflow-hidden rounded-[32px]">
          <img
  src={event.image_url ?? "/images/event-placeholder.jpg"}
  alt={event.title}
  className="h-[360px] w-full object-cover sm:h-[520px]"
/>

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-5 sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">
                  {event.category}
                </p>

                <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                  {event.title}
                </h1>
              </div>

              <div className="flex shrink-0 flex-wrap justify-end gap-3">
                <FavoriteButton
                  eventId={event.id}
                  eventTitle={event.title}
                  initialIsFavorite={isFavorite}
                  size="md"
                  className="shadow-lg"
                />
                <CalendarButton
                  eventId={event.id}
                  eventTitle={event.title}
                  initialInCalendar={inCalendar}
                  size="md"
                  className="shadow-lg"
                />
                <ShareEventButton
                  title={event.title}
                  slug={event.slug}
                  size="md"
                  className="shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="grid gap-5 border-b border-slate-200 pb-10 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CalendarDays
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-[#075EAE]"
                />

                <div>
                  <p className="text-sm font-bold text-slate-900">Data e ora</p>
                  <p className="mt-1 text-slate-600">
                    {formatEventDate(event.start_at, event.end_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-[#075EAE]"
                />

                <div>
                  <p className="text-sm font-bold text-slate-900">Luogo</p>
                  <p className="mt-1 text-slate-600">{locationDetails}</p>
                </div>
              </div>
            </div>

            {organizer ? (
              <div className="flex flex-col gap-4 border-b border-slate-200 py-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#075EAE]">
                    <Building2 aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                      Organizzatore
                    </p>
                    <Link
                      href={`/organizzatori/${organizer.id}`}
                      className="mt-1 text-xl font-bold text-slate-900 hover:text-[#075EAE]"
                    >
                      {organizerName}
                    </Link>
                    {(organizer.municipality || organizer.province) && (
                      <p className="mt-1 text-sm text-slate-600">
                        {[organizer.municipality, organizer.province]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                </div>

                <FollowOrganizerButton
                  organizerId={organizer.id}
                  organizerName={organizerName}
                  initialIsFollowing={isFollowing}
                />
              </div>
            ) : null}

            <div className="py-10">
              <h2 className="text-3xl font-bold text-slate-900">
                Informazioni sull&apos;evento
              </h2>

              <div className="mt-5 whitespace-pre-line text-lg leading-8 text-slate-600">
                {event.description ||
                  "L'organizzatore non ha ancora aggiunto una descrizione per questo evento."}
              </div>
            </div>

            <div className="border-t border-slate-200 py-10">
              <h2 className="text-3xl font-bold text-slate-900">
                Dove si svolge
              </h2>

              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                <iframe
                  title={`Mappa di ${event.title}`}
                  src={mapUrl}
                  width="100%"
                  height="360"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full border-0"
                />

                <div className="flex flex-col gap-4 border-t border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#075EAE]"
                    />

                    <div>
                      <p className="font-bold text-slate-900">
                        {eventLocation}
                      </p>

                      {locationDetails && (
                        <p className="mt-1 text-sm text-slate-600">
                          {locationDetails}
                        </p>
                      )}
                    </div>
                  </div>

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 font-bold text-[#075EAE] hover:underline"
                  >
                    Apri su Google Maps
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Prezzo</p>

              <p
                className={`mt-2 text-3xl font-black ${
                  event.is_free ? "text-emerald-600" : "text-[#E67E22]"
                }`}
              >
                {formattedPrice}
              </p>

              <div className="mt-6 space-y-3">
                {event.ticket_url && (
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E67E22] px-6 py-4 text-center font-bold text-white transition hover:bg-[#C96A1A]"
                  >
                    <Ticket aria-hidden="true" className="h-5 w-5" />
                    {event.is_free ? "Partecipa" : "Acquista il biglietto"}
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                )}

                <CalendarButton
                  eventId={event.id}
                  eventTitle={event.title}
                  initialInCalendar={inCalendar}
                  variant="button"
                />

                <Link
                  href="/eventi"
                  className="flex w-full items-center justify-center rounded-2xl border border-slate-300 px-6 py-4 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                >
                  Torna agli eventi
                </Link>
              </div>

              {event.ticket_url && (
                <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                  La biglietteria è gestita sul sito esterno indicato
                  dall&apos;organizzatore.
                </p>
              )}
            </div>
          </aside>
        </section>

        {similarEvents.length > 0 && (
          <section className="border-t border-slate-200 py-16">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Potrebbero piacerti
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Eventi simili
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {similarEvents.map((similarEvent) => (
                  <EventCard key={similarEvent.id} event={similarEvent} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
