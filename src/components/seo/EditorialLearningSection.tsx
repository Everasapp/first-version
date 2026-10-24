import Link from "next/link";
import { IDEAS_PATH, type EditorialLearningPath } from "@/src/lib/editorial-learning-paths";

export default function EditorialLearningSection({ path }: { path: EditorialLearningPath }) {
  return (
    <section id="prova-e-approfondisci" aria-labelledby="percorso-pratico-title" className="mt-12 scroll-mt-24 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-8">
      <Link href={IDEAS_PATH} prefetch={false} className="text-sm font-bold text-[#075EAE] underline underline-offset-4">Idee e percorsi</Link>
      <h2 id="percorso-pratico-title" className="mt-3 text-2xl font-bold text-slate-900">Guida pratica: scopri, prova e approfondisci</h2>
      <p className="mt-4 max-w-4xl leading-relaxed text-slate-700">{path.discover}</p>
      <h3 className="mt-7 text-xl font-bold text-slate-900">{path.exercise.title}</h3>
      <ol className="mt-4 max-w-4xl list-decimal space-y-3 pl-6 leading-relaxed text-slate-700">
        {path.exercise.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <h3 className="mt-7 text-xl font-bold text-slate-900">Come scegliere il prossimo passo</h3>
      <ul className="mt-4 max-w-4xl list-disc space-y-3 pl-6 leading-relaxed text-slate-700">
        {path.choose.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        {path.links.map((link) => <Link key={link.href} href={link.href} prefetch={false} className="inline-flex min-h-11 items-center rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">{link.label}</Link>)}
      </div>
      {path.path.endsWith("/stretching-relax-preghiera") ? (
        <div className="mt-8 rounded-xl border border-blue-200 bg-white p-5">
          <h3 className="text-xl font-bold text-slate-900">Percorsi di crescita spirituale</h3>
          <p className="mt-2 leading-relaxed text-slate-700">
            Scopri i gruppi di studio biblico, preghiera e servizio della Chiesa Cristiana Solu a Deus sa Gloria.
            Preiscrizioni aperte, avvio e orari da definire con l’ente.
          </p>
          <ul className="mt-4 space-y-3">
            {[
              { title: "Gruppo Base – Conoscere Gesù e crescere nella fede", slug: "gruppo-base-solu-a-deus-sa-gloria-sassari" },
              { title: "Gruppo Membri – La fede nella vita quotidiana", slug: "gruppo-membri-solu-a-deus-sa-gloria-sassari" },
              { title: "Gruppo di Servizio – Doni e leadership cristiana", slug: "gruppo-servizio-solu-a-deus-sa-gloria-sassari" },
            ].map(({ title, slug }) => (
              <li key={slug}>
                <Link href={`/eventi/${slug}`} prefetch={false} className="font-semibold text-[#075EAE] underline underline-offset-4">{title} →</Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Per maggiori informazioni contattare la <a href="https://www.soluadeussagloria.org/contatti" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#075EAE] underline">chiesa</a>.
          </p>
        </div>
      ) : null}
      <p className="mt-4 text-sm text-slate-600">I collegamenti cercano nel catalogo aggiornato: la disponibilità di un corso sul tema o nel comune non è garantita. Iscrizioni e conferma del posto avvengono con l’organizzatore.</p>
    </section>
  );
}
