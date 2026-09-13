import DateLandingPage, {
  buildDateLandingMetadata,
} from "@/src/components/seo/DateLandingPage";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";

export async function generateMetadata() {
  const { events } = await loadFilteredPublishedEvents({ date: "domani" });
  return buildDateLandingMetadata("domani", events.length);
}

export default function EventiDomaniPage() {
  return <DateLandingPage dateKey="domani" />;
}
