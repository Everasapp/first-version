"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { createPortal, flushSync } from "react-dom";
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

/** Copia sincrona (affidabile su iOS/Safari nel gesto utente). */
function copyTextSync(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  textarea.remove();
  return ok;
}

async function copyTextAsync(text: string) {
  if (copyTextSync(text)) return true;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallthrough
  }
  return false;
}

type ShareEventButtonProps = {
  title: string;
  slug: string;
  imageUrl?: string;
  category?: string;
  city?: string;
  startAt?: string;
  dateLabel?: string;
  size?: "sm" | "md";
  className?: string;
};

type MenuPosition = { top: number; left: number };

export default function ShareEventButton({
  title,
  slug,
  imageUrl = "/images/concert.webp",
  category = "Evento",
  city = "Sardegna",
  startAt,
  dateLabel,
  size = "sm",
  className = "",
}: ShareEventButtonProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [storyBusy, setStoryBusy] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showDownloadPanel, setShowDownloadPanel] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [storyEvent, setStoryEvent] = useState<InstagramStoryEventData | null>(
    null,
  );

  const dimension = size === "md" ? "h-12 w-12" : "h-10 w-10";
  // Sempre URL pubblico: localhost non serve per lo sticker Instagram
  const eventShareUrl = buildEventShareUrl(slug, "https://www.everas.it");

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateMenuPosition() {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 300;
    const menuHeight = 280;
    const gap = 8;
    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8,
    );
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const top =
      spaceBelow >= menuHeight
        ? rect.bottom + gap
        : Math.max(8, rect.top - menuHeight - gap);
    setMenuPos({ top, left });
  }

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onReposition() {
      updateMenuPosition();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  function markCopied() {
    setCopied(true);
    setCopyError(false);
    setStatusMessage("Link copiato. Su Instagram: sticker Link → Incolla.");
    window.setTimeout(() => setCopied(false), 2500);
  }

  function handleCopyClick(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setCopyError(false);
    const ok = copyTextSync(eventShareUrl);
    if (ok) {
      markCopied();
      return;
    }
    void (async () => {
      const asyncOk = await copyTextAsync(eventShareUrl);
      if (asyncOk) {
        markCopied();
        return;
      }
      setCopyError(true);
      setStatusMessage("Seleziona e copia il link qui sotto.");
      window.prompt("Copia il link dell’evento:", eventShareUrl);
    })();
  }

  async function shareNative(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: `${title} · EVERAS`,
          text: `Scopri questo evento su Everas: ${title}`,
          url: eventShareUrl,
        });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }

    const ok = await copyTextAsync(eventShareUrl);
    if (ok) {
      markCopied();
      setStatusMessage("Condivisione non disponibile: link copiato.");
    } else {
      window.prompt("Copia il link dell’evento:", eventShareUrl);
    }
  }

  async function shareInstagramStory(
    event: ReactMouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();
    setStoryError("");
    setStoryBusy(true);
    setOpen(false);
    setStatusMessage("");

    // Copia subito nel gesto utente (prima degli await lunghi)
    const copiedNow = copyTextSync(eventShareUrl);
    if (copiedNow) markCopied();

    let revokeSafeImage: (() => void) | undefined;

    try {
      const [safe, logoUrl] = await Promise.all([
        loadCanvasSafeImageUrl(imageUrl || "/images/concert.webp"),
        loadStoryLogoDataUrl(),
      ]);
      revokeSafeImage = safe.revoke;

      const payload: InstagramStoryEventData = {
        title,
        slug,
        imageUrl: safe.url,
        logoUrl,
        category,
        city,
        dateLabel: startAt ? formatStoryDate(startAt) : dateLabel || "",
        timeLabel: startAt ? formatStoryTime(startAt) : "",
        eventUrl: eventShareUrl,
        siteLabel: STORY_SITE_LABEL,
      };

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

      const shareable = await canShareFiles(file);
      if (shareable) {
        try {
          await shareStoryFile(file, title, payload.eventUrl);
          setShowDownloadPanel(true);
          return;
        } catch (shareError) {
          if (
            shareError instanceof DOMException &&
            shareError.name === "AbortError"
          ) {
            setShowDownloadPanel(true);
            return;
          }
        }
      }

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
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

  const menu =
    mounted && open && menuPos
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Chiudi menu condivisione"
              className="fixed inset-0 z-[99] cursor-default bg-transparent"
              onClick={() => setOpen(false)}
            />
            <div
              id={menuId}
              role="dialog"
              aria-label="Condividi evento"
              style={{
                position: "fixed",
                top: menuPos.top,
                left: menuPos.left,
                width: 300,
                zIndex: 100,
              }}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Link per sticker Instagram
              </p>

              <p
                className={`mt-2 break-all rounded-xl border px-3 py-2 text-xs font-medium ${
                  copyError
                    ? "border-red-300 bg-red-50 text-red-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {eventShareUrl}
              </p>

              <button
                type="button"
                onClick={handleCopyClick}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-3 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
              >
                {copied ? (
                  <Check aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Link2 aria-hidden="true" className="h-4 w-4" />
                )}
                {copied ? "Link copiato ✓" : "Copia link"}
              </button>

              {(statusMessage || copyError) && (
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {statusMessage ||
                    "Seleziona il testo del link e copialo manualmente."}
                </p>
              )}

              <div className="mt-3 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={(e) => void shareInstagramStory(e)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <InstagramIcon className="h-4 w-4 text-[#E67E22]" />
                  Instagram Stories
                </button>
                <button
                  type="button"
                  onClick={(e) => void shareNative(e)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <Share2
                    aria-hidden="true"
                    className="h-4 w-4 text-[#075EAE]"
                  />
                  Altre app
                </button>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  const panel =
    mounted && showDownloadPanel
      ? createPortal(
          <div
            className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
            onClick={() => {
              setShowDownloadPanel(false);
              setStoryError("");
            }}
          >
            <div
              className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
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
                  }}
                  className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {storyError ||
                  "Copia il link, poi su Instagram aggiungi lo sticker Link e incollalo."}
              </p>

              <p className="mt-3 break-all rounded-xl border border-[#E67E22]/30 bg-[#E67E22]/10 px-3 py-2 text-xs font-medium text-slate-800">
                {eventShareUrl}
              </p>

              <button
                type="button"
                onClick={handleCopyClick}
                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-3 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
              >
                {copied ? (
                  <Check aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Link2 aria-hidden="true" className="h-4 w-4" />
                )}
                {copied ? "Link copiato ✓" : "Copia link"}
              </button>

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

              {downloadUrl ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Scarica Story
                </button>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setStatusMessage("");
          setCopyError(false);
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

      {menu}
      {panel}

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
