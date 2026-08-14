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
          crossOrigin="anonymous"
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
          <div>📅  {event.dateLabel}</div>
          {event.timeLabel ? <div>🕒  {event.timeLabel}</div> : null}
          <div>📍  {event.city}</div>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/everas-logo-v2.png"
            alt="EVERAS"
            crossOrigin="anonymous"
            style={{
              height: 56,
              width: "auto",
              display: "block",
              filter: "brightness(0) invert(1)",
            }}
          />
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
