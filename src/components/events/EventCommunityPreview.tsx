import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";

import {
  formatGoingCount,
  formatMeetCount,
  sharedInterestLabels,
  socialIntentLabel,
  type CommunityPreviewPerson,
  type CommunitySummary,
} from "@/src/lib/community";

type EventCommunityPreviewProps = {
  summary: CommunitySummary;
  people: CommunityPreviewPerson[];
  isAuthenticated: boolean;
  currentUserInterests: string[];
  loginHref: string;
};

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "E";
}

export default function EventCommunityPreview({
  summary,
  people,
  isAuthenticated,
  currentUserInterests,
  loginHref,
}: EventCommunityPreviewProps) {
  const showCounts = isAuthenticated && summary.goingCount > 0;
  const goingLabel = formatGoingCount(summary.goingCount);
  const meetLabel = formatMeetCount(summary.meetCount);

  return (
    <section className="border-b border-slate-200 py-10">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#075EAE]">
          <Users aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
            Chi ci sarà
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Incontrare persone con interessi in comune
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Everas è uno spazio per incontrarsi con rispetto, di persona,
            intorno agli eventi. Non è una chat di incontri.
          </p>
        </div>
      </div>

      {showCounts ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
            {goingLabel}
          </p>
          {meetLabel ? (
            <p className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-[#C96A1A]">
              {meetLabel}
            </p>
          ) : null}
        </div>
      ) : null}

      {!isAuthenticated ? (
        <p className="mt-5 text-sm text-slate-600">
          <Link href={loginHref} className="font-bold text-[#075EAE] hover:underline">
            Accedi
          </Link>{" "}
          per dire se ci vai e, se c’è qualcuno, vedere quante persone
          partecipano.
        </p>
      ) : people.length === 0 ? (
        <p className="mt-5 text-sm text-slate-600">
          {summary.goingCount === 0
            ? "Sii tra i primi a dire che ci vai."
            : "Chi partecipa ha scelto di non comparire in elenco. I numeri restano visibili."}
        </p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {people.map((person) => {
            const shared = sharedInterestLabels(
              currentUserInterests,
              person.interests,
            );
            const intent = socialIntentLabel(person.socialIntent);
            return (
              <li
                key={person.userId}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                {person.avatarUrl ? (
                  <Image
                    src={person.avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#075EAE] text-sm font-bold text-white">
                    {initials(person.displayName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900">
                    {person.displayName}
                  </p>
                  {person.openToMeeting ? (
                    <p className="mt-0.5 text-xs font-semibold text-[#E67E22]">
                      Aperto/a a conoscere persone nuove
                    </p>
                  ) : intent ? (
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      {intent}
                    </p>
                  ) : null}
                  {shared.length > 0 ? (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      In comune: {shared.join(", ")}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isAuthenticated ? (
        <p className="mt-5 text-sm text-slate-600">
          <Link
            href="/dashboard/comunita"
            className="font-bold text-[#075EAE] hover:underline"
          >
            Personalizza come compari
          </Link>
        </p>
      ) : null}
    </section>
  );
}
