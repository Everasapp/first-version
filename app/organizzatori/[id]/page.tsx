import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";

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
import {
  parseOrganizerDirectoryPublic,
  type OrganizerDirectoryPublic,
} from "@/src/lib/organizer-claim";
import {
  ORGANIZER_DIRECTORY_PUBLIC_SELECT,
  asHttpUrl,
  getOrganizerDirectoryHref,
  isProfileUuidParam,
  organizerKindLabel,
  splitOrganizerEvents,
  type OrganizerEventRow,
} from "@/src/lib/organizer-page";
import { isOrganizerRole, PROFILE_SELECT, type Profile } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";
import { breadcrumbListSchema } from "@/src/lib/seo/schema";

type OrganizerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EVENT_SELECT =
  "id, slug, title, category, categories, province, municipality, location_name, start_at, end_at, image_url, is_free, price_from, is_featured, views_count, favorites_count, shares_count";

type ResolvedPage =
  | {
      kind: "directory";
      directory: OrganizerDirectoryPublic;
      isOwnerPreview: boolean;
    }
  | {
      kind: "profile";
      organizer: Profile;
    };

async function loadDirectoryEvents(
  supabase: Awaited<ReturnType<typeof createClient>>,
  directoryId: string,
) {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("organizer_directory_id", directoryId)
    .eq("status", "published")
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(`Impossibile caricare gli eventi: ${error.message}`);
  }

  return (data ?? []) as OrganizerEventRow[];
}

async function canPreviewDirectory(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string | undefined,
  claimedBy: string | null,
) {
  if (!userId) return false;
  if (claimedBy === userId) return true;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return data?.role === "admin";
}

async function resolveOrganizerPage(param: string): Promise<ResolvedPage> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canPreview = (claimedBy: string | null) =>
    canPreviewDirectory(supabase, user?.id, claimedBy);

  if (isProfileUuidParam(param)) {
    const [{ data: organizerData }, { data: directoryById }] = await Promise.all([
      supabase.from("profiles").select(PROFILE_SELECT).eq("id", param).maybeSingle(),
      supabase
        .from("organizer_directory_public")
        .select(ORGANIZER_DIRECTORY_PUBLIC_SELECT)
        .eq("id", param)
        .maybeSingle(),
    ]);

    const directoryFromId = parseOrganizerDirectoryPublic(directoryById);
    const directoryHref = getOrganizerDirectoryHref(directoryFromId);
    if (directoryHref) {
      redirect(directoryHref);
    }

    const organizer = organizerData as Profile | null;
    if (organizer && isOrganizerRole(organizer.role)) {
      const { data: claimed } = await supabase
        .from("organizer_directory_public")
        .select(ORGANIZER_DIRECTORY_PUBLIC_SELECT)
        .eq("claimed_by_profile_id", organizer.id)
        .eq("public_page_enabled", true)
        .not("slug", "is", null)
        .limit(1)
        .maybeSingle();

      const claimedDirectory = parseOrganizerDirectoryPublic(claimed);
      const claimedHref = getOrganizerDirectoryHref(claimedDirectory);
      if (claimedHref) {
        redirect(claimedHref);
      }

      return { kind: "profile", organizer };
    }

    if (directoryFromId) {
      const preview = await canPreview(directoryFromId.claimed_by_profile_id);
      if (!directoryFromId.public_page_enabled && !preview) {
        notFound();
      }
      return {
        kind: "directory",
        directory: directoryFromId,
        isOwnerPreview: !directoryFromId.public_page_enabled && preview,
      };
    }

    notFound();
  }

  const { data: directoryData } = await supabase
    .from("organizer_directory_public")
    .select(ORGANIZER_DIRECTORY_PUBLIC_SELECT)
    .eq("slug", param)
    .maybeSingle();

  const directory = parseOrganizerDirectoryPublic(directoryData);
  if (!directory) {
    notFound();
  }

  const preview = await canPreview(directory.claimed_by_profile_id);
  if (!directory.public_page_enabled && !preview) {
    notFound();
  }

  return {
    kind: "directory",
    directory,
    isOwnerPreview: !directory.public_page_enabled && preview,
  };
}

