"use client";

import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Check,
  Download,
  Link2,
  LoaderCircle,
  Share2,
  X,
} from "lucide-react";

import InstagramStoryTemplate from "@/src/components/share/InstagramStoryTemplate";
import {
  loadCanvasSafeImageUrl,
  loadStoryLogoDataUrl,
} from "@/src/lib/share/canvasSafeImage";
import {
  buildEventShareUrl,
  formatStoryDate,
  formatStoryTime,
} from "@/src/lib/share/formatStory";
import {
  canShareFiles,
  generateStoryJpeg,
  shareStoryFile,
} from "@/src/lib/share/generateStoryImage";
import type { InstagramStoryEventData } from "@/src/lib/share/types";
import { STORY_SITE_LABEL } from "@/src/lib/share/types";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

type ShareEventButtonProps = {
  title: string;
  slug: string;
  imageUrl?: string;
  category?: string;
  city?: string;
  startAt?: string;
  /** Etichetta data già formattata (fallback se manca startAt) */
  dateLabel?: string;
  size?: "sm" | "md";
  className?: string;
};

export default function ShareEventButton({
  title,
  slug,
  imageUrl = "/images/concert.png",
  category = "Evento",
  city = "Sardegna",
  startAt,
  dateLabel,
  size = "sm",
  className = "",
}: ShareEventButtonProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [storyBusy, setStoryBusy] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showDownloadPanel, setShowDownloadPanel] = useState(false);
  const [linkCopiedForSticker, setLinkCopiedForSticker] = useState(false);
  const [storyEvent, setStoryEvent] = useState<InstagramStoryEventData | null>(
    null,
  );

  const dimension = size === "md" ? "h-12 w-12" : "h-10 w-10";
  const eventShareUrl = buildEventShareUrl(slug);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  function buildStoryPayload(
    safeImageUrl: string,
    logoUrl?: string,
  ): InstagramStoryEventData {
    return {
      title,
      slug,
      imageUrl: safeImageUrl,
      logoUrl,
      category,
      city,
      dateLabel: startAt ? formatStoryDate(startAt) : dateLabel || "",
      timeLabel: startAt ? formatStoryTime(startAt) : "",
      eventUrl: eventShareUrl,
      siteLabel: STORY_SITE_LABEL,
    };
  }

  async function copyEventLink(options?: { keepMenuOpen?: boolean }) {
    try {
      await navigator.clipboard.writeText(eventShareUrl);
      setCopied(true);
      setLinkCopiedForSticker(true);
      window.setTimeout(() => setCopied(false), 2500);
      if (!options?.keepMenuOpen) {
        setOpen(false);
      }
      return true;
    } catch {
      window.prompt("Copia il link dell’evento:", eventShareUrl);
      return false;
    }
  }

  async function shareNative() {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: `${title} · EVERAS`,
          text: `Scopri questo evento su Everas: ${title}`,
          url: eventShareUrl,
        });
        setOpen(false);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
    await copyEventLink();
  }

  async function shareInstagramStory() {
    setStoryError("");
    setStoryBusy(true);
    setOpen(false);
    setLinkCopiedForSticker(false);

    let revokeSafeImage: (() => void) | undefined;

    try {
      const [safe, logoUrl] = await Promise.all([
        loadCanvasSafeImageUrl(imageUrl || "/images/concert.png"),
        loadStoryLogoDataUrl(),
      ]);
      revokeSafeImage = safe.revoke;

      const payload = buildStoryPayload(safe.url, logoUrl);
      flushSync(() => {
        setStoryEvent(payload);
      });

      const node = storyRef.current;
      if (!node) {
        throw new Error("Template Story non disponibile.");
      }

      const blob = await generateStoryJpeg(node);
      const file = new File(
        [blob],
        `everas-story-${slug.slice(0, 40)}.jpg`,
        { type: "image/jpeg" },
      );

      const copied = await copyEventLink({ keepMenuOpen: true });
      setLinkCopiedForSticker(copied);

      const shareable = await canShareFiles(file);
      if (shareable) {
        try {
          await shareStoryFile(file, title, payload.eventUrl);
          setShowDownloadPanel(true);
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            setShowDownloadPanel(true);
            return;
          }
        }
      }

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      const objectUrl = URL.createObjectURL(blob);
      setDownloadUrl(objectUrl);
      setShowDownloadPanel(true);
    } catch (error) {
      console.error("[share] Instagram Story generation failed:", error);
      setStoryError(
        "Non è stato possibile creare la Story. Puoi copiare il link e condividerlo.",
      );
      setShowDownloadPanel(true);
    } finally {
      setStoryBusy(false);
      setStoryEvent(null);
      revokeSafeImage?.();
    }
  }

  function handleDownload() {
    if (!downloadUrl) return;
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `everas-story-${slug.slice(0, 40)}.jpg`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function LinkCopyBlock({ compact = false }: { compact?: boolean }) {
    return (
      <div
        className={
          compact
            ? "border-b border-slate-100 px-3 pb-3 pt-2"
            : "mt-3 rounded-2xl border border-[#E67E22]/30 bg-[#E67E22]/10 px-3.5 py-3"
        }
      >
        <p
          className={`font-bold ${
            compact
              ? "text-[11px] uppercase tracking-[0.12em] text-slate-500"
              : "text-sm text-[#C96A1A]"
          }`}
        >
          Link per sticker Instagram
        </p>
        <div className={`flex gap-2 ${compact ? "mt-2" : "mt-2.5"}`}>
          <input
            type="text"
            readOnly
            value={eventShareUrl}
            onFocus={(event) => event.currentTarget.select()}
            onClick={(event) => {
              event.stopPropagation();
              event.currentTarget.select();
            }}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#075EAE]"
            aria-label="Link evento da copiare"
          />
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void copyEventLink({ keepMenuOpen: true });
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#E67E22] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#C96A1A]"
          >
            {copied || linkCopiedForSticker ? (
              <Check aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <Link2 aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {copied || linkCopiedForSticker ? "Copiato" : "Copia"}
          </button>
        </div>
        <p
          className={
            compact
              ? "mt-1.5 text-[11px] leading-4 text-slate-500"
              : "mt-2 text-xs leading-5 text-slate-600"
          }
        >
          Copia → Instagram → sticker Link → Incolla
        </p>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        aria-label={`Condividi ${title}`}
        aria-expanded={open}
        aria-controls={menuId}
        className={`grid ${dimension} place-items-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-white hover:text-[#075EAE] ${className}`}
      >
        {storyBusy ? (
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
        ) : copied ? (
          <Check aria-hidden="true" className="h-5 w-5 text-emerald-600" />
        ) : (
          <Share2 aria-hidden="true" className="h-5 w-5" />
        )}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <LinkCopyBlock compact />

          <button
            type="button"
            role="menuitem"
            onClick={() => void shareInstagramStory()}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            <InstagramIcon className="h-4 w-4 text-[#E67E22]" />
            Instagram Stories
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => void shareNative()}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            <Share2 aria-hidden="true" className="h-4 w-4 text-[#075EAE]" />
            Altre app
          </button>
        </div>
      ) : null}

      {showDownloadPanel ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
          onClick={() => {
            setShowDownloadPanel(false);
            setStoryError("");
            setLinkCopiedForSticker(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#075EAE]">
                  Instagram Stories
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {storyError
                    ? "Condivisione non riuscita"
                    : downloadUrl
                      ? "Story pronta"
                      : "Aggiungi lo sticker Link"}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Chiudi"
                onClick={() => {
                  setShowDownloadPanel(false);
                  setStoryError("");
                  setLinkCopiedForSticker(false);
                }}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {storyError ||
                "Copia il link qui sotto, poi su Instagram aggiungi lo sticker Link e incollalo."}
            </p>

            {!storyError ? <LinkCopyBlock /> : null}

            {downloadUrl ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={downloadUrl}
                  alt="Anteprima Story"
                  className="mx-auto max-h-72 w-auto"
                />
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-2">
              {downloadUrl ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-4 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Scarica Story
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void copyEventLink({ keepMenuOpen: true })}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
              >
                <Link2 aria-hidden="true" className="h-4 w-4" />
                {linkCopiedForSticker
                  ? "Link copiato ✓"
                  : "Copia di nuovo il link"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {storyEvent ? (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-100vw",
            top: 0,
            zIndex: -1,
            opacity: 1,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <InstagramStoryTemplate ref={storyRef} event={storyEvent} />
        </div>
      ) : null}
    </div>
  );
}
