import { notFound } from "next/navigation";

import FestivalLandingPage, {
  buildFestivalLandingMetadata,
} from "@/src/components/seo/FestivalLandingPage";
import MonthLandingPage, {
  buildMonthLandingMetadata,
} from "@/src/components/seo/MonthLandingPage";
import {
  findCalendarMonth,
  upcomingCalendarMonths,
} from "@/src/lib/seo/calendar";
import { FESTIVAL_HUBS, findFestivalHub } from "@/src/lib/seo/festival-hubs";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";

type EventiSardegnaSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const months = upcomingCalendarMonths(8).map((month) => ({ slug: month.slug }));
  const festivals = FESTIVAL_HUBS.map((hub) => ({ slug: hub.slug }));
  return [...months, ...festivals];
}

export async function generateMetadata({ params }: EventiSardegnaSlugPageProps) {
  const { slug } = await params;
  const festival = findFestivalHub(slug);
  if (festival) {
    return buildFestivalLandingMetadata(festival);
  }

  const month = findCalendarMonth(slug);
  if (!month) {
    return {};
  }

  const { events } = await loadFilteredPublishedEvents({
    month: { year: month.year, monthIndex: month.monthIndex },
  });
  return buildMonthLandingMetadata(month, events.length);
}

export default async function EventiSardegnaSlugPage({
  params,
}: EventiSardegnaSlugPageProps) {
  const { slug } = await params;
  const festival = findFestivalHub(slug);
  if (festival) {
    return <FestivalLandingPage hub={festival} />;
  }

  const month = findCalendarMonth(slug);
  if (!month) {
    notFound();
  }

  return <MonthLandingPage month={month} />;
}
