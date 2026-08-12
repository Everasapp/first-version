"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { createClient } from "@/src/lib/supabase/client";

export default function Header() {
  // Default false so Registrati is stable on first paint (avoids mobile layout-shift
  // that can steal the first tap on Pubblica).
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 isolate border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-5 sm:px-8">
        <Link href="/" className="relative z-10 shrink-0 touch-manipulation">
          <Image
            src="/images/everas-logo-v2.png"
            alt="EVERAS"
            width={180}
            height={66}
            priority
            unoptimized
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link href="/" className="touch-manipulation text-blue-700">
            Home
          </Link>
          <Link
            href="/eventi"
            className="touch-manipulation hover:text-blue-700"
          >
            Esplora
          </Link>
          <Link
            href="/categorie"
            className="touch-manipulation hover:text-blue-700"
          >
            Categorie
          </Link>
        </nav>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 sm:gap-3 md:ml-8">
          <Link
            href="/pubblica"
            className="inline-flex h-11 touch-manipulation items-center justify-center rounded-xl bg-[#E67E22] px-3 text-sm font-bold text-white transition [@media(hover:hover)]:hover:bg-[#C96A1A] active:bg-[#C96A1A] sm:px-5"
          >
            <span className="sm:hidden">Pubblica</span>
            <span className="hidden sm:inline">Pubblica un evento</span>
          </Link>

          <Link
            href={isAuthenticated ? "/dashboard" : "/registrati"}
            className="inline-flex h-11 touch-manipulation items-center justify-center rounded-xl border-2 border-[#075EAE] bg-white px-3 text-sm font-bold text-[#075EAE] shadow-sm transition [@media(hover:hover)]:hover:bg-[#075EAE] [@media(hover:hover)]:hover:text-white [@media(hover:hover)]:hover:shadow-md active:bg-[#075EAE] active:text-white sm:px-5"
          >
            {isAuthenticated ? "Dashboard" : "Registrati"}
          </Link>
        </div>
      </div>
    </header>
  );
}
