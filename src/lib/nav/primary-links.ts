import { upcomingCalendarMonths, currentYearLanding } from "@/src/lib/seo/calendar";
import { upcomingWeekends } from "@/src/lib/seo/weekends";

export type PrimaryNavLink = {
  href: string;
  label: string;
};

/** Link principali condivisi tra header (menu) e footer. */
export function getPrimaryNavLinks(from = new Date()): PrimaryNavLink[] {
  const currentMonth = upcomingCalendarMonths(1, from)[0];
  const calendarYear = currentYearLanding(from);
  const datedWeekends = upcomingWeekends(2, from);

  const links: PrimaryNavLink[] = [
    { href: "/eventi-sardegna", label: "Eventi e sagre" },
    { href: calendarYear.path, label: `Calendario ${calendarYear.year}` },
    { href: "/cultura-sarda", label: "Scopri la Sardegna" },
    { href: "/cultura", label: "Cultura Sarda" },
    { href: "/eventi-oggi", label: "Eventi oggi" },
    { href: "/eventi-domani", label: "Domani" },
    { href: "/eventi-weekend", label: "Weekend" },
    { href: "/eventi-domenica", label: "Domenica" },
  ];

  if (currentMonth) {
    links.push({
      href: currentMonth.path,
      label: `${currentMonth.name} ${currentMonth.year}`,
    });
  }

  for (const weekend of datedWeekends) {
    links.push({ href: weekend.path, label: weekend.shortLabel });
  }

  links.push(
    { href: "/eventi/sassari", label: "Sassari" },
    { href: "/eventi/olbia", label: "Olbia" },
    { href: "/eventi/alghero", label: "Alghero" },
    { href: "/eventi/cagliari", label: "Cagliari" },
    { href: "/eventi/nuoro", label: "Nuoro" },
    { href: "/contatti", label: "Contattaci" },
  );

  return links;
}
