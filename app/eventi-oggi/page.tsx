import DateLandingPage, {
  buildDateLandingMetadata,
} from "@/src/components/seo/DateLandingPage";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";

export async function generateMetadata() {
  const { events } = await loadFilteredPublishedEvents({ date: "oggi" });
  return buildDateLandingMetadata("oggi", events.length);
}

export default function EventiOggiPage() {
  return <DateLandingPage dateKey="oggi" />;
}
