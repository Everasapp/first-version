import { notFound } from "next/navigation";

import FestivalLandingPage, {
  buildFestivalLandingMetadata,
} from "@/src/components/seo/FestivalLandingPage";
import MonthLandingPage, {
  buildMonthLandingMetadata,
} from "@/src/components/seo/MonthLandingPage";
import WeekendLandingPage, {
  buildWeekendLandingMetadata,
} from "@/src/components/seo/WeekendLandingPage";
import {
  findCalendarMonth,
  upcomingCalendarMonths,
} from "@/src/lib/seo/calendar";
import { FESTIVAL_HUBS, findFestivalHub } from "@/src/lib/seo/festival-hubs";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { findWeekend, upcomingWeekends } from "@/src/lib/seo/weekends";

type EventiSardegnaSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const months = upcomingCalendarMonths(8).map((month) => ({ slug: month.slug }));
  const festivals = FESTIVAL_HUBS.map((hub) => ({ slug: hub.slug }));
  const weekends = upcomingWeekends(10).map((weekend) => ({
    slug: weekend.slug,
  }));
  return [...months, ...festivals, ...weekends];
}

export async function generateMetadata({ params }: EventiSardegnaSlugPageProps) {
  const { slug } = await params;
  const festival = findFestivalHub(slug);
  if (festival) {
    return buildFestivalLandingMetadata(festival);
  }

  const weekend = findWeekend(slug);
  if (weekend) {
    const { events } = await loadFilteredPublishedEvents({
      range: { start: weekend.start, end: weekend.end },
    });
    return buildWeekendLandingMetadata(weekend, events.length);
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

  const weekend = findWeekend(slug);
  if (weekend) {
    return <WeekendLandingPage weekend={weekend} />;
  }

  const month = findCalendarMonth(slug);
  if (!month) {
    notFound();
  }

  return <MonthLandingPage month={month} />;
}
