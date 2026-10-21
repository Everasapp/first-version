import { BookOpen, BriefcaseBusiness } from "lucide-react";
import { learningDisciplines } from "@/src/data/learning-disciplines";
import { legacyCategories, type Category } from "@/src/data/legacy-categories";

export type { Category } from "@/src/data/legacy-categories";

/** Only learning disciplines are offered in current forms and filters. */
export const categories: Category[] = learningDisciplines.map((discipline, index) => ({
  id: 100 + index,
  slug: discipline.slug,
  name: discipline.name,
  icon: discipline.areas.length === 1 && discipline.areas[0] === "formazione" ? BriefcaseBusiness : BookOpen,
  gradient: "from-blue-600 to-indigo-700",
}));

/** Historical labels/URLs remain readable without appearing as current choices. */
export const allCategories: Category[] = [
  ...categories,
  ...legacyCategories.filter((legacy) => !categories.some((current) => current.slug === legacy.slug)),
];
