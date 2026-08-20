import { NextResponse } from "next/server";

import {
  PHOTO_MAX_BYTES,
  isAllowedPhoto,
  isHeicPhoto,
} from "@/src/lib/images/allowedPhoto";
import { optimizeImageToWebp } from "@/src/lib/images/optimizeToWebp";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Foto mancante." }, { status: 400 });
  }

  if (isHeicPhoto(file)) {
    return NextResponse.json(
      {
        error:
          "Le foto HEIC dell'iPhone non sono supportate. Esporta in JPG o PNG e riprova.",
      },
      { status: 400 },
    );
  }

  if (!isAllowedPhoto(file)) {
    return NextResponse.json(
      { error: "Usa un file JPG, PNG o WebP." },
      { status: 400 },
    );
  }

  if (file.size > PHOTO_MAX_BYTES) {
    return NextResponse.json(
      { error: "La foto non deve superare 5 MB." },
      { status: 400 },
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const webp = await optimizeImageToWebp(input, { maxEdge: 640, targetMaxBytes: 80_000 });
    const path = `${user.id}/avatar.webp`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(path, webp, {
        cacheControl: "3600",
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Caricamento non riuscito: ${uploadError.message}` },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(path);

    const publicUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: `Profilo non aggiornato: ${updateError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ publicUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Compressione foto non riuscita.",
      },
      { status: 500 },
    );
  }
}
