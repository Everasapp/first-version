import SudOggiLandingPage, {
  buildSudOggiLandingMetadata,
} from "@/src/components/seo/SudOggiLandingPage";

export async function generateMetadata() {
  return buildSudOggiLandingMetadata();
}

export default function EventiSudSardegnaOggiPage() {
  return <SudOggiLandingPage />;
}
