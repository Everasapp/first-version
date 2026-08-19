export type UploadedEventImage = {
  path: string;
  publicUrl: string;
};

/**
 * Carica un’immagine evento via API: compressione server-side → WebP su Storage.
 */
export async function uploadEventImage(
  file: File,
  options: { slug: string },
): Promise<UploadedEventImage> {
  const body = new FormData();
  body.append("file", file);
  body.append("slug", options.slug);

  const response = await fetch("/api/events/image/upload", {
    method: "POST",
    body,
  });

  const payload = (await response.json().catch(() => null)) as
    | { path?: string; publicUrl?: string; error?: string }
    | null;

  if (!response.ok || !payload?.path || !payload?.publicUrl) {
    throw new Error(
      payload?.error || "Caricamento immagine non riuscito.",
    );
  }

  return { path: payload.path, publicUrl: payload.publicUrl };
}
