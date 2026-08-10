import Link from "next/link";
import { CheckCircle2, MailX } from "lucide-react";

import Header from "@/src/components/home/Header";
import { createClient } from "@/src/lib/supabase/server";

type UnsubscribePageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const params = await searchParams;
  const rawToken = Array.isArray(params.token) ? params.token[0] : params.token;
  const token = rawToken?.trim() ?? "";

  let success = false;
  let message =
    "Link non valido. Se vuoi gestire la newsletter, accedi alla dashboard.";

  if (token) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("unsubscribe_newsletter", {
      p_token: token,
    });

    if (error) {
      message = "Non è stato possibile completare la disiscrizione. Riprova.";
    } else if (data) {
      success = true;
      message =
        "Ti sei disiscritto dalla newsletter settimanale. Non riceverai più email di questo tipo.";
    } else {
      success = true;
      message =
        "Sei già disiscritto, oppure il link non corrisponde a un’iscrizione attiva.";
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-20 text-center sm:px-8">
          <div
            className={`grid h-14 w-14 place-items-center rounded-2xl ${
              success
                ? "bg-emerald-50 text-emerald-600"
                : "bg-orange-50 text-[#E67E22]"
            }`}
          >
            {success ? (
              <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
            ) : (
              <MailX aria-hidden="true" className="h-7 w-7" />
            )}
          </div>
          <h1 className="mt-6 text-3xl font-black text-slate-900">
            {success ? "Disiscrizione completata" : "Disiscrizione newsletter"}
          </h1>
          <p className="mt-3 text-slate-600">{message}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex rounded-2xl bg-[#E67E22] px-5 py-3 font-bold text-white transition hover:bg-[#C96A1A]"
            >
              Torna alla home
            </Link>
            <Link
              href="/dashboard/newsletter"
              className="inline-flex rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
            >
              Gestisci preferenze
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
