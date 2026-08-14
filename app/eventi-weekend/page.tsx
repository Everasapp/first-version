import DateLandingPage, {
  buildDateLandingMetadata,
} from "@/src/components/seo/DateLandingPage";

export const metadata = buildDateLandingMetadata("weekend");

export default function EventiWeekendPage() {
  return <DateLandingPage dateKey="weekend" />;
}
