"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import {
  EVERAS_SELF_PROMO_ORDER_ID,
  MONSTERA_PROMO_ORDER_ID,
  ZOE_PROMO_ORDER_ID,
  MC_DESIGN_PROMO_ORDER_ID,
} from "@/src/lib/ads/types";
import { resolveSponsoredMedia } from "@/src/lib/ads/sponsored-creative-media";
import SponsoredMedia from "@/src/components/ads/SponsoredMedia";
import styles from "./HotWeekSideAds.module.css";

const AUTOPLAY_MS = 4500;
const SCROLL_MS = 480;
const NARROW_MQ = "(max-width: 767px)";
/** Load video only when the strip is near the viewport — keep margin tight. */
const SECTION_ROOT_MARGIN = "48px 0px";

type AdDef = {
  id: string;
  storageKey: string;
  href: string;
  ariaLabel: string;
  linkLabel: string;
  imageSrc: string;
  imageAlt: string;
  mediaType: "image" | "video";
  posterUrl?: string;
  videoWebmUrl?: string;
  videoMp4Url?: string;
  /** Se false, apre nella stessa tab (link interni EVERAS). Default: esterno. */
  external?: boolean;
  /** Ordine pubblicitario pagato (per tracking). */
  orderId?: string;
};

const PARTNER_AD_COPY: Record<
  string,
  { ariaLabel: string; linkLabel: string; imageAlt: string }
> = {
  [MONSTERA_PROMO_ORDER_ID]: {
    ariaLabel: "Pubblicità Monstera",
    linkLabel: "Monstera — Sala per feste, eventi e workshop a Sassari",
    imageAlt:
      "Monstera — Sala per Feste, Eventi e Workshop. Via Predda Niedda 37/f, Sassari. Tel. 339 542 2343",
  },
  [ZOE_PROMO_ORDER_ID]: {
    ariaLabel: "Pubblicità Zoe Academy",
    linkLabel: "Laboratori ZOE — corsi e eventi per bambini a Sassari",
    imageAlt:
      "Laboratori ZOE — robot LEGO per bambini. Corsi e workshop a Sassari",
  },
  [MC_DESIGN_PROMO_ORDER_ID]: {
    ariaLabel: "Pubblicità MC Design",
    linkLabel: "MC Design — Siti web, e-commerce e app",
    imageAlt:
      "MC Design — Digital partner. Siti web, e-commerce e app.",
  },
};

const SPEAKING_FLUENTLY_AD: AdDef = {
  id: "speaking-fluently",
  storageKey: "everas-speaking-fluently-ad-dismissed",
  href: "mailto:m.canalis@live.it",
  ariaLabel: "Contatta Speaking Fluently via email",
  linkLabel: "Scrivi a Speaking Fluently per le lezioni di conversazione inglese",
  imageSrc: "/images/ads/speaking-fluently-banner.webp",
  imageAlt:
    "Speaking Fluently, lezioni di conversazione inglese in presenza a Sassari oppure online",
  mediaType: "image",
  external: false,
};

export type PaidHomeAd = {
  id: string;
  orderId: string;
  companyName: string;
  href: string;
  imageSrc: string;
  external?: boolean;
  posterUrl?: string;
  videoWebmUrl?: string;
  videoMp4Url?: string;
  mediaType?: "image" | "video";
};

function paidAdToDef(ad: PaidHomeAd): AdDef {
  const copy = PARTNER_AD_COPY[ad.orderId];
  const media =
    ad.mediaType === "video" &&
    ad.posterUrl &&
    ad.videoWebmUrl &&
    ad.videoMp4Url
      ? {
          mediaType: "video" as const,
          posterUrl: ad.posterUrl,
          videoWebmUrl: ad.videoWebmUrl,
          videoMp4Url: ad.videoMp4Url,
        }
      : resolveSponsoredMedia(ad.imageSrc);

  return {
    id: `paid-${ad.id}`,
    storageKey: `everas-paid-ad-${ad.id}-dismissed`,
    href: ad.href,
    ariaLabel: copy?.ariaLabel ?? `Pubblicità ${ad.companyName}`,
    linkLabel: copy?.linkLabel ?? ad.companyName,
    imageSrc: ad.imageSrc,
    imageAlt: copy?.imageAlt ?? ad.companyName,
    mediaType: media.mediaType,
    posterUrl: media.posterUrl,
    videoWebmUrl: media.videoWebmUrl,
    videoMp4Url: media.videoMp4Url,
    orderId: ad.orderId,
    external:
      ad.external === false
        ? false
        : ad.href.startsWith("/")
          ? false
          : undefined,
  };
}

