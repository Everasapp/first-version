import { redirect } from "next/navigation";
import { LEARNING_PATH } from "@/src/lib/learning-courses";

type EventsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Preserve useful search intent from saved links to the former event catalog. */
export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["area", "city", "q"] as const) {
    const value = params[key];
    if (typeof value === "string" && value.trim()) query.set(key, value.trim());
  }
  redirect(`${LEARNING_PATH}${query.size ? `?${query}` : ""}`);
}
