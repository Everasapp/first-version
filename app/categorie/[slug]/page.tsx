import { notFound, redirect } from "next/navigation";

import { isLearningDiscipline } from "@/src/data/learning-disciplines";
import { allCategories as categories } from "@/src/data/categories";

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

  if (!category || !isLearningDiscipline(category.slug)) {
    notFound();
  }

  redirect(`/imparare-e-fare-in-sardegna?disciplina=${encodeURIComponent(category.slug)}#ricerca`);
}
