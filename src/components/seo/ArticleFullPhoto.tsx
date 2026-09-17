import PhotoCredit from "@/src/components/seo/PhotoCredit";
import type { PhotoCredit as PhotoCreditData } from "@/src/lib/seo/cultura-towns";

type ArticleFullPhotoProps = {
  src: string;
  alt: string;
  credit: PhotoCreditData;
  priority?: boolean;
};

export default function ArticleFullPhoto({
  src,
  alt,
  credit,
  priority = false,
}: ArticleFullPhotoProps) {
  return (
    <figure>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
        {/* Native img keeps each photo's real ratio, no crop. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-auto w-full"
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </div>
      <figcaption>
        <PhotoCredit credit={credit} />
      </figcaption>
    </figure>
  );
}
