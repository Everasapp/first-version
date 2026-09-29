"use client";

import { useEffect, useRef } from "react";

import styles from "./HotWeekSideAds.module.css";

export type SponsoredMediaProps = {
  imageSrc: string;
  imageAlt: string;
  mediaType?: "image" | "video";
  posterUrl?: string;
  videoWebmUrl?: string;
  videoMp4Url?: string;
  /** Sponsored strip has entered (or nearly entered) the viewport. */
  sectionInView: boolean;
  /** This slide should play video (active carousel index, or all on static row). */
  isActive: boolean;
  /** Carousel clones must never fetch video. */
  isClone?: boolean;
  /** Prefer static poster; never autoplay or fetch video. */
  reducedMotion?: boolean;
};

/**
 * Sponsored creative renderer:
 * - image creatives: plain <img> (unchanged)
 * - video creatives: poster only until section ∩ active ∩ !reducedMotion,
 *   then a single muted looping <video> (WebM → MP4). Never requests the GIF.
 */
export default function SponsoredMedia({
  imageSrc,
  imageAlt,
  mediaType = "image",
  posterUrl,
  videoWebmUrl,
  videoMp4Url,
  sectionInView,
  isActive,
  isClone = false,
  reducedMotion = false,
}: SponsoredMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideoCreative =
    mediaType === "video" &&
    Boolean(posterUrl && videoWebmUrl && videoMp4Url);

  const shouldMountVideo =
    isVideoCreative &&
    sectionInView &&
    isActive &&
    !isClone &&
    !reducedMotion;

  useEffect(() => {
    if (!shouldMountVideo) return;
    const node = videoRef.current;
    if (!node) return;
    const play = () => {
      void node.play().catch(() => {
        // Autoplay can fail; poster remains visible underneath.
      });
    };
    if (node.readyState >= 2) play();
  }, [shouldMountVideo, videoWebmUrl, videoMp4Url]);

  if (!isVideoCreative) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- partner creatives bypass optimizer
      <img
        src={imageSrc}
        alt={imageAlt}
        className={styles.image}
        decoding="async"
        loading={isClone ? "lazy" : "eager"}
      />
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static poster, not next/image */}
      <img
        src={posterUrl}
        alt={imageAlt}
        className={styles.image}
        decoding="async"
        loading={isClone ? "lazy" : "eager"}
      />
      {shouldMountVideo ? (
        <video
          key={`${videoWebmUrl}|${videoMp4Url}`}
          ref={videoRef}
          className={styles.video}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onLoadedData={(event) => {
            void event.currentTarget.play().catch(() => {});
          }}
          onCanPlay={(event) => {
            void event.currentTarget.play().catch(() => {});
          }}
        >
          <source src={videoWebmUrl} type="video/webm" />
          <source src={videoMp4Url} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
