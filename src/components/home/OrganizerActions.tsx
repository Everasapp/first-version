"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { buildAuthHref } from "@/src/lib/auth-urls";
import { isOrganizerRole, type UserRole } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/client";

type Status = "loading" | "guest" | "account" | "organizer" | "unavailable";
const StatusContext = createContext<Status>("loading");
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-full bg-[#B95408] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#A94B06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]";

export function OrganizerStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  useEffect(() => {
    const supabase = createClient();
    let active = true;
    let sequence = 0;
    async function update(userId?: string | null) {
      const current = ++sequence;
      if (!userId) { if (active) setStatus("guest"); return; }
      const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
      if (!active || current !== sequence) return;
      if (error || !data) { setStatus("unavailable"); return; }
      setStatus(isOrganizerRole(data.role as UserRole) ? "organizer" : "account");
    }
    void supabase.auth.getUser().then(({ data, error }) => {
      if (!active || sequence) return;
      if (error) { setStatus("unavailable"); return; }
      void update(data.user?.id);
    }).catch(() => { if (active) setStatus("unavailable"); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => { if (active) void update(session?.user?.id); }, 0);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  return <StatusContext.Provider value={status}>{children}</StatusContext.Provider>;
}

export function OrganizerActions() {
  const status = useContext(StatusContext);
  if (status === "loading") return <p className="text-sm text-slate-600" aria-live="polite">Verifica dell’account in corso…</p>;
  if (status === "organizer") return <Link href="/dashboard" className={buttonClass}>Vai alla dashboard</Link>;
  if (status === "account") return <Link href="/diventa-organizzatore?next=%2Fpubblica" className={buttonClass}>Diventa organizzatore</Link>;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link href="/diventa-organizzatore?next=%2Fpubblica" className={buttonClass}>Diventa organizzatore</Link>
      <Link href={buildAuthHref("/accedi", { redirect: "/dashboard" })} className="font-semibold text-[#075EAE] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]">Accedi al tuo account</Link>
    </div>
  );
}
