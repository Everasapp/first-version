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
import YearLandingPage, {
  buildYearLandingMetadata,
} from "@/src/components/seo/YearLandingPage";
import {
  calendarYears,
  findCalendarMonth,
  findCalendarYear,
  upcomingCalendarMonths,
  yearMonths,
} from "@/src/lib/seo/calendar";
import { FESTIVAL_HUBS, findFestivalHub } from "@/src/lib/seo/festival-hubs";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { findWeekend, upcomingWeekends } from "@/src/lib/seo/weekends";
import { getYearRange } from "@/src/lib/seo/dateRange";

type EventiSardegnaSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const years = calendarYears().map((year) => ({ slug: year.slug }));
  const yearMonthSlugs = calendarYears().flatMap((year) =>
    yearMonths(year.year).map((month) => ({ slug: month.slug })),
  );
  const months = upcomingCalendarMonths(8).map((month) => ({ slug: month.slug }));
  const festivals = FESTIVAL_HUBS.map((hub) => ({ slug: hub.slug }));
  const weekends = upcomingWeekends(10).map((weekend) => ({
    slug: weekend.slug,
  }));
  const seen = new Set<string>();
  return [...years, ...yearMonthSlugs, ...months, ...festivals, ...weekends].filter(
    (item) => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    },
  );
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

  const calendarYear = findCalendarYear(slug);
  if (calendarYear) {
    const { events } = await loadFilteredPublishedEvents({
      range: getYearRange(calendarYear.year),
    });
    return buildYearLandingMetadata(calendarYear, events.length);
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

  const calendarYear = findCalendarYear(slug);
  if (calendarYear) {
    return <YearLandingPage year={calendarYear} />;
  }

  const month = findCalendarMonth(slug);
  if (!month) {
    notFound();
  }

  return <MonthLandingPage month={month} />;
}
