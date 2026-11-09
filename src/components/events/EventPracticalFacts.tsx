import { CalendarClock, Ticket } from "lucide-react";

import { formatEventAdmission } from "@/src/lib/event-practical";
import { formatEventHoursDetail } from "@/src/lib/formatEventDate";
import type { EventScheduleMode } from "@/src/lib/eventScheduleMode";

type EventPracticalFactsProps = {
  startAt: string | null;
  endAt?: string | null;
  isFree: boolean | null;
  priceFrom: number | string | null;
  ticketUrl?: string | null;
  scheduleMode?: EventScheduleMode;
  isCourse?: boolean;
  courseCta?: string;
};

export default function EventPracticalFacts({
  startAt,
  endAt,
  isFree,
  priceFrom,
  ticketUrl,
  scheduleMode,
  isCourse = scheduleMode === "enrollment",
  courseCta,
}: EventPracticalFactsProps) {
  const hours = formatEventHoursDetail(startAt, endAt, scheduleMode);
  const admission = formatEventAdmission(isFree, priceFrom, ticketUrl);
  const ctaLabel = isCourse ? courseCta : admission.ctaLabel;

  return (
    <div className="grid gap-6 border-b border-slate-200 pb-10 sm:grid-cols-2">
      <article>
        <div className="flex items-start gap-3">
          <CalendarClock
            aria-hidden="true"
            className="mt-1 h-5 w-5 shrink-0 text-[#075EAE]"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{scheduleMode === "enrollment" ? "Avvio del corso" : "Orari"}</h2>
            <p className="mt-1 text-slate-600">
              {hours.lines[0] || hours.summary}
            </p>
            {hours.lines.slice(1).map((line) => (
              <p key={line} className="mt-1 text-sm text-slate-500">
                {line}
              </p>
            ))}
          </div>
        </div>
      </article>

      <article>
        <div className="flex items-start gap-3">
          <Ticket
            aria-hidden="true"
            className="mt-1 h-5 w-5 shrink-0 text-[#075EAE]"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isCourse ? "Partecipazione" : "Ingresso"}</h2>
            <p className="mt-1 font-semibold text-slate-800">{admission.label}</p>
            <p className="mt-1 text-sm text-slate-600">{isCourse ? "Verifica costi, requisiti e disponibilità presso l’organizzatore." : admission.detail}</p>
            {ctaLabel && ticketUrl ? (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-sm font-bold text-[#075EAE] hover:underline"
              >
                {ctaLabel}
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
