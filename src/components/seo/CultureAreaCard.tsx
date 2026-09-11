import Image from "next/image";
import Link from "next/link";

import type { CultureArea } from "@/src/lib/seo/cultura-areas";

type CultureAreaCardProps = {
  area: CultureArea;
  townCount: number;
  priority?: boolean;
};

export default function CultureAreaCard({
  area,
  townCount,
  priority = false,
}: CultureAreaCardProps) {
  const countLabel = `${townCount} ${townCount === 1 ? "paese" : "paesi"}`;
  const statusLabel = area.townPagesLive
    ? countLabel
    : `${countLabel} · schede in arrivo`;

  return (
    <article className="group min-w-0">
      <Link
        href={area.path}
        className="block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm outline-none ring-[#075EAE] transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={area.image}
            alt={area.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pb-5 pt-16">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
              {statusLabel}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
              {area.h1}
            </h2>
          </div>
        </div>
      </Link>
    </article>
  );
}