export async function generateMetadata({
  params,
}: OrganizerPageProps): Promise<Metadata> {
  const { id } = await params;
  const resolved = await resolveOrganizerPage(id);

  if (resolved.kind === "directory") {
    const { directory } = resolved;
    const path = `/organizzatori/${directory.slug || directory.id}`;
    const description =
      directory.public_description?.trim() ||
      `Calendario eventi di ${directory.name} in Sardegna. Scopri tutti gli appuntamenti su EVERAS.`;

    return {
      title: directory.name,
      description,
      robots: resolved.isOwnerPreview
        ? { index: false, follow: false }
        : undefined,
      alternates: { canonical: path },
      openGraph: {
        title: `${directory.name} | EVERAS`,
        description,
        url: path,
        type: "profile",
        images: defaultOgImages(),
      },
      twitter: {
        card: "summary_large_image",
        title: `${directory.name} | EVERAS`,
        description,
        images: defaultOgImages().map((image) => image.url),
      },
    };
  }

  const name = getOrganizerDisplayName(resolved.organizer);
  const description = `Eventi organizzati da ${name} in Sardegna. Scopri il calendario aggiornato su EVERAS.`;

  return {
    title: name,
    description,
    alternates: { canonical: `/organizzatori/${resolved.organizer.id}` },
    openGraph: {
      title: `${name} | EVERAS`,
      description,
      url: `/organizzatori/${resolved.organizer.id}`,
      type: "profile",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | EVERAS`,
      description,
      images: defaultOgImages().map((image) => image.url),
    },
  };
}

export default async function OrganizerPublicPage({
  params,
}: OrganizerPageProps) {
  const { id } = await params;
  const resolved = await resolveOrganizerPage(id);
  const supabase = await createClient();
  const [favoriteIds, followedIds] = await Promise.all([
    getCurrentUserFavoriteIds(),
    getCurrentUserFollowedOrganizerIds(),
  ]);

  if (resolved.kind === "directory") {
    const events = await loadDirectoryEvents(supabase, resolved.directory.id);
    const { upcoming, past } = splitOrganizerEvents(events, favoriteIds);
    return (
      <DirectoryOrganizerPage
        directory={resolved.directory}
        upcoming={upcoming}
        past={past}
        isFollowing={
          resolved.directory.claimed_by_profile_id
            ? followedIds.has(resolved.directory.claimed_by_profile_id)
            : false
        }
        isOwnerPreview={resolved.isOwnerPreview}
      />
    );
  }

  const { data: eventsData, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("organizer_id", resolved.organizer.id)
    .eq("status", "published")
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(`Impossibile caricare gli eventi: ${error.message}`);
  }

  const { upcoming } = splitOrganizerEvents(
    (eventsData ?? []) as OrganizerEventRow[],
    favoriteIds,
  );

  return (
    <ProfileOrganizerPage
      organizer={resolved.organizer}
      cards={upcoming}
      isFollowing={followedIds.has(resolved.organizer.id)}
    />
  );
}

function firstAddressLine(value: string | null) {
  if (!value) return null;
  return value.split(/[;|]/)[0]?.trim() || null;
}

function DirectoryOrganizerPage({
  directory,
  upcoming,
  past,
  isFollowing,
  isOwnerPreview,
}: {
  directory: OrganizerDirectoryPublic;
  upcoming: EventCardData[];
  past: EventCardData[];
  isFollowing: boolean;
  isOwnerPreview: boolean;
}) {
  const path = `/organizzatori/${directory.slug || directory.id}`;
  const website = asHttpUrl(directory.website);
  const facebook = asHttpUrl(directory.facebook);
  const instagram = asHttpUrl(directory.instagram);
  const phoneHref = directory.phone?.trim()
    ? `tel:${directory.phone.replace(/[^\d+]/g, "")}`
    : null;
  const sameAs = [website, facebook, instagram].filter(
    (value): value is string => Boolean(value),
  );
  const kind = organizerKindLabel(directory.name);
  const displayAddress = firstAddressLine(directory.address);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: directory.name,
          url: absoluteUrl(path),
          description: directory.public_description || undefined,
          telephone: directory.phone || undefined,
          address: displayAddress
            ? {
                "@type": "PostalAddress",
                streetAddress: displayAddress,
                addressRegion: "Sardegna",
                addressCountry: "IT",
              }
            : undefined,
          sameAs: sameAs.length > 0 ? sameAs : undefined,
        }}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: directory.name, path },
        ])}
      />

      <Header />

      <main className="min-h-screen bg-white">
        {isOwnerPreview ? (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-center text-sm font-medium text-amber-900">
            Anteprima: questa pagina non è ancora pubblica.{" "}
            <Link href="/dashboard/pagina" className="font-bold underline">
              Pubblicala dalla dashboard
            </Link>
          </div>
        ) : null}

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 sm:pt-8">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Eventi", href: "/eventi" },
                { name: directory.name },
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
                  {kind}
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  {directory.name}
                </h1>
                {directory.public_description ? (
                  <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600">
                    {directory.public_description}
                  </p>
                ) : (
                  <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600">
                    Tutti gli appuntamenti organizzati da {directory.name} su
                    EVERAS.
                  </p>
                )}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-700">
                  {displayAddress ? (
                    <span className="inline-flex items-center gap-2">
                      <MapPin aria-hidden="true" className="h-4 w-4 text-[#075EAE]" />
                      {displayAddress}
                    </span>
                  ) : null}
                  {phoneHref && directory.phone ? (
                    <a
                      href={phoneHref}
                      className="inline-flex items-center gap-2 hover:text-[#075EAE]"
                    >
                      <Phone aria-hidden="true" className="h-4 w-4 text-[#075EAE]" />
                      {directory.phone}
                    </a>
                  ) : null}
                  {website ? (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-[#075EAE]"
                    >
                      <Globe aria-hidden="true" className="h-4 w-4 text-[#075EAE]" />
                      Sito web
                    </a>
                  ) : null}
                  {facebook ? (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-[#075EAE]"
                    >
                      <Share2 aria-hidden="true" className="h-4 w-4 text-[#075EAE]" />
                      Facebook
                    </a>
                  ) : null}
                  {instagram ? (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-[#075EAE]"
                    >
                      <Share2 aria-hidden="true" className="h-4 w-4 text-[#075EAE]" />
                      Instagram
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {directory.claimed_by_profile_id ? (
              <FollowOrganizerButton
                organizerId={directory.claimed_by_profile_id}
                organizerName={directory.name}
                initialIsFollowing={isFollowing}
              />
            ) : null}
          </div>
        </section>

        <EventSection
          title="Eventi in programma"
          empty={`Nessun evento in programma al momento per ${directory.name}.`}
          cards={upcoming}
        />

        {past.length > 0 ? (
          <div className="border-t border-slate-200 bg-slate-50">
            <EventSection
              title="Eventi passati"
              empty=""
              cards={past}
            />
          </div>
        ) : null}
      </main>
    </>
  );
}

function ProfileOrganizerPage({
  organizer,
  cards,
  isFollowing,
}: {
  organizer: Profile;
  cards: EventCardData[];
  isFollowing: boolean;
}) {
  const name = getOrganizerDisplayName(organizer);
  const path = `/organizzatori/${organizer.id}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name,
          url: absoluteUrl(path),
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
          { name, path },
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

        <EventSection
          title="Eventi in programma"
          empty="Questo organizzatore non ha eventi pubblicati al momento."
          cards={cards}
        />
      </main>
    </>
  );
}

function EventSection({
  title,
  empty,
  cards,
}: {
  title: string;
  empty: string;
  cards: EventCardData[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600">
        {cards.length}{" "}
        {cards.length === 1 ? "evento" : "eventi"}
      </p>

      {cards.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      ) : empty ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
          <p className="text-slate-600">{empty}</p>
          <Link
            href="/eventi"
            className="mt-6 inline-flex font-bold text-[#075EAE] hover:underline"
          >
            Esplora altri eventi
          </Link>
        </div>
      ) : null}
    </section>
  );
}
