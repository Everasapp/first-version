import { NextResponse } from "next/server";
import sharp from "sharp";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import type { EditableEventImport } from "@/src/lib/admin/event-import";
import { cities } from "@/src/data/cities";
import { createSlug } from "@/src/lib/slug";
import { normalizeEventDescription } from "@/src/lib/sanitizeHtml";

export const runtime = "nodejs";
export const maxDuration = 60;

function buildStartAt(date: string, time: string) {
  const t = time && /^\d{2}:\d{2}$/.test(time) ? time : "00:00";
  // Approximate Europe/Rome offset (DST roughly Apr–Oct).
  const month = Number(date.slice(5, 7));
  const offset = month >= 4 && month <= 10 ? "+02:00" : "+01:00";
  return `${date}T${t}:00${offset}`;
}

async function downloadAndOptimizeImage(imageUrl: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; EverasImport/1.0; +https://everas.it)",
        Accept: "image/*,*/*;q=0.8",
      },
    });
    if (!response.ok) {
      throw new Error(`Download immagine fallito (${response.status})`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > 8 * 1024 * 1024) {
      throw new Error("Immagine remota troppo grande");
    }

    let quality = 82;
    let out = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    while (out.byteLength > 220_000 && quality > 55) {
      quality -= 8;
      out = await sharp(buffer)
        .rotate()
        .resize({
          width: 1400,
          height: 1400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toBuffer();
    }

    return out;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let body: {
    event?: EditableEventImport;
    publish?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON non valido" }, { status: 400 });
  }

  const event = body.event;
  const publish = body.publish !== false;

  if (!event) {
    return NextResponse.json({ error: "Dati evento mancanti" }, { status: 400 });
  }

  const title = event.title.trim();
  const municipality = event.municipality.trim();
  const startDate = event.startDate.trim();

  if (!title || !municipality || !startDate) {
    return NextResponse.json(
      { error: "Titolo, comune e data sono obbligatori" },
      { status: 400 },
    );
  }

  if (event.endDate.trim() && event.endDate.trim() < startDate) {
    return NextResponse.json(
      { error: "La data di fine è precedente all’inizio" },
      { status: 400 },
    );
  }

  const cityRecord =
    cities.find(
      (c) => c.city.toLowerCase() === municipality.toLowerCase(),
    ) || null;
  const province =
    event.province.trim() || cityRecord?.province || "";

  if (!province) {
    return NextResponse.json(
      { error: "Provincia obbligatoria (seleziona un comune noto)" },
      { status: 400 },
    );
  }

  // Duplicate guard unless forced / update
  if (!event.forceImport && !event.updateExistingId && event.sourceUrl) {
    const { data: existingBySource } = await auth.supabase
      .from("events")
      .select("id, slug, title")
      .eq("source_url", event.sourceUrl)
      .maybeSingle();

    if (existingBySource) {
      return NextResponse.json(
        {
          error: "Possibile duplicato: esiste già un evento con questo URL fonte",
          duplicate: existingBySource,
        },
        { status: 409 },
      );
    }
  }

  let organizerDirectoryId = event.organizerDirectoryId;

  if (event.createOrganizerDirectory && event.organizerName.trim()) {
    const { data: createdDir, error: dirError } = await auth.supabase
      .from("organizer_directory")
      .insert({
        name: event.organizerName.trim(),
        website: event.organizerWebsite.trim() || null,
        email: event.organizerEmail.trim() || null,
        phone: event.organizerPhone.trim() || null,
        claim_status: "unclaimed",
        created_by: auth.user.id,
        sources: {
          import: {
            value: event.sourceUrl,
            sourceUrl: event.sourceUrl,
          },
        },
      })
      .select("id")
      .single();

    if (dirError) {
      return NextResponse.json(
        { error: `Creazione organizzatore fallita: ${dirError.message}` },
        { status: 500 },
      );
    }
    organizerDirectoryId = createdDir.id;
  }

  let imageUrl: string | null = event.imageUrl.trim() || null;

  if (event.downloadImage && event.imageUrl.trim()) {
    try {
      const webp = await downloadAndOptimizeImage(event.imageUrl.trim());
      const slugBase = createSlug(title) || "evento";
      const path = `imports/${auth.user.id}/${slugBase}-${Date.now()}.webp`;
      const { error: uploadError } = await auth.supabase.storage
        .from("event-images")
        .upload(path, webp, {
          contentType: "image/webp",
          upsert: false,
        });
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      const { data: publicUrlData } = auth.supabase.storage
        .from("event-images")
        .getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? `Immagine non scaricata: ${error.message}. Deseleziona “Scarica immagine” o scegli un altro URL.`
              : "Immagine non scaricata",
        },
        { status: 422 },
      );
    }
  }

  const startAt = buildStartAt(startDate, event.startTime.trim());
  let endAt: string | null = null;
  // Salva la fine solo se l’admin l’ha inserita esplicitamente
  if (event.endDate.trim()) {
    endAt = buildStartAt(event.endDate.trim(), event.endTime.trim() || "23:59");
  } else if (event.endTime.trim() && event.startTime.trim()) {
    endAt = buildStartAt(startDate, event.endTime.trim());
  }

  const numericPrice = event.isFree
    ? null
    : Number.parseFloat(event.priceFrom.replace(",", "."));

  const baseSlug = createSlug(title) || "evento";
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

  const nowIso = new Date().toISOString();
  const payload = {
    organizer_id: auth.user.id,
    created_by: auth.user.id,
    title,
    slug: uniqueSlug,
    description: normalizeEventDescription(event.description) || null,
    category: event.category.trim() || "celebrazioni",
    subcategory: event.subcategory.trim() || null,
    province,
    municipality,
    location_name: event.locationName.trim() || null,
    address: event.address.trim() || event.locationName.trim() || null,
    start_at: startAt,
    end_at: endAt,
    image_url: imageUrl,
    is_free: event.isFree,
    price_from: Number.isFinite(numericPrice as number) ? numericPrice : null,
    price: Number.isFinite(numericPrice as number) ? numericPrice : 0,
    ticket_url: event.ticketUrl.trim() || null,
    organizer_display_name: event.organizerName.trim() || null,
    organizer_directory_id: organizerDirectoryId,
    source_url: event.sourceUrl.trim() || null,
    source_name: event.sourceName.trim() || null,
    imported_at: nowIso,
    imported_by: auth.user.id,
    import_method: "url" as const,
    verification_status: publish ? "verified" : "pending_verification",
    last_verified_at: publish ? nowIso : null,
    status: publish ? "published" : "pending",
    is_featured: false,
  };

  let eventId: string | null = null;
  let eventSlug: string | null = null;
  let logStatus: "success" | "updated" | "error" = "success";

  if (event.updateExistingId) {
    const { slug: _ignoreSlug, ...updatePayload } = payload;
    const { data: updated, error: updateError } = await auth.supabase
      .from("events")
      .update(updatePayload)
      .eq("id", event.updateExistingId)
      .select("id, slug")
      .single();

    if (updateError) {
      await auth.supabase.from("event_import_logs").insert({
        admin_id: auth.user.id,
        source_url: event.sourceUrl,
        source_name: event.sourceName,
        import_method: "url",
        status: "error",
        error_message: updateError.message,
        payload: { event },
      });
      return NextResponse.json(
        { error: `Aggiornamento fallito: ${updateError.message}` },
        { status: 500 },
      );
    }
    eventId = updated.id;
    eventSlug = updated.slug;
    logStatus = "updated";
  } else {
    const { data: inserted, error: insertError } = await auth.supabase
      .from("events")
      .insert(payload)
      .select("id, slug")
      .single();

    if (insertError) {
      await auth.supabase.from("event_import_logs").insert({
        admin_id: auth.user.id,
        source_url: event.sourceUrl,
        source_name: event.sourceName,
        import_method: "url",
        status: "error",
        error_message: insertError.message,
        payload: { event },
      });
      return NextResponse.json(
        { error: `Import fallito: ${insertError.message}` },
        { status: 500 },
      );
    }
    eventId = inserted.id;
    eventSlug = inserted.slug;
  }

  await auth.supabase.from("event_import_logs").insert({
    admin_id: auth.user.id,
    event_id: eventId,
    organizer_directory_id: organizerDirectoryId,
    source_url: event.sourceUrl,
    source_name: event.sourceName,
    import_method: "url",
    status: logStatus,
    payload: {
      title,
      municipality,
      organizerName: event.organizerName,
      publish,
    },
  });

  return NextResponse.json({
    ok: true,
    event: { id: eventId, slug: eventSlug },
    message: publish
      ? "Evento importato e pubblicato"
      : "Evento importato in attesa di verifica",
  });
}
