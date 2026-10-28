import Link from "next/link";
import { DECISION_GUIDES, decisionGuideUrl } from "@/src/lib/career-decision-guides";

export default function DecisionGuideCards() {
  return <div className="grid gap-5 md:grid-cols-2">{DECISION_GUIDES.map(guide => <article key={guide.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
    <p className="text-xs font-bold uppercase tracking-wider text-[#075EAE]">Scegliere formazione e lavoro</p>
    <h3 className="mt-3 text-xl font-bold text-slate-900"><Link href={decisionGuideUrl(guide.slug)} prefetch={false} className="hover:underline">{guide.title}</Link></h3>
    <p className="mb-5 mt-3 leading-relaxed text-slate-600">{guide.summary}</p>
    <Link href={decisionGuideUrl(guide.slug)} prefetch={false} className="mt-auto inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Leggi la guida →</Link>
  </article>)}</div>;
}
