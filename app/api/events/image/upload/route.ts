import { NextResponse } from "next/server";

import { optimizeImageToWebp } from "@/src/lib/images/optimizeToWebp";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

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
    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const slugRaw = formData.get("slug");
  const upsert = formData.get("upsert") === "1" || formData.get("upsert") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File immagine mancante." },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Usa un file JPG, PNG o WebP." },
      { status: 400 },
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "La fotografia non deve superare 5 MB." },
      { status: 400 },
    );
  }

  const slug =
    typeof slugRaw === "string" && slugRaw.trim()
      ? sanitizeSlug(slugRaw)
      : `evento-${Date.now().toString(36)}`;

  if (!slug) {
    return NextResponse.json({ error: "Slug non valido." }, { status: 400 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const webp = await optimizeImageToWebp(input);
    const path = `${user.id}/${slug}.webp`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(path, webp, {
        cacheControl: "31536000",
        contentType: "image/webp",
        upsert,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Caricamento immagine non riuscito: ${uploadError.message}` },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(path);

    return NextResponse.json({
      path,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Compressione immagine non riuscita.",
      },
      { status: 500 },
    );
  }
}
