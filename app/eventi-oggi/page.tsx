import DateLandingPage, {
  buildDateLandingMetadata,
} from "@/src/components/seo/DateLandingPage";

export const metadata = buildDateLandingMetadata("oggi");

export default function EventiOggiPage() {
  return <DateLandingPage dateKey="oggi" />;
}
