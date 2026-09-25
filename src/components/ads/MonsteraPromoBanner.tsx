import Image from "next/image";

import styles from "./MonsteraPromoBanner.module.css";

type MonsteraPromoBannerProps = {
  /** Destination URL for the sponsor. */
  href?: string;
};

/**
 * Temporary sponsored placement (Monstera, Sassari).
 * CSS-only crossfade; no second analytics stack.
 */
export default function MonsteraPromoBanner({
  href = "https://www.google.com/maps/search/?api=1&query=Monstera%20spazio%20eventi%20Sassari",
}: MonsteraPromoBannerProps) {
  return (
    <aside className={`${styles.root} ${styles.slot}`} aria-label="Pubblicità">
      <p className={styles.label}>Pubblicità</p>
      <a
        className={styles.banner}
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label="Monstera — Scopri lo spazio eventi a Sassari"
      >
        <div className={styles.copy}>
          <Image
            className={styles.logo}
            src="/images/monstera/logo.jpg"
            width={168}
            height={135}
            alt="Monstera — Spazio per Eventi e Workshop"
            unoptimized
          />
          <p className={styles.lead}>
            Ampio e luminoso locale di 200 mq in affitto per eventi e workshop
            di qualsiasi genere.
          </p>
          <span className={styles.cta}>Scopri Monstera →</span>
        </div>

        <div className={styles.media} aria-hidden="true">
          <div className={styles.slides}>
            <div className={styles.slide} />
            <div className={styles.slide} />
            <div className={styles.slide} />
          </div>
          <div className={styles.overlay} />
          <div className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>
      </a>
    </aside>
  );
}
