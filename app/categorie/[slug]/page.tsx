import { notFound, redirect } from "next/navigation";

import { categories } from "@/src/data/categories";

type CategorySlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/** Canonical category landings live at /eventi/[category-slug]. */
export default async function CategorySlugPage({
  params,
}: CategorySlugPageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  redirect(`/eventi/${category.slug}`);
}
