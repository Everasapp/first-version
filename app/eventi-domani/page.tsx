import DateLandingPage, {
  buildDateLandingMetadata,
} from "@/src/components/seo/DateLandingPage";

export const metadata = buildDateLandingMetadata("domani");

export default function EventiDomaniPage() {
  return <DateLandingPage dateKey="domani" />;
}
