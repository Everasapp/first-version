import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPin } from "lucide-react";

import FollowOrganizerButton from "@/src/components/events/FollowOrganizerButton";
import EventCard, {
  type EventCardData,
} from "@/src/components/home/EventCard";
import Header from "@/src/components/home/Header";
import Breadcrumbs from "@/src/components/seo/Breadcrumbs";
import JsonLd from "@/src/components/seo/JsonLd";
import { getCurrentUserFavoriteIds } from "@/src/lib/favorites";
import {
  getCurrentUserFollowedOrganizerIds,
  getOrganizerDisplayName,
} from "@/src/lib/follows";
import { resolveCategoryLabels } from "@/src/lib/event-categories";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { isOrganizerRole, PROFILE_SELECT, type Profile } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";
import { absoluteUrl } from "@/src/lib/seo/site";
import { breadcrumbListSchema } from "@/src/lib/seo/schema";

type OrganizerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categories?: string[] | null;
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

export async function generateMetadata({
  params,
}: OrganizerPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", id)
    .maybeSingle();

  const organizer = data as Profile | null;
  if (!organizer || !isOrganizerRole(organizer.role)) {
    return {
      title: "Organizzatore non trovato",
      robots: { index: false, follow: false },
    };
  }

  const name = getOrganizerDisplayName(organizer);
  const description = `Eventi organizzati da ${name} in Sardegna. Scopri il calendario aggiornato su EVERAS.`;

  return {
    title: name,
    description,
    alternates: { canonical: `/organizzatori/${id}` },
    openGraph: {
      title: `${name} | EVERAS`,
      description,
      url: `/organizzatori/${id}`,
      type: "profile",
    },
  };
}

export default async function OrganizerPublicPage({
  params,
}: OrganizerPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: organizerData, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossibile caricare l’organizzatore: ${error.message}`);
  }

  const organizer = organizerData as Profile | null;

  if (!organizer || !isOrganizerRole(organizer.role)) {
    notFound();
  }

  const [
    { data: eventsData },
    favoriteIds,
    followedIds,
  ] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, slug, title, category, categories, province, municipality, location_name, start_at, end_at, image_url, is_free, price_from, is_featured",
      )
      .eq("organizer_id", organizer.id)
      .eq("status", "published")
      .order("start_at", { ascending: true }),
    getCurrentUserFavoriteIds(),
    getCurrentUserFollowedOrganizerIds(),
  ]);

  const now = new Date();
  const cards: EventCardData[] = ((eventsData ?? []) as EventRow[])
    .filter((event) =>
      isPublicEventActive(event.start_at, event.end_at, now),
    )
    .map((event) => {
      const pricing = resolveEventPricing(event.is_free, event.price_from);
      const categoryLabels = resolveCategoryLabels(event);

      return {
        id: event.slug,
        eventId: event.id,
        title: event.title,
        category: categoryLabels[0] ?? event.category,
        categories: categoryLabels,
        date: formatEventDate(event.start_at),
        startDate: event.start_at,
        endDate: event.end_at ?? undefined,
        location: event.location_name || event.municipality,
        area: event.province ?? undefined,
        imageUrl: event.image_url ?? "/images/concert.webp",
        isFree: pricing.isFree,
        priceFrom: pricing.priceFrom,
        isFeatured: event.is_featured,
        isFavorite: favoriteIds.has(event.id),
      };
    });

  const name = getOrganizerDisplayName(organizer);
  const isFollowing = followedIds.has(organizer.id);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name,
          url: absoluteUrl(`/organizzatori/${organizer.id}`),
          address: organizer.municipality
            ? {
                "@type": "PostalAddress",
                addressLocality: organizer.municipality,
                addressRegion: organizer.province || "Sardegna",
                addressCountry: "IT",
              }
            : undefined,
        }}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name, path: `/organizzatori/${organizer.id}` },
        ])}
      />

      <Header />

      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 sm:pt-8">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Eventi", href: "/eventi" },
                { name },
              ]}
            />
          </div>
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:pb-12">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-[#075EAE] shadow-sm">
                <Building2 aria-hidden="true" className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                  Organizzatore
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  {name}
                </h1>
                {(organizer.municipality || organizer.province) && (
                  <p className="mt-3 flex items-center gap-2 text-slate-600">
                    <MapPin aria-hidden="true" className="h-4 w-4 text-[#075EAE]" />
                    {[organizer.municipality, organizer.province]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            </div>

            <FollowOrganizerButton
              organizerId={organizer.id}
              organizerName={name}
              initialIsFollowing={isFollowing}
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Eventi in programma
          </h2>
          <p className="mt-2 text-slate-600">
            {cards.length}{" "}
            {cards.length === 1 ? "evento pubblicato" : "eventi pubblicati"}
          </p>

          {cards.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <p className="text-slate-600">
                Questo organizzatore non ha eventi pubblicati al momento.
              </p>
              <Link
                href="/eventi"
                className="mt-6 inline-flex font-bold text-[#075EAE] hover:underline"
              >
                Esplora altri eventi
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
