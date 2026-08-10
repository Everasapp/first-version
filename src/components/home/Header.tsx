"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { createClient } from "@/src/lib/supabase/client";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-5 sm:px-8">
        <Link href="/" className="flex items-center">
        <Image
  src="/images/everas-logo-v2.png"
  alt="EVERAS"
  width={144}
  height={28}
  priority
/>
        </Link>

        <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link href="/" className="text-blue-700">
            Home
          </Link>
          <Link href="/eventi" className="hover:text-blue-700">
            Esplora
          </Link>
          <Link href="/categorie" className="hover:text-blue-700">
            Categorie
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-8">
          <Link
            href="/pubblica"
            className="hidden h-11 items-center justify-center rounded-xl bg-[#E67E22] px-5 text-sm font-bold text-white transition hover:bg-[#C96A1A] sm:inline-flex"
          >
            Pubblica un evento
          </Link>

          {isAuthenticated === null ? (
            <div aria-hidden="true" className="h-11 w-[92px]" />
          ) : (
            <Link
              href={isAuthenticated ? "/dashboard" : "/accedi"}
              className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-[#075EAE] bg-white px-5 text-sm font-bold text-[#075EAE] shadow-sm transition hover:bg-[#075EAE] hover:text-white hover:shadow-md"
            >
              {isAuthenticated ? "Dashboard" : "Accedi"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
