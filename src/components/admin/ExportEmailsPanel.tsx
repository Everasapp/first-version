"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import { chunkEmails } from "@/src/lib/admin/export-emails";

type Props = {
  emailsWithoutPec: string[];
  emailsWithPec: string[];
};

export default function ExportEmailsPanel({
  emailsWithoutPec,
  emailsWithPec,
}: Props) {
  const [includePec, setIncludePec] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const emails = includePec ? emailsWithPec : emailsWithoutPec;
  const batches = useMemo(() => chunkEmails(emails, 30), [emails]);

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1800);
    } catch {
      setCopiedKey(null);
    }
  }

  function downloadTxt() {
    const content = emails.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `everas-email-organizzatori-${emails.length}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (emailsWithoutPec.length === 0 && emailsWithPec.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-600">
        Nessuna email da esportare. Salva prima degli organizzatori con contatti.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Esporta email (blocchi da 30)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Email uniche dai profili salvati. Copia un blocco alla volta per
            BCC/invii massivi.
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            Totale: {emails.length} email · {batches.length} blocchi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={includePec}
              onChange={(e) => setIncludePec(e.target.checked)}
            />
            Includi PEC
          </label>
          <button
            type="button"
            onClick={downloadTxt}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Scarica .txt
          </button>
          <button
            type="button"
            onClick={() => copyText("all", emails.join(", "))}
            className="inline-flex items-center gap-2 rounded-xl bg-[#075EAE] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#064a8a]"
          >
            {copiedKey === "all" ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            Copia tutte
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {batches.map((batch, index) => {
          const key = `batch-${index}`;
          const csv = batch.join(", ");
          return (
            <div
              key={key}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">
                  Blocco {index + 1} · {batch.length} email
                </p>
                <button
                  type="button"
                  onClick={() => copyText(key, csv)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                >
                  {copiedKey === key ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      Copiato
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copia blocco
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={csv}
                rows={Math.min(4, Math.ceil(batch.length / 3))}
                className="mt-3 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-700"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
