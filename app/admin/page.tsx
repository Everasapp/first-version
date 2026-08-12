import Link from "next/link";
import { Building2, Download, Search } from "lucide-react";

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Amministrazione
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Strumenti riservati agli amministratori Everas.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/importa-eventi"
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#075EAE]"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#E67E22]/10 text-[#E67E22]">
            <Download className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-900">
              Importa eventi
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              Analizza un URL pubblico, verifica i campi e pubblica con
              organizzatore reale.
            </span>
          </span>
        </Link>

        <Link
          href="/admin/ricerca-contatti"
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#075EAE]"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#075EAE]/10 text-[#075EAE]">
            <Search className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-900">
              Ricerca contatti organizzatore
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              Analizza un sito pubblico e salva un profilo non rivendicato dopo
              revisione umana.
            </span>
          </span>
        </Link>

        <Link
          href="/admin/organizzatori"
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#075EAE]"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#075EAE]/10 text-[#075EAE]">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-900">
              Organizzatori salvati
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              Elenco di tutti i profili già salvati (non rivendicati o
              rivendicati).
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
