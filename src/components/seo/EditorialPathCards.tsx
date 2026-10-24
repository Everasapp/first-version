import Image from "next/image";
import Link from "next/link";
import { EDITORIAL_LEARNING_PATHS, NEW_PASSION_PATHS } from "@/src/lib/editorial-learning-paths";

export default function EditorialPathCards({ featured = false }: { featured?: boolean }) {
  const paths = featured ? NEW_PASSION_PATHS : EDITORIAL_LEARNING_PATHS;
  return <div className="grid gap-6 md:grid-cols-3">
    {paths.map((path) => <article key={path.path} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Image src={path.image.src} alt={path.image.alt} width={600} height={400} unoptimized className="aspect-[3/2] w-full object-cover" />
      <div className="p-6">
        {path.image.credit ? <p className="mb-3 text-xs text-slate-600"><a href={path.image.credit.href} target="_blank" rel="noopener noreferrer" className="underline">{path.image.credit.label}</a></p> : null}
        <p className="text-xs font-bold uppercase tracking-wider text-[#075EAE]">{path.category}</p>
        <h3 className="mt-2 text-xl font-bold text-slate-900"><Link href={path.path} prefetch={false} className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">{path.title}</Link></h3>
        <p className="mt-3 leading-relaxed text-slate-600">{path.summary}</p>
        <Link href={`${path.path}#prova-e-approfondisci`} prefetch={false} className="mt-4 inline-flex min-h-11 items-center font-bold text-[#075EAE] underline underline-offset-4">Leggi la guida e prova l’esercizio →</Link>
      </div>
    </article>)}
  </div>;
}
