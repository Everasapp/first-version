"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import HomeNewsletterSignup from "@/src/components/home/HomeNewsletterSignup";

// Session-level suppression after dismissal, permanent suppression after signup.
// No tracking, network request or consent modification is triggered by the popup.
const DISMISSED_KEY = "everas_newsletter_popup_dismissed_v1";
const SUBSCRIBED_KEY = "everas_newsletter_popup_subscribed_v1";

export default function NewsletterSignupPopup() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.sessionStorage.getItem(DISMISSED_KEY) || window.localStorage.getItem(SUBSCRIBED_KEY)) return;
    const timer = window.setTimeout(() => {
      // Avoid competing with an open CMP or other native dialog.
      if (document.querySelector('[role="dialog"][aria-modal="true"], dialog[open]')) return;
      setOpen(true);
    }, 30000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.sessionStorage.setItem(DISMISSED_KEY, "1");
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      previous?.focus();
    };
  }, [open]);

  function dismiss() {
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
    setOpen(false);
  }

  function complete() {
    window.localStorage.setItem(SUBSCRIBED_KEY, "1");
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="newsletter-popup-title" aria-describedby="newsletter-popup-description" className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
        <button ref={closeButtonRef} type="button" onClick={dismiss} aria-label="Chiudi invito alla newsletter" className="absolute right-3 top-3 z-10 rounded-full p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#075EAE]">
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="mb-4 pr-9">
          <p className="text-xs font-bold uppercase tracking-wide text-[#075EAE]">Corsi e laboratori in Sardegna</p>
          <h2 id="newsletter-popup-title" className="mt-2 text-2xl font-extrabold text-slate-900">Non perdere i corsi che ti interessano</h2>
          <p id="newsletter-popup-description" className="mt-2 text-sm leading-6 text-slate-600">Scegli la tua zona e gli argomenti che preferisci: ricevi una sola email alla settimana con i corsi in partenza. Gratuito, senza creare un account. Puoi disiscriverti quando vuoi.</p>
        </div>
        <HomeNewsletterSignup onSuccess={complete} />
        <button type="button" onClick={dismiss} className="mt-4 w-full py-2 text-sm font-medium text-slate-500 underline underline-offset-4 hover:text-slate-800">Non ora</button>
      </section>
    </div>
  );
}
