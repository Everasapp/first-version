import Link from "next/link";
import type { selectCareerCourses } from "@/src/lib/career-course-selection";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { formatEventDateRange } from "@/src/lib/formatEventDate";
import { LEARNING_PATH } from "@/src/lib/learning-courses";

export default function CareerCourseList({ courses, unavailable }: {
  courses: ReturnType<typeof selectCareerCourses>; unavailable: boolean;
}) {
  return <section id="corsi" aria-labelledby="corsi-title" className="scroll-mt-28">
    <h2 id="corsi-title" className="text-2xl font-bold text-slate-900">Corsi collegati in partenza</h2>
    <p className="mt-3 leading-relaxed text-slate-600">Sono corsi già pubblicati su EVERAS, in Sardegna oppure online. Possono essere alternative o coprire solo alcune tappe: non occorre seguirli tutti. L’avvio futuro non garantisce posti liberi; conferma con l’ente ammissione, iscrizioni e programma.</p>
    {unavailable ? <p role="status" className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-slate-700">I collegamenti ai corsi sono temporaneamente non disponibili. Puoi continuare a consultare il percorso e riprovare più tardi.</p>
      : courses.length === 0 ? <p className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-slate-700">Al momento non ci sono edizioni in partenza collegate a questa guida. Le tappe restano consultabili; controlla il catalogo per nuove opportunità.</p>
        : <div className="mt-6 grid gap-5 sm:grid-cols-2">{courses.map(({ course, association }) => <article key={course.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-bold text-[#075EAE]">Tappe {association.stages.join(", ")} · {resolveEventPricing(course.is_free, course.price_from).label}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900"><Link href={`/eventi/${course.slug}`} prefetch={false} className="underline decoration-slate-300 underline-offset-4 hover:decoration-[#075EAE]">{course.title}</Link></h3>
          <p className="mt-3 text-sm text-slate-600">{formatEventDateRange(course.start_at, course.end_at)}</p>
          <p className="mt-1 text-sm text-slate-600">{course.municipality}{course.location_name ? ` · ${course.location_name}` : ""}</p>
          <p className="mt-4 leading-relaxed text-slate-700"><strong>Cosa può coprire:</strong> {association.coverage}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600"><strong>Da verificare:</strong> {association.limit}</p>
          <Link href={`/eventi/${course.slug}`} prefetch={false} className="mt-4 inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Programma, requisiti e iscrizione →</Link>
        </article>)}</div>}
    <Link href={LEARNING_PATH} prefetch={false} className="mt-5 inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Esplora tutto il catalogo corsi →</Link>
  </section>;
}
