"use client";

import { useEffect } from "react";

import { createClient } from "@/src/lib/supabase/client";

const storageKey = (eventId: string) => `everas_admin_view_${eventId}`;

/** Conta una sola visualizzazione per l'admin (poi si ferma su questo browser). */
export default function AdminEventViewOnce({ eventId }: { eventId: string }) {
  useEffect(() => {
    const key = storageKey(eventId);
    let alreadyCounted = false;
    try {
      alreadyCounted = Boolean(localStorage.getItem(key));
    } catch {
      alreadyCounted = true;
    }
    if (alreadyCounted) return;

    const supabase = createClient();
    void supabase.rpc("increment_event_views", { event_id: eventId }).then(
      ({ error }) => {
        if (error) return;
        try {
          localStorage.setItem(key, "1");
        } catch {
          // ignore
        }
      },
    );
  }, [eventId]);

  return null;
}
