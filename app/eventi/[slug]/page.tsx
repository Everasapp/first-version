import type { Metadata } from "next";
import Image from "next/image";
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
import EventDescription from "@/src/components/events/EventDescription";
import FavoriteButton from "@/src/components/events/FavoriteButton";
import ClaimOrganizerButton from "@/src/components/events/ClaimOrganizerButton";
import FollowOrganizerButton from "@/src/components/events/FollowOrganizerButton";
import ShareEventButton from "@/src/components/events/ShareEventButton";
import AdminEventViewOnce from "@/src/components/events/AdminEventViewOnce";
import EventYouTubePlayer from "@/src/components/events/EventYouTubePlayer";
import EventCard from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import JsonLd from "@/src/components/seo/JsonLd";
import {
  CategoryLandingPage,
  CityLandingPage,
  buildCategoryLandingMetadata,
  buildCityLandingMetadata,
} from "@/src/components/seo/GeoCategoryLandings";
import {
  eventCategorySlugs,
  resolveCategoryLabels,
} from "@/src/lib/event-categories";
import { getCurrentUserCalendarEventIds } from "@/src/lib/calendar";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import {
  getCurrentUserFollowedOrganizerIds,
  getOrganizerDisplayName,
} from "@/src/lib/follows";
import {
  isDirectoryUnclaimed,
  parseOrganizerDirectoryPublic,
} from "@/src/lib/organizer-claim";
import { PROFILE_SELECT, type Profile } from "@/src/lib/profile";
import { formatEventDateRange } from "@/src/lib/formatEventDate";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { stripHtml } from "@/src/lib/sanitizeHtml";
import { createClient } from "@/src/lib/supabase/server";
import {
  findCategoryBySlug,
  findCityBySlug,
  categoryEventsPath,
  cityEventsPath,
} from "@/src/lib/seo/paths";
import {
  breadcrumbListSchema,
  eventSchema,
} from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

type EventDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  categories?: string[] | null;
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
  youtube_url: string | null;
  is_featured: boolean;
  organizer_id: string | null;
  organizer_display_name: string | null;
  organizer_directory_id: string | null;
};

function formatEventDate(startAt: string, endAt: string | null) {
  return formatEventDateRange(startAt, endAt, { includeWeekday: true });
}

