"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";

import {
  markEverasAccountKnown,
  readHasEverasAccount,
} from "@/src/lib/auth-preference";
import {
  featuredNavLinks,
  getPrimaryNavLinks,
} from "@/src/lib/nav/primary-links";
import { createClient } from "@/src/lib/supabase/client";

const authButtonClassName =
  "inline-flex h-9 touch-manipulation items-center justify-center rounded-lg border border-[#075EAE] bg-white px-2.5 text-xs font-bold text-[#075EAE] shadow-sm transition [@media(hover:hover)]:hover:bg-[#075EAE] [@media(hover:hover)]:hover:text-white active:bg-[#075EAE] active:text-white sm:px-3.5";

function scrollToRicerca(event: MouseEvent<HTMLAnchorElement>) {
  if (window.location.pathname !== "/imparare-e-fare-in-sardegna") return;
  const searchForm = document.getElementById("ricerca");
  if (!searchForm) return;
  event.preventDefault();
  searchForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Header() {
  // Default: nuovo visitatore → Registrati (evita layout shift su mobile).
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const navLinks = getPrimaryNavLinks();

  useEffect(() => {
    queueMicrotask(() => setHasAccount(readHasEverasAccount()));

    const supabase = createClient();

    async function syncAuth(userId?: string | null) {
      const loggedIn = Boolean(userId);
      setIsAuthenticated(loggedIn);

      if (!loggedIn) {
        return;
      }

      markEverasAccountKnown();
      setHasAccount(true);


    }

    supabase.auth.getUser().then(({ data }) => {
      void syncAuth(data.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session?.user) {
        markEverasAccountKnown();
        setHasAccount(true);
      }
      void syncAuth(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: Event) {
      const target = event.target as Node | null;
      if (!target || !menuWrapRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 isolate border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 min-w-0 max-w-7xl items-end gap-1.5 px-3 pb-3.5 sm:gap-3 sm:px-8">
        <Link href="/" className="relative z-10 shrink-0 touch-manipulation">
          <Image
            src="/images/everas-logo-v2.webp"
            alt="EVERAS"
            width={480}
            height={176}
            unoptimized
            loading="eager"
            className="h-9 w-auto sm:h-12 md:h-14"
          />
        </Link>

        <div className="relative z-10 ml-auto flex min-w-0 shrink items-end gap-1 sm:gap-2">
          <Link
            href="/imparare-e-fare-in-sardegna#ricerca"
            className={`${authButtonClassName} shrink-0`}
            onClick={scrollToRicerca}
          >
            Ricerca
          </Link>

          {featuredNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.href === "/imparare-e-fare-in-sardegna#corsi-workshop"
                  ? "hidden h-9 shrink-0 touch-manipulation items-center justify-center whitespace-nowrap rounded-lg bg-[#B95408] px-3.5 text-xs font-bold text-white transition lg:inline-flex [@media(hover:hover)]:hover:bg-[#A94B06] active:bg-[#A94B06]"
                  : "hidden h-9 shrink-0 touch-manipulation items-center justify-center whitespace-nowrap rounded-lg bg-[#075EAE] px-3.5 text-xs font-bold text-white transition lg:inline-flex [@media(hover:hover)]:hover:bg-[#B95408] active:bg-[#A94B06]"
              }
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link href="/dashboard" className={authButtonClassName}>
              Il mio account
            </Link>
          ) : hasAccount ? (
            <Link href="/accedi" className={authButtonClassName}>
              Accedi
            </Link>
          ) : (
            <Link href="/registrati" className={authButtonClassName}>
              Registrati
            </Link>
          )}

          <div ref={menuWrapRef} className="relative">
            <button
              type="button"
              className="inline-flex h-9 w-9 touch-manipulation items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm transition [@media(hover:hover)]:hover:border-[#075EAE] [@media(hover:hover)]:hover:text-[#075EAE]"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {menuOpen ? (
              <nav
                id={menuId}
                aria-label="Menu sito"
                className="absolute right-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(70vh,28rem)] w-[min(calc(100vw-1.5rem),18rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-lg shadow-slate-900/10"
              >
                <ul className="flex flex-col">
                  {navLinks.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="block px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-[#075EAE]/8 hover:text-[#075EAE]"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
