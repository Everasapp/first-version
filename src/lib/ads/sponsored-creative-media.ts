/**
 * Local mapping from known homepage GIF creatives → lighter video + poster.
 * Does not touch the database: ads still arrive with imageSrc pointing at the GIF path.
 */

export type SponsoredVideoCreative = {
  posterUrl: string;
  videoWebmUrl: string;
  videoMp4Url: string;
};

/** Normalized public paths for the three animated home banners. */
export const SPONSORED_GIF_VIDEO_LOOKUP: Readonly<
  Record<string, SponsoredVideoCreative>
> = {
  "/images/zoe/zoe-robot.gif": {
    posterUrl: "/images/zoe/zoe-robot-poster.webp",
    videoWebmUrl: "/images/zoe/zoe-robot.webm",
    videoMp4Url: "/images/zoe/zoe-robot.mp4",
  },
  "/images/ads/everas-advertise-promo.gif": {
    posterUrl: "/images/ads/everas-advertise-promo-poster.webp",
    videoWebmUrl: "/images/ads/everas-advertise-promo.webm",
    videoMp4Url: "/images/ads/everas-advertise-promo.mp4",
  },
  "/images/monstera/monstera-stairs.gif": {
    posterUrl: "/images/monstera/monstera-stairs-poster.webp",
    videoWebmUrl: "/images/monstera/monstera-stairs.webm",
    videoMp4Url: "/images/monstera/monstera-stairs.mp4",
  },
};

/** Strip origin / query so DB absolute URLs still match the lookup. */
export function normalizeSponsoredImageSrc(imageSrc: string): string {
  const trimmed = imageSrc.trim();
  if (!trimmed) return "";

  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      return url.pathname;
    }
  } catch {
    // fall through
  }

  const pathOnly = trimmed.split("?")[0]?.split("#")[0] ?? trimmed;
  return pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
}

export function resolveSponsoredVideoCreative(
  imageSrc: string,
): SponsoredVideoCreative | null {
  const key = normalizeSponsoredImageSrc(imageSrc);
  return SPONSORED_GIF_VIDEO_LOOKUP[key] ?? null;
}

export type ResolvedSponsoredMedia = {
  imageSrc: string;
  mediaType: "image" | "video";
  posterUrl?: string;
  videoWebmUrl?: string;
  videoMp4Url?: string;
};

/**
 * Enrich a creative for display. Unknown paths stay image-only (unchanged).
 * Mapped GIF paths become video creatives that must never request the GIF.
 */
export function resolveSponsoredMedia(imageSrc: string): ResolvedSponsoredMedia {
  if (normalizeSponsoredImageSrc(imageSrc) === "/images/mc-design-banner.png") {
    return { imageSrc: "/images/mc-design-banner-v2.webp", mediaType: "image" };
  }
  const video = resolveSponsoredVideoCreative(imageSrc);
  if (!video) {
    return { imageSrc, mediaType: "image" };
  }
  return {
    imageSrc,
    mediaType: "video",
    posterUrl: video.posterUrl,
    videoWebmUrl: video.videoWebmUrl,
    videoMp4Url: video.videoMp4Url,
  };
}
