import "server-only";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 5 * 1024 * 1024;

export function validateBannerFile(file: File) {
  if (!ALLOWED_MIME.has(file.type)) {
    return {
      ok: false as const,
      error: "Formato non consentito. Usa JPG, PNG o WEBP.",
    };
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return {
      ok: false as const,
      error: "Il banner non deve superare 5 MB.",
    };
  }
  return { ok: true as const };
}

function sniffMime(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export async function uploadAdvertisingBanner({
  supabase,
  file,
  orderId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  file: File;
  orderId: string;
}): Promise<{ path: string; publicUrl: string }> {
  const validation = validateBannerFile(file);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffMime(buffer);
  if (!sniffed || sniffed !== file.type) {
    throw new Error("Il file non corrisponde a un'immagine JPG, PNG o WEBP valida.");
  }

  const ext = EXT_BY_MIME[sniffed];
  const unique = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 10)}`;
  const path = `${orderId}/${unique}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("advertising-banners")
    .upload(path, buffer, {
      cacheControl: "31536000",
      contentType: sniffed,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Caricamento banner non riuscito: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("advertising-banners")
    .getPublicUrl(path);

  return { path, publicUrl: publicUrlData.publicUrl as string };
}
