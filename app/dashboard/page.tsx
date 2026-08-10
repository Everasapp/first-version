import Link from "next/link";
import {
  Archive,
  BarChart3,
  Building2,
  CalendarDays,
  CirclePlus,
  ExternalLink,
  FileText,
  Heart,
  MapPin,
  Pencil,
  TicketCheck,
  Users,
} from "lucide-react";

import Header from "@/src/components/home/Header";
import EventCard, {
  type EventCardData,
} from "@/src/components/home/EventCard";
import DeleteEventButton from "@/src/components/dashboard/DeleteEventButton";
import DuplicateEventButton from "@/src/components/dashboard/DuplicateEventButton";
import LogoutButton from "@/src/components/dashboard/LogoutButton";
import { requireProfile } from "@/src/lib/auth";
import { getCalendarEvents } from "@/src/lib/calendar";
import {
  getEventBucket,
  parseDashboardFilter,
  type DashboardEventStatus,
  type DashboardFilter,
} from "@/src/lib/dashboardEvents";
import { getFavoriteEvents } from "@/src/lib/favorites";
import { getFollowedOrganizers } from "@/src/lib/follows";
import { isOrganizer, type Profile } from "@/src/lib/profile";

type DashboardEvent = {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  location_name: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  status: DashboardEventStatus;
  is_free: boolean;
  price_from: number | string | null;
  views_count: number | null;
};

type DashboardPageProps = {
  searchParams: Promise<{
    filtro?: string | string[];
  }>;
};

const statusLabels: Record<DashboardEventStatus, string> = {
  draft: "Bozza",
  pending: "In revisione",
  published: "Pubblicato",
  rejected: "Non approvato",
};

const statusClasses: Record<DashboardEventStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

const filters: {
  id: DashboardFilter;
  label: string;
  description: string;
  icon: typeof TicketCheck;
  accent: string;
}[] = [
  {
    id: "pubblicati",
    label: "Pubblicati",
    description: "Online e ancora attivi",
    icon: TicketCheck,
    accent: "text-emerald-600",
  },
  {
    id: "bozze",
    label: "Bozze",
    description: "Da completare o ripubblicare",
    icon: FileText,
    accent: "text-amber-600",
  },
  {
    id: "scaduti",
    label: "Scaduti",
    description: "Eventi già conclusi",
    icon: Archive,
    accent: "text-slate-500",
  },
];

const emptyCopy: Record<
  DashboardFilter,
  { title: string; body: string; cta: string }
> = {
  pubblicati: {
    title: "Nessun evento pubblicato",
    body: "Quando pubblichi un evento attivo, lo trovi qui.",
    cta: "Pubblica un evento",
  },
  bozze: {
    title: "Nessuna bozza",
    body: "Le bozze e gli eventi non ancora online compaiono in questa sezione.",
    cta: "Crea un evento",
  },
  scaduti: {
    title: "Nessun evento scaduto",
    body: "Gli eventi pubblicati già conclusi restano qui per consultarli o duplicarli.",
    cta: "Pubblica un evento",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(value));
}

function formatPrice(event: DashboardEvent) {
  if (event.is_free) {
    return "Gratuito";
  }

  const price = event.price_from === null ? null : Number(event.price_from);

  if (price === null || !Number.isFinite(price)) {
    return "A pagamento";
  }

  return `Da ${new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price)}`;
}

function formatFavoriteDate(startAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(startAt));
}

