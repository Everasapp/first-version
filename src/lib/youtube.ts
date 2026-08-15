/** Normalize pasted YouTube links (adds https:// if missing). */
export function normalizeYoutubeUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^\/\//.test(trimmed)) {
    return `https:${trimmed}`;
  }

  return `https://${trimmed}`;
}

/** Extract an 11-char YouTube video id from common URL shapes. */
export function extractYoutubeVideoId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(normalizeYoutubeUrl(trimmed));
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]?.split("?")[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && /^[\w-]{11}$/.test(fromQuery)) {
        return fromQuery;
      }

      const parts = url.pathname.split("/").filter(Boolean);
      if (
        parts.length >= 2 &&
        ["embed", "shorts", "live", "v"].includes(parts[0])
      ) {
        const id = parts[1]?.split("?")[0];
        if (id && /^[\w-]{11}$/.test(id)) {
          return id;
        }
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function isValidYoutubeUrl(value: string): boolean {
  return extractYoutubeVideoId(value) !== null;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
}
