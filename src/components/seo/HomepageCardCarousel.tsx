"use client";

import { useId, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export default function HomepageCardCarousel({ children, label }: { children: ReactNode; label: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  function move(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const distance = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  }
  return (
    <div className="relative min-w-0">
      <div className="mb-3 flex justify-end gap-2">
        <button type="button" onClick={() => move(-1)} aria-label={`${label}: scorri a sinistra`} aria-controls={id} className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 bg-white text-[#075EAE] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"><ChevronLeft aria-hidden="true" className="h-5 w-5" /></button>
        <button type="button" onClick={() => move(1)} aria-label={`${label}: scorri a destra`} aria-controls={id} className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 bg-white text-[#075EAE] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"><ChevronRight aria-hidden="true" className="h-5 w-5" /></button>
      </div>
      <div id={id} ref={scrollerRef} aria-label={label} role="region" tabIndex={0} className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-4 scroll-smooth [scrollbar-width:thin] [&>*]:w-[84%] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-[calc((100%-24px)/2)] lg:[&>*]:w-[calc((100%-48px)/3)]">
        {children}
      </div>
    </div>
  );
}
