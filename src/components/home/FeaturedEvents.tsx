"use client";

import { useMemo } from "react";
import Link from "next/link";

import EventCard, { type EventCardData } from "./EventCard";
import { useUserLocation } from "@/src/hooks/useUserLocation";
import { sortEventsByProximity } from "@/src/utils/nearby-city";

type FeaturedEventsProps = {
  events?: EventCardData[];
};

export default function FeaturedEvents({
  events = [],
}: FeaturedEventsProps) {
  const { coords } = useUserLocation();

  const featuredEvents = useMemo(() => {
    const featured = events.filter((event) => event.isFeatured);
    const ordered = coords
      ? sortEventsByProximity(featured, coords.lat, coords.lng)
      : featured;
    return ordered.slice(0, 3);
  }, [coords, events]);

  if (featuredEvents.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#075EAE]">
              Da non perdere
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Eventi in evidenza
            </h2>
          </div>

          <Link
            href="/eventi"
            className="hidden font-bold text-[#075EAE] hover:underline sm:inline"
          >
            Tutti gli eventi →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <Link
          href="/eventi"
          className="mt-8 inline-flex font-bold text-[#075EAE] hover:underline sm:hidden"
        >
          Tutti gli eventi →
        </Link>
      </div>
    </section>
  );
}
