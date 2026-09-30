"use client";

import dynamic from "next/dynamic";

/**
 * Collapsed EventSearchForm heights measured on live mobile/desktop
 * (chips + form, no open accordion / no geo message):
 *   412×915 → 342px | 640 → 350px | 768+ → 216px
 * The old h-24 (96px) placeholder caused the 0.145 CLS on “Hot this week”.
 */
function HeroSearchFallback() {
  return (
    <div className="mt-5 sm:mt-6" aria-hidden>
      {/* Quick-filter chips row — matches ~29–30.5px live height */}
      <div className="flex h-7 items-center gap-1.5 sm:h-[30.5px]">
        <div className="h-6 w-[4.75rem] shrink-0 rounded-full bg-white/25" />
        <div className="h-6 w-[5.5rem] shrink-0 rounded-full bg-white/15" />
        <div className="h-6 w-[5.75rem] shrink-0 rounded-full bg-white/15" />
        <div className="h-6 w-[4.75rem] shrink-0 rounded-full bg-white/15" />
      </div>

      {/* Mobile accordion shell — 305px @412 / 309px @640 */}
      <div className="mt-2 flex h-[305px] flex-col rounded-xl border border-white/40 bg-white/95 p-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)] sm:h-[309px] sm:rounded-2xl sm:p-2.5 md:hidden">
        <div className="min-h-0 flex-1">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 border-b border-slate-100 py-2 last:border-b-0"
            >
              <div className="h-8 w-8 shrink-0 rounded-full bg-[#075EAE]/10" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-1.5 w-10 rounded bg-slate-200/90" />
                <div className="h-2.5 w-28 max-w-full rounded bg-slate-300/80" />
              </div>
              <div className="h-3.5 w-3.5 shrink-0 rounded-sm bg-slate-200/90" />
            </div>
          ))}
        </div>
        <div className="mt-1.5 h-9 shrink-0 rounded-xl bg-[#E67E22]/90" />
      </div>

      {/* Desktop / tablet shell — ~173–175px content under chips */}
      <div className="mt-2.5 hidden h-[175px] rounded-2xl border border-white/40 bg-white/95 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)] md:block" />
    </div>
  );
}

const EventSearchForm = dynamic(
  () => import("@/src/components/home/EventSearchForm"),
  {
    // SSR the collapsed form so first paint already has the final height.
    // loading UI is only for client-side transitions to the homepage.
    loading: () => <HeroSearchFallback />,
  },
);

export default function HeroSearchLazy() {
  return <EventSearchForm />;
}
