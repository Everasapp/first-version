"use client";

import dynamic from "next/dynamic";

const EventSearchForm = dynamic(
  () => import("@/src/components/home/EventSearchForm"),
  {
    ssr: false,
    loading: () => (
      <div
        className="mt-5 h-24 animate-pulse rounded-2xl bg-white/15 sm:mt-6 sm:h-28"
        aria-hidden
      />
    ),
  },
);

export default function HeroSearchLazy() {
  return <EventSearchForm />;
}
