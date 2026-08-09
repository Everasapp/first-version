"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, LoaderCircle } from "lucide-react";

import { createSlug } from "@/src/lib/slug";
import { createClient } from "@/src/lib/supabase/client";

type DuplicateEventButtonProps = {
  eventId: string;
};

export default function DuplicateEventButton({
  eventId,
}: DuplicateEventButtonProps) {
  const router = useRouter();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function duplicateEvent() {
    setIsDuplicating(true);
    setErrorMessage("");

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Devi accedere per duplicare un evento.");
      setIsDuplicating(false);
      return;
    }

    const { data: source, error: sourceError } = await supabase
      .from("events")
      .select(
        "title, description, category, subcategory, province, municipality, location_name, address, start_at, end_at, image_url, price, is_free, booking_url, is_family_friendly, is_accessible, is_outdoor, reservation_required, price_from, ticket_url",
      )
      .eq("id", eventId)
      .eq("organizer_id", user.id)
      .maybeSingle();

    if (sourceError || !source) {
      setErrorMessage(
        sourceError
          ? `Duplicazione non riuscita: ${sourceError.message}`
          : "Evento non trovato.",
      );
      setIsDuplicating(false);
      return;
    }

    const copyTitle = source.title.startsWith("Copia di ")
      ? source.title
      : `Copia di ${source.title}`;
    const uniqueSlug = `${createSlug(copyTitle) || "evento"}-${Date.now().toString(36)}`;

    const { data: created, error: insertError } = await supabase
      .from("events")
      .insert({
        organizer_id: user.id,
        title: copyTitle,
        slug: uniqueSlug,
        description: source.description,
        category: source.category,
        subcategory: source.subcategory,
        province: source.province,
        municipality: source.municipality,
        location_name: source.location_name,
        address: source.address,
        start_at: source.start_at,
        end_at: source.end_at,
        image_url: source.image_url,
        price: source.price,
        is_free: source.is_free,
        booking_url: source.booking_url,
        is_family_friendly: source.is_family_friendly,
        is_accessible: source.is_accessible,
        is_outdoor: source.is_outdoor,
        reservation_required: source.reservation_required,
        price_from: source.price_from,
        ticket_url: source.ticket_url,
        status: "draft",
        is_featured: false,
        views_count: 0,
      })
      .select("id")
      .single();

    if (insertError || !created) {
      setErrorMessage(
        insertError
          ? `Duplicazione non riuscita: ${insertError.message}`
          : "Duplicazione non riuscita.",
      );
      setIsDuplicating(false);
      return;
    }

    router.push(`/dashboard/eventi/${created.id}/modifica`);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={duplicateEvent}
        disabled={isDuplicating}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDuplicating ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Copy aria-hidden="true" className="h-4 w-4" />
        )}
        {isDuplicating ? "Duplicazione..." : "Duplica"}
      </button>

      {errorMessage && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
