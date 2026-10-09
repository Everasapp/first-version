"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type EventCardImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
};

/** One cached 640px thumbnail per event, shared by all screen sizes. */
export default function EventCardImage({
  src,
  alt,
  unoptimized = false,
  ...props
}: EventCardImageProps) {
  const [originalSource, setOriginalSource] = useState<string | null>(null);
  const useOriginal = unoptimized || originalSource === src;
  // These dimensions/quality are allowlisted in next.config.ts. Keeping a
  // single URL avoids producing a new transformation for every viewport/DPR.
  const thumbnailSrc = `/_next/image?url=${encodeURIComponent(src)}&w=640&q=55`;

  return (
    <Image
      {...props}
      src={useOriginal ? src : thumbnailSrc}
      alt={alt}
      // The thumbnail URL already performs optimization. Do not wrap it in
      // another optimizer request or generate a responsive set of variants.
      unoptimized
      onError={() => {
        // Retry the original once; a missing original must not create a loop.
        if (!useOriginal) setOriginalSource(src);
      }}
    />
  );
}
