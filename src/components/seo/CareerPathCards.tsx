import Link from "next/link";
import { CAREER_LEARNING_PATHS, careerPathUrl } from "@/src/lib/career-learning-paths";

export default function CareerPathCards({ featured = false }: { featured?: boolean }) {
  const paths = featured ? CAREER_LEARNING_PATHS.slice(0, 3) : CAREER_LEARNING_PATHS;
  return <div className="grid gap-6 md:grid-cols-3">
    {paths.map((path) => <article key={path.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-[#075EAE]">Cambiare lavoro · Formazione</p>
      <h3 className="mt-3 text-xl font-bold text-slate-900"><Link href={careerPathUrl(path.slug)} prefetch={false} className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">{path.role}</Link></h3>
      <p className="mt-3 leading-relaxed text-slate-600">{path.summary}</p>
      <p className="mb-4 mt-4 text-sm text-slate-600">{path.steps.length} tappe · progetto pratico · corsi collegati</p>
      <Link href={careerPathUrl(path.slug)} prefetch={false} className="mt-auto inline-flex min-h-11 items-center font-bold text-[#075EAE] underline underline-offset-4">Esplora il percorso →</Link>
    </article>)}
  </div>;
}