function trackAdEvent(orderId: string, event: "impression" | "click") {
  const payload = JSON.stringify({ orderId, event });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon("/api/advertising/track", blob)) return;
    }
  } catch {
    // fallback sotto
  }

  void fetch("/api/advertising/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // non bloccare UX
  });
}

function markImpressionOnce(orderId: string, adId: string) {
  const key = `everas-ad-imp-${adId}`;

  try {
    if (window.sessionStorage.getItem(key) === "1") return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // se sessionStorage non è disponibile, conta comunque una volta in-memory
  }

  trackAdEvent(orderId, "impression");
}

function SponsoredAdSlide({
  ad,
  onDismiss,
  clone = false,
  sectionInView,
  isActive,
  reducedMotion,
}: {
  ad: AdDef;
  onDismiss: (id: string) => void;
  clone?: boolean;
  sectionInView: boolean;
  isActive: boolean;
  reducedMotion: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const seenRef = useRef(false);

  useEffect(() => {
    if (clone || !ad.orderId || seenRef.current) return;

    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || entry.intersectionRatio < 0.5) return;
        if (seenRef.current) return;

        seenRef.current = true;
        markImpressionOnce(ad.orderId!, ad.id);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [ad.id, ad.orderId, clone]);

  return (
    <aside
      ref={rootRef}
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
          <X
            aria-hidden="true"
            className="h-4 w-4"
            strokeWidth={2.5}
          />
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
          onClick={() => {
            if (!clone && ad.orderId) {
              trackAdEvent(ad.orderId, "click");
            }
          }}
        >
          <SponsoredMedia
            imageSrc={ad.imageSrc}
            imageAlt={clone ? "" : ad.imageAlt}
            mediaType={ad.mediaType}
            posterUrl={ad.posterUrl}
            videoWebmUrl={ad.videoWebmUrl}
            videoMp4Url={ad.videoMp4Url}
            sectionInView={sectionInView}
            isActive={isActive}
            isClone={clone}
            reducedMotion={reducedMotion}
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
 * - dismiss is in-memory only: after refresh the banners reappear
 * - mapped GIF creatives render as poster + lazy video (never request GIF)
 */
export default function HomeSponsoredSection({
  paidAds = [],
}: {
  paidAds?: PaidHomeAd[];
}) {
  const ADS = [
    ...paidAds
      .filter((ad) => ad.orderId !== EVERAS_SELF_PROMO_ORDER_ID)
      .map(paidAdToDef),
    SPEAKING_FLUENTLY_AD,
  ];
  const adsKey = ADS.map((ad) => ad.id).join("|");

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const animTimerRef = useRef<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [dismissAdsKey, setDismissAdsKey] = useState(adsKey);
  const [isNarrow, setIsNarrow] = useState(false);
  const [desktopOverflows, setDesktopOverflows] = useState(false);
  const [sectionInView, setSectionInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Reset dismiss when the ad set changes (adjust state during render).
  if (dismissAdsKey !== adsKey) {
    setDismissAdsKey(adsKey);
    setDismissedIds([]);
  }

  useEffect(() => {
    const mq = window.matchMedia(NARROW_MQ);

    const sync = () => setIsNarrow(mq.matches);

    sync();
    mq.addEventListener("change", sync);

    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setReducedMotion(mq.matches);

    sync();
    mq.addEventListener("change", sync);

    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // Safe fallback: keep posters only (sectionInView stays false).
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry) return;

        if (entry.isIntersecting) {
          setSectionInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: SECTION_ROOT_MARGIN,
        threshold: 0.01,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [adsKey]);

  function dismiss(id: string) {
    setDismissedIds((current) =>
      current.includes(id) ? current : [...current, id],
    );

    indexRef.current = 0;
    setActiveIndex(0);

    const scroller = scrollerRef.current;

    if (scroller) {
      scroller.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }
  }

  const ads = ADS.filter((ad) => !dismissedIds.includes(ad.id));
  const adsDismissKey = dismissedIds.join("|");
  const effectiveOverflows = isNarrow ? false : desktopOverflows;
  const useCarousel =
    ads.length > 1 && (isNarrow || effectiveOverflows);

  // Duplicati solo su mobile per il loop infinito; su desktop una sola copia di ciascun banner.
  const loopWithClones = useCarousel && isNarrow;
  const slides = loopWithClones ? [...ads, ...ads] : ads;

  useEffect(() => {
    if (isNarrow) return;

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
      const last =
        realCards[realCards.length - 1].getBoundingClientRect();

      const contentWidth = last.right - first.left;

      setDesktopOverflows(
        contentWidth > container.clientWidth + 2,
      );
    };

    const ro = new ResizeObserver(measure);

    ro.observe(container);

    const raf = window.requestAnimationFrame(measure);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [isNarrow, ads.length, adsDismissKey]);

  function cardOffsets() {
    const scroller = scrollerRef.current;

    if (!scroller) return [] as number[];

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-ad-card]"),
    );

    const scrollLeft = scroller.scrollLeft;
    const scrollerLeft =
      scroller.getBoundingClientRect().left;

    return cards.map(
      (card) =>
        card.getBoundingClientRect().left -
        scrollerLeft +
        scrollLeft,
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

    if (loopWithClones) {
      scroller.scrollTo({
        left: offsets[next],
        behavior: "smooth",
      });

      indexRef.current = next;
      setActiveIndex(next % realCount);

      if (next >= realCount) {
        animTimerRef.current = window.setTimeout(() => {
          const resetTo = next - realCount;
          const latest = cardOffsets();

          scroller.scrollTo({
            left: latest[resetTo] ?? 0,
            behavior: "auto",
          });

          indexRef.current = resetTo;
          setActiveIndex(resetTo);
          scroller.style.scrollSnapType = "";
          animTimerRef.current = null;
        }, SCROLL_MS);
      } else {
        animTimerRef.current = window.setTimeout(() => {
          scroller.style.scrollSnapType = "";
          animTimerRef.current = null;
        }, SCROLL_MS);
      }

      return;
    }

    // Desktop: scroll senza cloni, al fondo torna al primo.
    const targetIndex = next >= realCount ? 0 : next;

    scroller.scrollTo({
      left: offsets[targetIndex] ?? 0,
      behavior: "smooth",
    });

    indexRef.current = targetIndex;
    setActiveIndex(targetIndex);

    animTimerRef.current = window.setTimeout(() => {
      scroller.style.scrollSnapType = "";
      animTimerRef.current = null;
    }, SCROLL_MS);
  }

  useEffect(() => {
    if (!useCarousel || isPaused) return;
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      goNext();
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [useCarousel, isPaused, ads.length, reducedMotion]);

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

      // Static row treats every slide as active; activeIndex is unused then.
      scrollerRef.current?.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }
  }, [useCarousel]);

  if (ads.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Pubblicità"
      className="relative overflow-x-clip border-b border-slate-200 bg-slate-50 py-8 sm:py-10"
    >
      <div
        ref={containerRef}
        className="relative mx-auto w-full min-w-0 max-w-7xl px-5 sm:px-8"
      >
        <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500">
          Pubblicità
        </p>
        <p className="mb-3 text-sm text-slate-600">
          Scopri le offerte dei nostri partner: clicca sui banner per vedere le
          promozioni.
        </p>

        <div className="relative w-full min-w-0">
          <div
            ref={scrollerRef}
            onMouseEnter={() =>
              useCarousel && setIsPaused(true)
            }
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() =>
              useCarousel && setIsPaused(true)
            }
            onBlurCapture={() => setIsPaused(false)}
            onPointerDown={() =>
              useCarousel && setIsPaused(true)
            }
            onTouchStart={() =>
              useCarousel && setIsPaused(true)
            }
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
              {slides.map((ad, index) => {
                const isClone =
                  loopWithClones && index >= ads.length;

                const slideActive = useCarousel
                  ? index % ads.length === activeIndex
                  : true;

                return (
                  <SponsoredAdSlide
                    key={`${ad.id}-${index}`}
                    ad={ad}
                    onDismiss={dismiss}
                    clone={isClone}
                    sectionInView={sectionInView}
                    isActive={slideActive}
                    reducedMotion={reducedMotion}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
