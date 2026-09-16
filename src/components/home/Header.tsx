"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  markEverasAccountKnown,
  readHasEverasAccount,
} from "@/src/lib/auth-preference";
import { isOrganizerRole, type UserRole } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/client";

const authButtonClassName =
  "inline-flex h-9 touch-manipulation items-center justify-center rounded-lg border border-[#075EAE] bg-white px-2.5 text-xs font-bold text-[#075EAE] shadow-sm transition [@media(hover:hover)]:hover:bg-[#075EAE] [@media(hover:hover)]:hover:text-white active:bg-[#075EAE] active:text-white sm:px-3.5";

export default function Header() {
  // Default: nuovo visitatore → Registrati (evita layout shift su mobile).
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOrganizerAccount, setIsOrganizerAccount] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    setHasAccount(readHasEverasAccount());

    const supabase = createClient();

    async function syncAuth(userId?: string | null) {
      const loggedIn = Boolean(userId);
      setIsAuthenticated(loggedIn);

      if (!loggedIn) {
        setIsOrganizerAccount(false);
        return;
      }

      markEverasAccountKnown();
      setHasAccount(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId!)
        .maybeSingle();

      setIsOrganizerAccount(
        isOrganizerRole((profile?.role as UserRole | null | undefined) ?? null),
      );
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

  return (
    <header className="sticky top-0 z-50 isolate overflow-x-clip border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 min-w-0 max-w-7xl items-end gap-1.5 px-3 pb-3.5 sm:gap-3 sm:px-8">
        <Link href="/" className="relative z-10 shrink-0 touch-manipulation">
          <Image
            src="/images/everas-logo-v2.webp"
            alt="EVERAS"
            width={180}
            height={66}
            priority
            unoptimized
            className="h-9 w-auto sm:h-12 md:h-14"
          />
        </Link>

        <nav className="mb-1.5 ml-auto hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link href="/" className="touch-manipulation text-blue-700">
            Home
          </Link>
          <Link
            href="/#ricerca"
            className="touch-manipulation hover:text-blue-700"
            onClick={(event) => {
              if (window.location.pathname !== "/") return;
              event.preventDefault();
              document
                .getElementById("ricerca")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Ricerca
          </Link>
          <Link
            href="/categorie"
            className="touch-manipulation hover:text-blue-700"
          >
            Categorie
          </Link>
        </nav>

        <div className="relative z-10 ml-auto flex min-w-0 shrink items-end gap-1 sm:gap-2 md:ml-8">
          <Link
            href="/#ricerca"
            className={`${authButtonClassName} shrink-0 md:hidden`}
            onClick={(event) => {
              if (window.location.pathname !== "/") return;
              event.preventDefault();
              document
                .getElementById("ricerca")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Ricerca
          </Link>
          <Link
            href="/cultura-sarda"
            className="inline-flex h-9 touch-manipulation items-center justify-center rounded-lg bg-[#E67E22] px-2.5 text-xs font-bold text-white transition [@media(hover:hover)]:hover:bg-[#C96A1A] active:bg-[#C96A1A] sm:px-3.5"
          >
            <span className="sm:hidden">Scopri</span>
            <span className="hidden sm:inline">Scopri la Sardegna</span>
          </Link>
          <Link href="/cultura" className={`${authButtonClassName} shrink-0`}>
            <span className="sm:hidden">Cultura</span>
            <span className="hidden sm:inline">Cultura Sarda</span>
          </Link>

          {isAuthenticated && isOrganizerAccount ? (
            <Link href="/dashboard" className={authButtonClassName}>
              Dashboard
            </Link>
          ) : isAuthenticated ? (
            <Link
              href="/diventa-organizzatore"
              className={authButtonClassName}
            >
              <span className="sm:hidden">Organizzatore</span>
              <span className="hidden sm:inline">Diventa organizzatore</span>
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
        </div>
      </div>
    </header>
  );
}
