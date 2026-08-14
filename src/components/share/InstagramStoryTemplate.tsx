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
 * Rendering off-screen: non usare per layout responsive UI.
 * Le immagini devono essere same-origin / blob URL (canvas-safe).
 */
const InstagramStoryTemplate = forwardRef<
  HTMLDivElement,
  InstagramStoryTemplateProps
>(function InstagramStoryTemplate({ event, variant = "elegant" }, ref) {
  void variant;

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
      }}
    >
      {/* Hero image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#1e293b",
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
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(7,94,174,0.25) 0%, rgba(15,23,42,0.35) 35%, rgba(15,23,42,0.92) 72%, rgba(15,23,42,0.98) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 64px 80px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            backgroundColor: "#E67E22",
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "14px 22px",
            borderRadius: 999,
            marginBottom: 28,
          }}
        >
          {event.category || "Evento"}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: event.title.length > 60 ? 56 : 68,
            lineHeight: 1.08,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            maxWidth: "100%",
          }}
        >
          {event.title}
        </h1>

        <div
          style={{
            marginTop: 36,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            fontSize: 34,
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
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 36,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "#ffffff",
            }}
          >
            EVERAS
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: 26,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.35,
            }}
          >
            Scopri altri eventi su
            <br />
            <span style={{ color: "#E67E22", fontWeight: 800 }}>everas.it</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            wordBreak: "break-all",
          }}
        >
          {event.eventUrl.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>
  );
});

export default InstagramStoryTemplate;