function mapEventForCard(event: EventRow, isFavorite = false) {
  const pricing = resolveEventPricing(event.is_free, event.price_from);
  const categoryLabels = resolveCategoryLabels(event);

  return {
    id: event.slug,
    eventId: event.id,
    title: event.title,
    category: categoryLabels[0] ?? event.category,
    categories: categoryLabels,
    area: event.province ?? "Sardegna",
    location: event.municipality,
    municipality: event.municipality,
    date: formatEventDate(event.start_at, event.end_at),
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    imageUrl: event.image_url ?? "/images/concert.webp",
    isFree: pricing.isFree,
    priceFrom: pricing.priceFrom,
    isFeatured: event.is_featured,
    isFavorite,
  };
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const city = findCityBySlug(slug);
  if (city) return buildCityLandingMetadata(city);

  const category = findCategoryBySlug(slug);
  if (category) return buildCategoryLandingMetadata(category);

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
    stripHtml(data.description || "").slice(0, 155) ||
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
        : [{ url: "/og.jpg", width: 1200, height: 630, alt: "EVERAS" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | EVERAS`,
      description,
      images: data.image_url ? [data.image_url] : ["/og.jpg"],
    },
  };
}

export default async function EventSlugPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;

  const city = findCityBySlug(slug);
  if (city) return <CityLandingPage city={city} />;

  const category = findCategoryBySlug(slug);
  if (category) return <CategoryLandingPage category={category} />;

  return <EventDetailPage slug={slug} />;
}

async function EventDetailPage({ slug }: { slug: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, description, category, categories, province, municipality, location_name, address, start_at, end_at, image_url, is_free, price_from, ticket_url, youtube_url, is_featured, organizer_id, organizer_display_name, organizer_directory_id",
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.role === "admin";
  }

  // Visitatori / organizzatori: conta ogni vista. Admin: solo la prima (lato client).
  if (!isAdmin) {
    await supabase.rpc("increment_event_views", { event_id: event.id });
  }

  const [
    { data: similarData, error: similarError },
    favoriteIds,
    calendarIds,
    followedIds,
    { data: organizerData },
    { data: directoryData },
  ] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, slug, title, description, category, categories, province, municipality, location_name, address, start_at, end_at, image_url, is_free, price_from, ticket_url, is_featured, organizer_id",
      )
      .eq("status", "published")
      .eq("category", event.category)
      .neq("id", event.id)
      .order("start_at", { ascending: true })
      .limit(3),
    getCurrentUserFavoriteIds(),
    getCurrentUserCalendarEventIds(),
    getCurrentUserFollowedOrganizerIds(),
    event.organizer_id
      ? supabase
          .from("profiles")
          .select(PROFILE_SELECT)
          .eq("id", event.organizer_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    event.organizer_directory_id
      ? supabase
          .from("organizer_directory_public")
          .select("id, name, claim_status, claimed_by_profile_id")
          .eq("id", event.organizer_directory_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (similarError) {
    console.error("Impossibile caricare gli eventi simili:", similarError);
  }

  const organizer = (organizerData as Profile | null) ?? null;
  const directory = parseOrganizerDirectoryPublic(directoryData);
  const profileOrganizerName = organizer
    ? getOrganizerDisplayName(organizer)
    : "Organizzatore";
  const organizerName =
    directory?.name?.trim() ||
    event.organizer_display_name?.trim() ||
    profileOrganizerName;
  const customOrganizerName = event.organizer_display_name?.trim() || "";
  const isCustomOrganizerName =
    !directory &&
    customOrganizerName.length > 0 &&
    customOrganizerName.toLocaleLowerCase("it") !==
      profileOrganizerName.toLocaleLowerCase("it");
  const showClaimButton = isDirectoryUnclaimed(directory);
  const followOrganizerId = showClaimButton
    ? null
    : directory?.claimed_by_profile_id ??
      (isCustomOrganizerName ? null : organizer?.id ?? null);
  const organizerHref = followOrganizerId
    ? `/organizzatori/${followOrganizerId}`
    : null;
  const showOrganizerPlace =
    !isCustomOrganizerName &&
    !showClaimButton &&
    Boolean(organizer?.municipality || organizer?.province);
  const isFavorite = favoriteIds.has(event.id);
  const inCalendar = calendarIds.has(event.id);
  const isFollowing = followOrganizerId
    ? followedIds.has(followOrganizerId)
    : false;

  const similarEvents = ((similarData ?? []) as EventRow[]).map((item) =>
    mapEventForCard(item, favoriteIds.has(item.id)),
  );

  const pricing = resolveEventPricing(event.is_free, event.price_from);
  const formattedPrice =
    pricing.priceFrom !== undefined
      ? `Da ${new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        }).format(pricing.priceFrom)}`
      : pricing.label;

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

  const categoryLabels = resolveCategoryLabels(event);
  const categoryName = categoryLabels[0] ?? event.category;
  const primaryCategorySlug =
    eventCategorySlugs(event)[0] ?? event.category;

  const cityPath = cityEventsPath(event.municipality);
  const categoryPath = categoryEventsPath(primaryCategorySlug);
  const eventUrl = absoluteUrl(`/eventi/${event.slug}`);
  const heroImage = event.image_url ?? "/images/concert.webp";
  const optimizable =
    heroImage.startsWith("/") || heroImage.includes("supabase.co");

  return (
    <>
      {isAdmin ? <AdminEventViewOnce eventId={event.id} /> : null}
      <JsonLd
        data={eventSchema({
          name: event.title,
          description:
            stripHtml(event.description || "").slice(0, 300) ||
            `${event.title} a ${event.municipality}`,
          startAt: event.start_at,
          endAt: event.end_at,
          imageUrl: event.image_url,
          url: eventUrl,
          isFree: pricing.isFree,
          priceFrom: pricing.priceFrom,
          ticketUrl: event.ticket_url,
          locationName: eventLocation,
          address: event.address,
          city: event.municipality,
          province: event.province,
          organizerName,
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: event.municipality, path: cityPath },
          { name: categoryName, path: categoryPath },
          { name: event.title, path: `/eventi/${event.slug}` },
        ])}
      />

      <Header />

      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 sm:pt-10">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Eventi", href: "/eventi" },
              { name: event.municipality, href: cityPath },
              { name: categoryName, href: categoryPath },
              { name: event.title },
            ]}
          />

          <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] bg-slate-100 sm:aspect-[21/9]">
            <Image
              src={heroImage}
              alt={event.title}
              title={event.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              unoptimized={!optimizable}
            />

            <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
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
                imageUrl={heroImage}
                category={categoryName}
                city={event.municipality}
                startAt={event.start_at}
                size="md"
                className="shadow-lg"
              />
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              {categoryLabels.map((label, index) => {
                const slug = eventCategorySlugs(event)[index];
                const href = slug
                  ? categoryEventsPath(slug)
                  : categoryPath;
                return (
                  <span key={`${label}-${index}`}>
                    {index > 0 ? " · " : null}
                    <Link href={href} className="hover:underline">
                      {label}
                    </Link>
                  </span>
                );
              })}
              {" · "}
              <Link href={cityPath} className="hover:underline">
                {event.municipality}
              </Link>
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>
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

            {organizer || directory ? (
              <div className="flex flex-col gap-4 border-b border-slate-200 py-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#075EAE]">
                    <Building2 aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                      Organizzatore
                    </p>
                    {organizerHref ? (
                      <Link
                        href={organizerHref}
                        className="mt-1 text-xl font-bold text-slate-900 hover:text-[#075EAE]"
                      >
                        {organizerName}
                      </Link>
                    ) : (
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {organizerName}
                      </p>
                    )}
                    {showOrganizerPlace && organizer ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {[organizer.municipality, organizer.province]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                    {showClaimButton ? (
                      <p className="mt-1 text-sm text-slate-500">
                        Sei tu? Rivendica il profilo per modificare questo
                        evento e pubblicarne altri.
                      </p>
                    ) : null}
                  </div>
                </div>

                {showClaimButton && directory ? (
                  <ClaimOrganizerButton
                    directoryId={directory.id}
                    organizerName={organizerName}
                  />
                ) : followOrganizerId ? (
                  <FollowOrganizerButton
                    organizerId={followOrganizerId}
                    organizerName={organizerName}
                    initialIsFollowing={isFollowing}
                  />
                ) : null}
              </div>
            ) : null}

            <div className="py-10">
              <h2 className="text-3xl font-bold text-slate-900">
                Informazioni sull&apos;evento
              </h2>

              <div className="mt-5">
                <EventDescription description={event.description} />
              </div>
            </div>

            {event.youtube_url ? (
              <div className="border-t border-slate-200">
                <EventYouTubePlayer
                  youtubeUrl={event.youtube_url}
                  title={event.title}
                />
              </div>
            ) : null}

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
                  pricing.isFree ? "text-emerald-600" : "text-[#E67E22]"
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
                    {pricing.isFree ? "Prenota" : "Acquista il biglietto"}
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
                  {pricing.isFree
                    ? "La prenotazione è gestita sul sito esterno indicato dall’organizzatore."
                    : "La biglietteria è gestita sul sito esterno indicato dall'organizzatore."}
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
