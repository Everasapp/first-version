"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import styles from "./HotWeekSideAds.module.css";

const AUTOPLAY_MS = 4500;
const SCROLL_MS = 480;
const NARROW_MQ = "(max-width: 767px)";

type AdDef = {
  id: string;
  storageKey: string;
  href: string;
  ariaLabel: string;
  linkLabel: string;
  imageSrc: string;
  imageAlt: string;
  /** Se false, apre nella stessa tab (link interni EVERAS). Default: esterno. */
  external?: boolean;
};

const STATIC_ADS: AdDef[] = [
  {
    id: "everas-advertise",
    storageKey: "everas-advertise-promo-dismissed",
    href: "/pubblicita",
    ariaLabel: "Pubblicizza la tua attività su EVERAS",
    linkLabel: "Metti un banner della tua attività su EVERAS — Special Prezzo Lancio",
    imageSrc: "/images/ads/everas-advertise-promo.gif",
    imageAlt:
      "Metti un banner della tua attività su EVERAS. Special Prezzo Lancio.",
    external: false,
  },
  {
    id: "monstera",
    storageKey: "everas-monstera-hotweek-dismissed",
    href: "https://www.google.com/maps/search/?api=1&query=Monstera%20Via%20Predda%20Niedda%2037f%20Sassari",
    ariaLabel: "Pubblicità Monstera",
    linkLabel: "Monstera — Sala per feste, eventi e workshop a Sassari",
    imageSrc: "/images/monstera/monstera-stairs.gif",
    imageAlt:
      "Monstera — Sala per Feste, Eventi e Workshop. Via Predda Niedda 37/f, Sassari. Tel. 339 542 2343",
  },
  {
    id: "zoe",
    storageKey: "everas-zoe-hotweek-dismissed",
    href: "https://www.facebook.com/Zoe.talenti.corsi.eventi.progetti",
    ariaLabel: "Pubblicità Zoe Academy",
    linkLabel: "Laboratori ZOE — corsi e eventi per bambini a Sassari",
    imageSrc: "/images/zoe/zoe-robot.gif",
    imageAlt:
      "Laboratori ZOE — robot LEGO per bambini. Corsi e workshop a Sassari",
  },
];

export type PaidHomeAd = {
  id: string;
  companyName: string;
  href: string;
  imageSrc: string;
};

function paidAdToDef(ad: PaidHomeAd): AdDef {
  return {
    id: `paid-${ad.id}`,
    storageKey: `everas-paid-ad-${ad.id}-dismissed`,
    href: ad.href,
    ariaLabel: `Pubblicità ${ad.companyName}`,
    linkLabel: ad.companyName,
    imageSrc: ad.imageSrc,
    imageAlt: ad.companyName,
  };
}

function SponsoredAdSlide({
  ad,
  onDismiss,
  clone = false,
}: {
  ad: AdDef;
  onDismiss: (id: string) => void;
  clone?: boolean;
}) {
  return (
    <aside
      className={styles.item}
      data-ad-card
      data-ad-id={ad.id}
      data-ad-clone={clone ? "1" : undefined}
      aria-label={ad.ariaLabel}
      aria-hidden={clone || undefined}
    >
      <div className={styles.card}>
        <button
          type="button"
          className={styles.close}
          onClick={() => onDismiss(ad.id)}
          aria-label="Chiudi pubblicità"
          tabIndex={clone ? -1 : undefined}
        >
          <X aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <a
          className={styles.link}
          href={ad.href}
          {...(ad.external === false
            ? {}
            : {
                target: "_blank",
                rel: "noopener noreferrer sponsored",
              })}
          aria-label={ad.linkLabel}
          tabIndex={clone ? -1 : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- GIF/JPG promo assets must play/render without optimizer */}
          <img
            src={ad.imageSrc}
            alt={clone ? "" : ad.imageAlt}
            className={styles.image}
            decoding="async"
            loading={clone ? "lazy" : "eager"}
          />
        </a>
      </div>
    </aside>
  );
}

/**
 * Sponsored strip:
 * - mobile: horizontal carousel + infinite loop autoplay
 * - tablet/desktop: static row if ads fit; carousel only when they overflow
 */
