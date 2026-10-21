import { learningDisciplines } from "@/src/data/learning-disciplines";
import { LEARNING_AREAS, learningAreaForTopic } from "./learning-courses";

/** EventCard receives resolved display names, not database category slugs. */
export function learningCardLabels(event: {
  learningTopic?: string;
  category: string;
  categories?: string[];
}) {
  const area = LEARNING_AREAS.find((item) => item.key === learningAreaForTopic(event.learningTopic));
  if (!area) return event.categories?.length ? event.categories : [event.category];
  const labels = event.categories?.length ? event.categories : [event.category];
  const precise = labels.filter((label) => learningDisciplines.some((discipline) => discipline.name === label));
  return Array.from(new Set([area.title, ...precise]));
}
