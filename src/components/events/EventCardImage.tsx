"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type EventCardImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
};

/** Keep cached thumbnails, but recover when the optimizer refuses a request. */
export default function EventCardImage({
  src,
  alt,
  unoptimized = false,
  ...props
}: EventCardImageProps) {
  const [originalSource, setOriginalSource] = useState<string | null>(null);
  const useOriginal = unoptimized || originalSource === src;

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={useOriginal}
      onError={() => {
        // Retry the original once; a missing original must not create a loop.
        if (!useOriginal) setOriginalSource(src);
      }}
    />
  );
}
