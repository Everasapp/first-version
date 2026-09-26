"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import styles from "./HotWeekSideAds.module.css";

const STORAGE_KEY = "everas-zoe-hotweek-dismissed";

type ZoeHotWeekAdProps = {
  href?: string;
};

/**
 * Sponsored Zoe Academy ad for the home partners strip.
 */
export default function ZoeHotWeekAd({
  href = "https://www.facebook.com/Zoe.talenti.corsi.eventi.progetti",
}: ZoeHotWeekAdProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // ignore storage errors
    }
    setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <aside className={styles.item} data-ad-card aria-label="Pubblicità Zoe Academy">
      <div className={styles.card}>
        <button
          type="button"
          className={styles.close}
          onClick={dismiss}
          aria-label="Chiudi pubblicità"
        >
          <X aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <a
          className={styles.link}
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label="Laboratori ZOE — corsi e eventi per bambini a Sassari"
        >
          <Image
            src="/images/zoe/zoe-robot.gif"
            alt="Laboratori ZOE — robot LEGO per bambini. Corsi e workshop a Sassari"
            fill
            sizes="16.6rem"
            className={styles.image}
            unoptimized
          />
        </a>
      </div>
    </aside>
  );
}
