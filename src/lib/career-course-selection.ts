import type { CareerLearningPath } from "@/src/lib/career-learning-paths";
import type { HomeEventRow } from "@/src/lib/home/load-events";

/** Input is the shared, published-only learning catalogue, never a separate query. */
export function selectCareerCourses(path: CareerLearningPath, rows: HomeEventRow[], now = Date.now()) {
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  return path.courses.flatMap((association) => {
    const course = bySlug.get(association.slug);
    if (!course) return [];
    const start = Date.parse(course.start_at ?? "");
    const end = course.end_at ? Date.parse(course.end_at) : null;
    // An ongoing class is not necessarily open for enrolment. Show upcoming editions only.
    if (!Number.isFinite(start) || start <= now ||
      (end !== null && (!Number.isFinite(end) || end < start))) return [];
    return [{ course, association }];
  }).sort((a, b) => Date.parse(a.course.start_at ?? "") - Date.parse(b.course.start_at ?? ""));
}
