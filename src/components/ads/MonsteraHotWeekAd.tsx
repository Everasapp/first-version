"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import styles from "./MonsteraHotWeekAd.module.css";

const STORAGE_KEY = "everas-monstera-hotweek-dismissed";

type MonsteraHotWeekAdProps = {
  href?: string;
};

/**
 * Sponsored Monstera placement beside Hot this week:
 * desktop = right gutter outside max content; tablet/mobile = overlay; dismissible.
 */
export default function MonsteraHotWeekAd({
  href = "https://www.google.com/maps/search/?api=1&query=Monstera%20Via%20Predda%20Niedda%2037f%20Sassari",
}: MonsteraHotWeekAdProps) {
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
    <aside className={styles.root} aria-label="Pubblicità">
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
          aria-label="Monstera — Sala per feste, eventi e workshop a Sassari"
        >
          <Image
            src="/images/monstera/monstera-stairs.gif"
            alt="Monstera — Sala per Feste, Eventi e Workshop. Via Predda Niedda 37/f, Sassari. Tel. 339 542 2343"
            width={747}
            height={1000}
            className={styles.image}
            unoptimized
            priority
          />
        </a>
      </div>
    </aside>
  );
}
