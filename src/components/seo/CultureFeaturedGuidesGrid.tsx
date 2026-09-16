"use client";

import { useEffect, useState } from "react";

import CultureTownCard from "@/src/components/seo/CultureTownCard";
import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";
import { shuffleArray } from "@/src/lib/shuffle";

type CultureFeaturedGuidesGridProps = {
  articles: CultureTownArticle[];
};

export default function CultureFeaturedGuidesGrid({
  articles,
}: CultureFeaturedGuidesGridProps) {
  const [ordered, setOrdered] = useState(articles);

  useEffect(() => {
    setOrdered(shuffleArray(articles));
  }, [articles]);

  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((article, index) => (
        <li key={article.slug}>
          <CultureTownCard article={article} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
