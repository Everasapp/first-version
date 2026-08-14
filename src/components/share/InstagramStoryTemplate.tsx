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
 * L’immagine sta in una “finestra” in alto con object-fit contain (niente crop).
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
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Finestra immagine: tutta la foto visibile, senza zoom/crop */}
      <div
        style={{
          flex: "0 0 52%",
          padding: "56px 48px 24px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
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
      </div>

      {/* Info evento */}
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "8px 64px 80px",
          boxSizing: "border-box",
          background:
            "linear-gradient(180deg, rgba(11,18,32,0) 0%, rgba(11,18,32,1) 18%)",
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
            fontSize: event.title.length > 60 ? 52 : 64,
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
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            fontSize: 32,
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
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 32,
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
            marginTop: 18,
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
