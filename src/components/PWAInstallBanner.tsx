"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_DISMISS = "everas-pwa-dismiss-until";
const STORAGE_VISITS = "everas-pwa-visit-count";
const DISMISS_DAYS = 30;
const SHOW_AFTER_MS = 20_000;
const SHOW_AFTER_VISITS = 2;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in window.navigator &&
    Boolean(
      (window.navigator as Navigator & { standalone?: boolean }).standalone,
    );
  return media || iosStandalone;
}

function isIosSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const isIphone = /iPhone|iPod/.test(ua);
  const isIpad =
    /iPad/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAppleTouch = isIphone || isIpad;
  const isWebkit = /WebKit/i.test(ua);
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua);
  return isAppleTouch && isWebkit && !isOtherBrowser;
}

function isAndroid() {
  if (typeof window === "undefined") return false;
  return /Android/i.test(window.navigator.userAgent);
}

function isDesktop() {
  if (typeof window === "undefined") return true;
  return !isIosSafari() && !isAndroid();
}

function wasDismissedRecently() {
  try {
    const raw = localStorage.getItem(STORAGE_DISMISS);
    if (!raw) return false;
    const until = Number(raw);
    if (!Number.isFinite(until)) return false;
    return Date.now() < until;
  } catch {
    return false;
  }
}

function dismissForMonth() {
  try {
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_DISMISS, String(until));
  } catch {
    // ignore
  }
}

function bumpVisitCount() {
  try {
    const current = Number(sessionStorage.getItem(STORAGE_VISITS) || "0");
    const next = Number.isFinite(current) ? current + 1 : 1;
    sessionStorage.setItem(STORAGE_VISITS, String(next));
    return next;
  } catch {
    return 1;
  }
}

function getVisitCount() {
  try {
    const current = Number(sessionStorage.getItem(STORAGE_VISITS) || "0");
    return Number.isFinite(current) ? current : 0;
  } catch {
    return 0;
  }
}

function EverasEMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="10" width="52" height="10" rx="5" fill="#E67E22" />
      <rect x="6" y="27" width="52" height="10" rx="5" fill="#E67E22" />
      <rect x="6" y="44" width="52" height="10" rx="5" fill="#E67E22" />
    </svg>
  );
}

function IosShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="m8 7 4-4 4 4" />
      <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

export default function PWAInstallBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"ios" | "android" | null>(null);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    bumpVisitCount();
  }, [mounted, pathname]);

  useEffect(() => {
    if (!mounted || isDesktop() || isIosSafari()) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (isStandalone()) return;
    if (wasDismissedRecently()) return;
    if (isDesktop()) return;

    const ios = isIosSafari();
    const android = isAndroid();
    if (!ios && !android) return;

    let cancelled = false;

    const tryShow = (fromTimer: boolean) => {
      if (cancelled || isStandalone() || wasDismissedRecently()) return;

      const visits = getVisitCount();
      const ready = fromTimer || visits >= SHOW_AFTER_VISITS;
      if (!ready) return;

      if (ios) {
        setMode("ios");
        setVisible(true);
        return;
      }

      if (android && deferredPrompt) {
        setMode("android");
        setVisible(true);
      }
    };

    const timer = window.setTimeout(() => tryShow(true), SHOW_AFTER_MS);
    const visitCheck = window.setTimeout(() => tryShow(false), 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(visitCheck);
    };
  }, [mounted, pathname, deferredPrompt]);

  function closeForLater() {
    dismissForMonth();
    setVisible(false);
  }

  function closeUnderstood() {
    dismissForMonth();
    setVisible(false);
  }

  async function handleAndroidInstall() {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      dismissForMonth();
      setVisible(false);
    } catch {
      // ignore
    } finally {
      setInstalling(false);
    }
  }

  if (!mounted || !visible || !mode) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/35 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      <div className="pwa-install-panel w-full max-w-[380px] rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E67E22]/10">
          <EverasEMark className="h-12 w-12" />
        </div>

        <h2
          id="pwa-install-title"
          className="mt-5 text-center text-2xl font-bold tracking-tight text-slate-900"
        >
          Installa EVERAS
        </h2>
        <p className="mt-2 text-center text-sm font-semibold text-[#075EAE]">
          Accedi agli eventi della Sardegna con un solo tocco.
        </p>
        <p className="mt-3 text-center text-sm leading-6 text-slate-600">
          {mode === "ios"
            ? "Aggiungi EVERAS alla schermata Home del tuo iPhone per aprire la piattaforma come una vera app, senza dover aprire Safari ogni volta."
            : "Installa EVERAS sul tuo telefono per aprirla come una vera app, con accesso rapido dalla schermata Home."}
        </p>

        {mode === "ios" ? (
          <ol className="mt-5 space-y-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E67E22] text-xs font-bold text-white">
                1
              </span>
              <span className="flex-1">
                Tocca il pulsante{" "}
                <strong className="font-semibold text-slate-900">
                  Condividi
                </strong>
                <span className="mt-1 flex items-center gap-1.5 text-[#075EAE]">
                  <IosShareIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">icona Share iOS</span>
                </span>
              </span>
            </li>
            <li
              className="flex justify-center text-slate-400"
              aria-hidden="true"
            >
              ↓
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E67E22] text-xs font-bold text-white">
                2
              </span>
              <span>
                Seleziona{" "}
                <strong className="font-semibold text-slate-900">
                  &quot;Aggiungi a Home&quot;
                </strong>
              </span>
            </li>
            <li
              className="flex justify-center text-slate-400"
              aria-hidden="true"
            >
              ↓
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E67E22] text-xs font-bold text-white">
                3
              </span>
              <span>
                Tocca{" "}
                <strong className="font-semibold text-slate-900">
                  &quot;Aggiungi&quot;
                </strong>
              </span>
            </li>
          </ol>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5">
          {mode === "android" ? (
            <button
              type="button"
              onClick={handleAndroidInstall}
              disabled={installing}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#E67E22] px-4 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:opacity-60"
            >
              {installing ? "Installazione…" : "Installa"}
            </button>
          ) : (
            <button
              type="button"
              onClick={closeUnderstood}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#E67E22] px-4 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
            >
              Ho capito
            </button>
          )}
          <button
            type="button"
            onClick={closeForLater}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            Più tardi
          </button>
        </div>
      </div>
    </div>
  );
}
