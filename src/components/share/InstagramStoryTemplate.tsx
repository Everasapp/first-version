import { forwardRef } from "react";

import type { InstagramStoryEventData } from "@/src/lib/share/types";
import { STORY_HEIGHT, STORY_WIDTH } from "@/src/lib/share/types";

type InstagramStoryTemplateProps = {
  event: InstagramStoryEventData;
  /** Variante futura: minimal | colorful | elegant */
  variant?: "elegant";
};

/**
 * Template fisso 1080×1920 per Instagram Stories.
 * Il blocco testo ha altezza riservata; l’immagine usa solo lo spazio rimanente (contain).
 */
const InstagramStoryTemplate = forwardRef<
  HTMLDivElement,
  InstagramStoryTemplateProps
>(function InstagramStoryTemplate({ event, variant = "elegant" }, ref) {
  void variant;

  const titleSize =
    event.title.length > 80 ? 44 : event.title.length > 50 ? 52 : 60;

  return (
    <div
      ref={ref}
      data-story-template="elegant"
      style={{
        width: STORY_WIDTH,
        height: STORY_HEIGHT,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#0b1220",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        padding: "48px 48px 56px",
      }}
    >
      {/* Immagine: solo lo spazio rimasto dopo il testo (minHeight 0 evita overflow) */}
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          marginBottom: 36,
          borderRadius: 36,
          overflow: "hidden",
          backgroundColor: "#111827",
          border: "2px solid rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt=""
          decoding="sync"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>

      {/* Contenuto: non si restringe, resta sempre interamente nella Story */}
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            backgroundColor: "#E67E22",
            color: "#ffffff",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "12px 20px",
            borderRadius: 999,
            marginBottom: 20,
          }}
        >
          {event.category || "Evento"}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: titleSize,
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            maxWidth: "100%",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.title}
        </h1>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          <div>
            <span style={{ color: "#E67E22", marginRight: 12 }}>DATA</span>
            {event.dateLabel}
          </div>
          {event.timeLabel ? (
            <div>
              <span style={{ color: "#E67E22", marginRight: 12 }}>ORA</span>
              {event.timeLabel}
            </div>
          ) : null}
          <div>
            <span style={{ color: "#E67E22", marginRight: 12 }}>DOVE</span>
            {event.city}
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            borderTop: "2px solid rgba(255,255,255,0.2)",
            paddingTop: 28,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 14,
          }}
        >
          {event.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.logoUrl}
              alt="EVERAS"
              decoding="sync"
              style={{
                height: 88,
                width: "auto",
                maxWidth: "70%",
                display: "block",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              EVERAS
            </div>
          )}

          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.3,
            }}
          >
            Scopri altri eventi su
          </div>

          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: "#E67E22",
              lineHeight: 1.1,
            }}
          >
            {event.siteLabel || "everas.it"}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 22,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {event.eventUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    </div>
  );
});

export default InstagramStoryTemplate;
