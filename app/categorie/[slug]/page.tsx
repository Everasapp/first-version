import { notFound, redirect } from "next/navigation";

import { categories } from "@/src/data/categories";

type CategorySlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategorySlugPage({
  params,
}: CategorySlugPageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  redirect(`/eventi?category=${encodeURIComponent(category.slug)}`);
}
