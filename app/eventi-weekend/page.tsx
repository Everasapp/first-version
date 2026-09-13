import DateLandingPage, {
  buildDateLandingMetadata,
} from "@/src/components/seo/DateLandingPage";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";

export async function generateMetadata() {
  const { events } = await loadFilteredPublishedEvents({ date: "weekend" });
  return buildDateLandingMetadata("weekend", events.length);
}

export default function EventiWeekendPage() {
  return <DateLandingPage dateKey="weekend" />;
}
