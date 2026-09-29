import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Radio, Star } from "lucide-react";

import type { EventCardData } from "@/src/components/home/EventCard";
import { resolveEventPricing } from "@/src/lib/eventPricing";

type HubLiteEventCardProps = {
  event: EventCardData;
};

function formatEventPlace(event: EventCardData): string {
  const city = event.municipality?.trim();
  const venue = event.location?.trim();

  if (
    venue &&
    city &&
    venue.toLocaleLowerCase("it") !== city.toLocaleLowerCase("it")
  ) {
    return `${venue} · ${city}`;
  }

  return city || venue || "";
}

/**
 * Hub-only SSR card: crawlable showcase without favorites, share, or engagement.
 * Must not import FavoriteButton / ShareEventButton (keeps them out of the hub client graph).
 */
export default function HubLiteEventCard({ event }: HubLiteEventCardProps) {
  const pricing = resolveEventPricing(event.isFree, event.priceFrom);
  const categoryLabels =
    event.categories?.length ? event.categories : [event.category];
  const eventHref = `/eventi/${event.id}`;
  const place = formatEventPlace(event);

  return (
    <article className="group relative isolate flex h-full min-w-0 w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Image
          src={event.imageUrl}
          alt={event.title}
          title={event.title}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 352px"
          quality={55}
          priority={false}
          loading="lazy"
          fetchPriority="auto"
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />

        <div className="absolute left-4 top-4 z-[1] flex flex-wrap gap-2">
          {event.happeningNow ? (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                <span className="relative flex h-2 w-2 rounded-full bg-white" />
              </span>
              <Radio aria-hidden="true" className="h-3.5 w-3.5" />
              {event.statusLabel ?? "In corso"}
            </span>
          ) : null}

          {!event.happeningNow && event.isActiveEvent ? (
            <span className="flex items-center gap-1.5 rounded-full bg-[#075EAE] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              {event.statusLabel ?? "Evento attivo"}
            </span>
          ) : null}

          {event.isFeatured ? (
            <span className="flex items-center gap-1.5 rounded-full bg-[#E67E22] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              <Star
                aria-hidden="true"
                className="h-3.5 w-3.5 fill-white text-white"
              />
              In evidenza
            </span>
          ) : null}

          {pricing.isFree ? (
            <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              Gratuito
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
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

          {place ? (
            <div className="flex items-start gap-2">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
              />
              <span>{place}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <span
            className={`font-bold ${
              pricing.isFree ? "text-emerald-600" : "text-[#E67E22]"
            }`}
          >
            {pricing.label}
          </span>

          <span className="font-bold text-[#075EAE] transition group-hover:underline">
            Scopri →
          </span>
        </div>
      </div>

      <Link
        href={eventHref}
        className="absolute inset-0 z-10"
        aria-label={`Apri ${event.title}`}
      />
    </article>
  );
}