export default function HomeSponsoredSection({
  paidAds = [],
}: {
  paidAds?: PaidHomeAd[];
}) {
  const ADS = [...paidAds.map(paidAdToDef), ...STATIC_ADS];
  const adsKey = ADS.map((ad) => ad.id).join("|");
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const animTimerRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  // Mostra subito i banner (anche in SSR); poi filtra eventuali dismiss in sessionStorage.
  const [visibleIds, setVisibleIds] = useState<string[]>(() =>
    ADS.map((ad) => ad.id),
  );
  const [isNarrow, setIsNarrow] = useState(false);
  const [desktopOverflows, setDesktopOverflows] = useState(false);

  useEffect(() => {
    const next: string[] = [];
    for (const ad of ADS) {
      try {
        if (window.sessionStorage.getItem(ad.storageKey) === "1") continue;
      } catch {
        // ignore
      }
      next.push(ad.id);
    }
    setVisibleIds(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when ad set changes
  }, [adsKey]);

  useEffect(() => {
    const mq = window.matchMedia(NARROW_MQ);
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  function dismiss(id: string) {
    const ad = ADS.find((item) => item.id === id);
    if (!ad) return;
    try {
      window.sessionStorage.setItem(ad.storageKey, "1");
    } catch {
      // ignore
    }
    setVisibleIds((current) => current.filter((item) => item !== id));
    indexRef.current = 0;
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTo({ left: 0, behavior: "auto" });
  }

  const ads = ADS.filter((ad) => visibleIds.includes(ad.id));
  const useCarousel = ads.length > 1 && (isNarrow || desktopOverflows);
  const slides = useCarousel ? [...ads, ...ads] : ads;

  useEffect(() => {
    if (isNarrow) {
      setDesktopOverflows(false);
      return;
    }

    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller) return;

    const measure = () => {
      const realCards = Array.from(
        scroller.querySelectorAll<HTMLElement>(
          "[data-ad-card]:not([data-ad-clone])",
        ),
      );
      if (realCards.length === 0) {
        setDesktopOverflows(false);
        return;
      }

      const first = realCards[0].getBoundingClientRect();
      const last = realCards[realCards.length - 1].getBoundingClientRect();
      const contentWidth = last.right - first.left;
      setDesktopOverflows(contentWidth > container.clientWidth + 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [isNarrow, ads.length, visibleIds.join("|")]);

  function cardOffsets() {
    const scroller = scrollerRef.current;
    if (!scroller) return [] as number[];
    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-ad-card]"),
    );
    const scrollLeft = scroller.scrollLeft;
    const scrollerLeft = scroller.getBoundingClientRect().left;
    return cards.map(
      (card) =>
        card.getBoundingClientRect().left - scrollerLeft + scrollLeft,
    );
  }

  function goNext() {
    const scroller = scrollerRef.current;
    if (!scroller || !useCarousel || ads.length < 2) return;

    const offsets = cardOffsets();
    if (offsets.length < 2) return;

    const realCount = ads.length;
    const next = indexRef.current + 1;

    if (animTimerRef.current !== null) {
      window.clearTimeout(animTimerRef.current);
    }

    scroller.style.scrollSnapType = "none";
    scroller.scrollTo({ left: offsets[next], behavior: "smooth" });
    indexRef.current = next;

    if (next >= realCount) {
      animTimerRef.current = window.setTimeout(() => {
        const resetTo = next - realCount;
        const latest = cardOffsets();
        scroller.scrollTo({
          left: latest[resetTo] ?? 0,
          behavior: "auto",
        });
        indexRef.current = resetTo;
        scroller.style.scrollSnapType = "";
        animTimerRef.current = null;
      }, SCROLL_MS);
    } else {
      animTimerRef.current = window.setTimeout(() => {
        scroller.style.scrollSnapType = "";
        animTimerRef.current = null;
      }, SCROLL_MS);
    }
  }

  useEffect(() => {
    if (!useCarousel || isPaused) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      goNext();
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [useCarousel, isPaused, ads.length]);

  useEffect(() => {
    return () => {
      if (animTimerRef.current !== null) {
        window.clearTimeout(animTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!useCarousel) {
      indexRef.current = 0;
      scrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [useCarousel]);

  if (visibleIds.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Pubblicità"
      className="relative overflow-x-clip border-b border-slate-200 bg-slate-50 py-8 sm:py-10"
    >
      <div
        ref={containerRef}
        className="relative mx-auto w-full min-w-0 max-w-7xl px-5 sm:px-8"
      >
        <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500">
          Pubblicità
        </p>
        <div className="relative w-full min-w-0">
          <div
            ref={scrollerRef}
            onMouseEnter={() => useCarousel && setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => useCarousel && setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            onPointerDown={() => useCarousel && setIsPaused(true)}
            onTouchStart={() => useCarousel && setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className={
              useCarousel
                ? "w-full min-w-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth py-2 [touch-action:pan-x_pan-y] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : "w-full min-w-0 overflow-visible py-2"
            }
          >
            <div
              className={
                useCarousel
                  ? "flex h-full w-max max-w-none items-stretch gap-4 sm:gap-5"
                  : "flex h-full flex-wrap items-stretch justify-start gap-4 sm:gap-5"
              }
            >
              {slides.map((ad, index) => (
                <SponsoredAdSlide
                  key={`${ad.id}-${index}`}
                  ad={ad}
                  onDismiss={dismiss}
                  clone={useCarousel && index >= ads.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
