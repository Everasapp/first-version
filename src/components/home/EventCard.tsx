import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Radio,
  Star,
} from "lucide-react";

import FavoriteButton from "@/src/components/events/FavoriteButton";
import ShareEventButton from "@/src/components/events/ShareEventButton";
import { resolveEventPricing } from "@/src/lib/eventPricing";

export type EventCardData = {
  /** Slug used in `/eventi/[slug]` links */
  id: string;
  /** Database UUID used for favorites */
  eventId: string;
  title: string;
  /** Primary category display name (backward compatible). */
  category: string;
  /** All category display names. */
  categories?: string[];

  date: string;
  startDate: string;
  endDate?: string;

  location: string;
  /** Comune per ordinamento «vicino a me». */
  municipality?: string;
  area?: string;

  imageUrl: string;

  isFree: boolean;
  priceFrom?: number;

  isFeatured?: boolean;
  happeningNow?: boolean;
  /** Mostre / periodi lunghi attualmente aperti (tag blu). */
  isActiveEvent?: boolean;
  statusLabel?: string;
  isFavorite?: boolean;
};

type EventCardProps = {
  event: EventCardData;
};

export default function EventCard({ event }: EventCardProps) {
  const pricing = resolveEventPricing(event.isFree, event.priceFrom);
  const categoryLabels =
    event.categories?.length ? event.categories : [event.category];

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image
          src={event.imageUrl}
          alt={event.title}
          title={event.title}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 352px"
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized={
            !(
              event.imageUrl.startsWith("/") ||
              event.imageUrl.includes("supabase.co") ||
              event.imageUrl.includes("unsplash.com")
            )
          }
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {event.happeningNow && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                <span className="relative flex h-2 w-2 rounded-full bg-white" />
              </span>

              <Radio aria-hidden="true" className="h-3.5 w-3.5" />

              {event.statusLabel ?? "In corso"}
            </span>
          )}

          {!event.happeningNow && event.isActiveEvent && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#075EAE] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              {event.statusLabel ?? "Evento attivo"}
            </span>
          )}

          {event.isFeatured && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#E67E22] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              <Star
                aria-hidden="true"
                className="h-3.5 w-3.5 fill-white text-white"
              />
              In evidenza
            </span>
          )}

          {pricing.isFree && (
            <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              Gratuito
            </span>
          )}
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          <FavoriteButton
            eventId={event.eventId}
            eventTitle={event.title}
            initialIsFavorite={Boolean(event.isFavorite)}
          />
          <ShareEventButton
            title={event.title}
            slug={event.id}
            imageUrl={event.imageUrl}
            category={event.category}
            city={event.municipality || event.location}
            startAt={event.startDate}
            dateLabel={event.date}
          />
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {categoryLabels.map((label) => (
            <p
              key={label}
              className="text-xs font-bold uppercase tracking-[0.14em] text-[#075EAE]"
            >
              {label}
            </p>
          ))}
        </div>

        <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-snug text-slate-900">
          {event.title}
        </h3>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <CalendarDays
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
            />
            <span>{event.date}</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
            />
            <span>
              {event.location}
              {event.area ? ` · ${event.area}` : ""}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span
            className={`font-bold ${
              pricing.isFree ? "text-emerald-600" : "text-[#E67E22]"
            }`}
          >
            {pricing.label}
          </span>

          <Link
            href={`/eventi/${event.id}`}
            className="font-bold text-[#075EAE] transition hover:underline"
          >
            Scopri →
          </Link>
        </div>
      </div>
    </article>
  );
}
