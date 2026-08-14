const EVENT_IMAGES_MARKER = "/storage/v1/object/public/event-images/";

/** Path Storage da URL pubblico del bucket `event-images`, altrimenti null. */
export function getEventImageStoragePath(imageUrl: string | null | undefined) {
  if (!imageUrl) return null;

  const markerIndex = imageUrl.indexOf(EVENT_IMAGES_MARKER);
  if (markerIndex === -1) return null;

  const encodedPath = imageUrl
    .slice(markerIndex + EVENT_IMAGES_MARKER.length)
    .split("?")[0];

  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}

export function isAlreadyWebpUrl(imageUrl: string) {
  return /\.webp(?:\?|#|$)/i.test(imageUrl);
}
