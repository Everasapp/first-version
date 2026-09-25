"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { CulturaArticle } from "@/src/lib/seo/cultura-articles";
import { shuffleArray } from "@/src/lib/shuffle";

function formatPublishedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type CulturaArticlesFeaturedGridProps = {
  articles: CulturaArticle[];
};

export default function CulturaArticlesFeaturedGrid({
  articles,
}: CulturaArticlesFeaturedGridProps) {
  const [ordered, setOrdered] = useState(articles);

  useEffect(() => {
    setOrdered(shuffleArray(articles));
  }, [articles]);

  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((article) => (
        <li key={article.slug}>
          <Link
            href={article.path}
            className="group block overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white transition hover:border-[#075EAE]/35 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src={article.hero.src}
                alt={article.hero.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                unoptimized
              />
            </div>
            <div className="border-t border-slate-100 px-4 py-4 sm:px-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#075EAE]">
                {formatPublishedAt(article.publishedAt)}
              </p>
              <h3 className="mt-1.5 text-xl font-black tracking-tight text-slate-900">
                {article.h1}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {article.excerpt}
              </p>
              <span className="mt-3 inline-flex text-sm font-bold text-[#075EAE] transition group-hover:translate-x-0.5">
                Leggi →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
