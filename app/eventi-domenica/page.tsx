import DateLandingPage, {
  buildDateLandingMetadata,
} from "@/src/components/seo/DateLandingPage";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";

export async function generateMetadata() {
  const { events } = await loadFilteredPublishedEvents({ date: "domenica" });
  return buildDateLandingMetadata("domenica", events.length);
}

export default function EventiDomenicaPage() {
  return <DateLandingPage dateKey="domenica" />;
}
