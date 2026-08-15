"use client";

import { useEffect } from "react";

import { createClient } from "@/src/lib/supabase/client";

const storageKey = (eventId: string) => `everas_admin_view_${eventId}`;

/** Conta una sola visualizzazione per l'admin (poi si ferma su questo browser). */
export default function AdminEventViewOnce({ eventId }: { eventId: string }) {
  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey(eventId))) return;
      localStorage.setItem(storageKey(eventId), "1");
    } catch {
      // Se localStorage non è disponibile, non contare per evitare inflazione.
      return;
    }

    const supabase = createClient();
    void supabase.rpc("increment_event_views", { event_id: eventId });
  }, [eventId]);

  return null;
}
