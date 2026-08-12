import Link from "next/link";
import EventCard, { type EventCardData } from "./EventCard";

type AreaSectionProps = {
  title: string;
  area: string;
  description: string;
  image: string;
  events?: EventCardData[];
};

const areaSlugs: Record<string, string> = {
  "Nord Sardegna": "nord-sardegna",
  "Centro Sardegna": "centro-sardegna",
  "Sud Sardegna": "sud-sardegna",
};

export default function AreaSection({
  title,
  area,
  description,
  image,
  events = [],
}: AreaSectionProps) {
  const areaEvents = events
    .filter((event) => event.area === area)
    .sort((a, b) => {
      if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
        return a.isFeatured ? -1 : 1;
      }
      return (
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    })
    .slice(0, 3);

  if (areaEvents.length === 0) {
    return null;
  }

  const areaHref = `/eventi?area=${areaSlugs[area] ?? ""}`;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[32px]">
          <img
            src={image}
            alt={title}
            className="h-72 w-full object-cover sm:h-80"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

          <div className="absolute inset-0 flex max-w-2xl flex-col justify-end p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
              Esplora il territorio
            </p>

            <h2 className="mt-2 text-3xl font-black text-white sm:text-5xl">
              {title}
            </h2>

            <p className="mt-3 text-base text-white/85 sm:text-lg">
              {description}
            </p>

            <Link
              href={areaHref}
              className="mt-6 inline-flex w-fit rounded-2xl bg-white px-5 py-3 font-bold text-[#075EAE] transition hover:bg-slate-100"
            >
              Scopri tutti →
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {areaEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