function toFavoriteCards(
  favorites: Awaited<ReturnType<typeof getFavoriteEvents>>,
): EventCardData[] {
  return favorites.map((event) => {
    const numericPrice =
      event.price_from === null ? undefined : Number(event.price_from);

    return {
      id: event.slug,
      eventId: event.id,
      title: event.title,
      category: event.category,
      date: formatFavoriteDate(event.start_at),
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
}

function UserDashboard({
  profile,
  favoriteCards,
  calendarCount,
  followingCount,
}: {
  profile: Profile;
  favoriteCards: EventCardData[];
  calendarCount: number;
  followingCount: number;
}) {
  const firstName =
    profile.full_name?.trim().split(/\s+/)[0] || "benvenuto/a";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Area personale
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Ciao, {firstName}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Preferiti, calendario e organizzatori seguiti: tutto sul tuo
                stesso account Everas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <LogoutButton />
              <Link
                href="/dashboard/preferiti"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
              >
                <Heart aria-hidden="true" className="h-5 w-5" />
                Preferiti
              </Link>
              <Link
                href="/dashboard/calendario"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
              >
                <CalendarDays aria-hidden="true" className="h-5 w-5" />
                Calendario
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-[#E67E22]">
                  <Building2 aria-hidden="true" className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Vuoi pubblicare un evento?
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Diventa organizzatore con lo stesso account e pubblica in
                    pochi passaggi.
                  </p>
                </div>
              </div>

              <Link
                href="/diventa-organizzatore?next=/pubblica"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E67E22] px-5 py-3.5 font-bold text-white transition hover:bg-[#C96A1A]"
              >
                <Building2 aria-hidden="true" className="h-5 w-5" />
                Diventa organizzatore
              </Link>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Heart aria-hidden="true" className="h-6 w-6 text-[#E67E22]" />
              <h2 className="mt-4 text-lg font-bold text-slate-900">Preferiti</h2>
              <p className="mt-2 text-sm text-slate-600">
                {favoriteCards.length === 0
                  ? "Nessun evento salvato."
                  : `${favoriteCards.length} salvati`}
              </p>
              <Link
                href="/dashboard/preferiti"
                className="mt-5 inline-flex text-sm font-bold text-[#075EAE] hover:underline"
              >
                Apri
              </Link>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <CalendarDays
                aria-hidden="true"
                className="h-6 w-6 text-[#075EAE]"
              />
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Calendario
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {calendarCount === 0
                  ? "Nessun evento in agenda."
                  : `${calendarCount} in agenda`}
              </p>
              <Link
                href="/dashboard/calendario"
                className="mt-5 inline-flex text-sm font-bold text-[#075EAE] hover:underline"
              >
                Apri
              </Link>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2 xl:col-span-4">
              <Users aria-hidden="true" className="h-6 w-6 text-[#075EAE]" />
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Organizzatori seguiti
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {followingCount === 0
                  ? "Non segui ancora nessun organizzatore. Trovi «Segui» nella pagina evento."
                  : `Segui ${followingCount} organizzator${
                      followingCount === 1 ? "e" : "i"
                    }.`}
              </p>
              <Link
                href={
                  followingCount > 0 ? "/dashboard/organizzatori" : "/eventi"
                }
                className="mt-5 inline-flex text-sm font-bold text-[#075EAE] hover:underline"
              >
                {followingCount > 0 ? "Vedi lista" : "Esplora eventi"}
              </Link>
            </article>
          </div>

          {favoriteCards.length > 0 ? (
            <div className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Salvati di recente
                </h2>
                <Link
                  href="/dashboard/preferiti"
                  className="text-sm font-bold text-[#075EAE] hover:underline"
                >
                  Vedi tutti
                </Link>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoriteCards.slice(0, 3).map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}

async function OrganizerDashboard({
  profile,
  searchParams,
  supabase,
  userId,
}: {
  profile: Profile;
  searchParams: DashboardPageProps["searchParams"];
  supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"];
  userId: string;
}) {
  const params = await searchParams;
  const activeFilter = parseDashboardFilter(params.filtro);

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, municipality, location_name, start_at, end_at, image_url, status, is_free, price_from, views_count",
    )
    .eq("organizer_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Impossibile caricare la dashboard: ${error.message}`);
  }

  const events = (data ?? []) as DashboardEvent[];
  const now = Date.now();

  const counts = {
    pubblicati: 0,
    bozze: 0,
    scaduti: 0,
  } satisfies Record<DashboardFilter, number>;

  for (const event of events) {
    counts[getEventBucket(event, now)] += 1;
  }

  const filteredEvents = events.filter(
    (event) => getEventBucket(event, now) === activeFilter,
  );

  const empty = emptyCopy[activeFilter];
  const organizerLabel =
    profile.business_name?.trim() || profile.full_name?.trim() || "Organizzatore";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Area organizzatore
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                I miei eventi
              </h1>

              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                {organizerLabel}: controlla pubblicati, bozze e scaduti, poi
                modifica, elimina, duplica o consulta le statistiche.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <LogoutButton />

              <Link
                href="/dashboard/preferiti"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
              >
                <Heart aria-hidden="true" className="h-5 w-5" />
                Preferiti
              </Link>

              <Link
                href="/dashboard/calendario"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
              >
                <CalendarDays aria-hidden="true" className="h-5 w-5" />
                Calendario
              </Link>

              <Link
                href="/dashboard/organizzatori"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
              >
                <Users aria-hidden="true" className="h-5 w-5" />
                Seguiti
              </Link>

              <Link
                href="/pubblica"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E67E22] px-5 py-3.5 font-bold text-white transition hover:bg-[#C96A1A]"
              >
                <CirclePlus aria-hidden="true" className="h-5 w-5" />
                Pubblica un evento
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;

              return (
                <Link
                  key={filter.id}
                  href={`/dashboard?filtro=${filter.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-3xl border bg-white p-6 shadow-sm transition ${
                    isActive
                      ? "border-[#075EAE] ring-4 ring-blue-50"
                      : "border-slate-200 hover:border-[#075EAE]/60"
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`h-6 w-6 ${filter.accent}`}
                  />
                  <p className="mt-4 text-3xl font-black text-slate-900">
                    {counts[filter.id]}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {filter.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {filter.description}
                  </p>
                </Link>
              );
            })}
          </div>

          {events.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <CirclePlus
                aria-hidden="true"
                className="mx-auto h-10 w-10 text-[#075EAE]"
              />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Non hai ancora pubblicato eventi
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">
                Crea il tuo primo evento e fallo conoscere alle persone che
                cercano cosa fare in Sardegna.
              </p>
              <Link
                href="/pubblica"
                className="mt-6 inline-flex rounded-2xl bg-[#E67E22] px-6 py-3 font-bold text-white"
              >
                Crea il primo evento
              </Link>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {empty.title}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">
                {empty.body}
              </p>
              <Link
                href="/pubblica"
                className="mt-6 inline-flex rounded-2xl bg-[#E67E22] px-6 py-3 font-bold text-white"
              >
                {empty.cta}
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {filteredEvents.map((event) => {
                const bucket = getEventBucket(event, now);
                const showOnline =
                  event.status === "published" && bucket !== "scaduti";

                return (
                  <article
                    key={event.id}
                    className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[220px_minmax(0,1fr)]"
                  >
                    <div className="h-52 bg-slate-100 md:h-full">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-sm text-slate-400">
                          Nessuna immagine
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[event.status]}`}
                            >
                              {statusLabels[event.status]}
                            </span>
                            {bucket === "scaduti" && (
                              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                Scaduto
                              </span>
                            )}
                          </div>
                          <h2 className="mt-3 text-2xl font-bold text-slate-900">
                            {event.title}
                          </h2>
                        </div>

                        <p className="font-bold text-[#E67E22]">
                          {formatPrice(event)}
                        </p>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <p className="flex items-start gap-2">
                          <CalendarDays
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
                          />
                          {formatDate(event.start_at)}
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
                          />
                          {event.location_name || event.municipality}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                        <Link
                          href={`/dashboard/eventi/${event.id}/modifica`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#E67E22] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
                        >
                          <Pencil aria-hidden="true" className="h-4 w-4" />
                          Modifica
                        </Link>

                        <DuplicateEventButton eventId={event.id} />

                        <Link
                          href={`/dashboard/eventi/${event.id}/statistiche`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                        >
                          <BarChart3 aria-hidden="true" className="h-4 w-4" />
                          Statistiche
                        </Link>

                        {showOnline && (
                          <Link
                            href={`/eventi/${event.slug}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                          >
                            Vedi online
                            <ExternalLink
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                          </Link>
                        )}

                        <DeleteEventButton
                          eventId={event.id}
                          imageUrl={event.image_url}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { supabase, user, profile } = await requireProfile("/dashboard");
  const [favoriteCards, calendarEvents, followedOrganizers] = await Promise.all([
    getFavoriteEvents(user.id).then(toFavoriteCards),
    getCalendarEvents(user.id),
    getFollowedOrganizers(user.id),
  ]);

  if (!isOrganizer(profile)) {
    return (
      <UserDashboard
        profile={profile}
        favoriteCards={favoriteCards}
        calendarCount={calendarEvents.length}
        followingCount={followedOrganizers.length}
      />
    );
  }

  return (
    <OrganizerDashboard
      profile={profile}
      searchParams={searchParams}
      supabase={supabase}
      userId={user.id}
    />
  );
}
