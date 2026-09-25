"use client";

import dynamic from "next/dynamic";

const EventSearchForm = dynamic(
  () => import("@/src/components/home/EventSearchForm"),
  {
    ssr: false,
    loading: () => (
      <div
        className="mt-6 h-28 animate-pulse rounded-2xl bg-white/15 sm:mt-8 sm:h-32"
        aria-hidden
      />
    ),
  },
);

export default function HeroSearchLazy() {
  return <EventSearchForm />;
}
