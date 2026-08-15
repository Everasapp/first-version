"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, MailPlus, Send, Users } from "lucide-react";

import { parseEmailList } from "@/src/lib/admin/email-campaigns";

export default function NewCampaignForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientsText, setRecipientsText] = useState("");
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const parsedEmails = useMemo(
    () => parseEmailList(recipientsText),
    [recipientsText],
  );

  async function loadFromDirectory() {
    setIsLoadingDirectory(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const response = await fetch("/api/admin/campaigns/directory-emails");
      const data = (await response.json()) as {
        ok?: boolean;
        emails?: string[];
        count?: number;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Caricamento rubrica non riuscito");
      }

      const merged = parseEmailList(
        `${recipientsText}\n${(data.emails || []).join("\n")}`,
      );
      setRecipientsText(merged.join("\n"));
      setInfoMessage(
        `Aggiunte ${data.count ?? 0} email dalla rubrica (dopo dedupe: ${merged.length}).`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Errore caricamento rubrica",
      );
    } finally {
      setIsLoadingDirectory(false);
    }
  }

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!subject.trim()) {
      setErrorMessage("Inserisci l’oggetto.");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Inserisci il messaggio.");
      return;
    }
    if (parsedEmails.length === 0) {
      setErrorMessage("Inserisci almeno un’email valida.");
      return;
    }

    const confirmed = window.confirm(
      `Confermi l’invio a ${parsedEmails.length} destinatari?\n\nMittente: info@everas.it\nOggetto: ${subject.trim()}`,
    );
    if (!confirmed) return;

    setIsSending(true);

    try {
      const response = await fetch("/api/admin/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          emails: parsedEmails,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        campaignId?: string;
        sent?: number;
        failed?: number;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.campaignId) {
        throw new Error(data.error || "Invio campagna non riuscito");
      }

      router.push(`/admin/campagne/${data.campaignId}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Invio non riuscito",
      );
      setIsSending(false);
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#075EAE] focus:ring-2 focus:ring-blue-100";

  return (
    <form
      onSubmit={handleSend}
      className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <label className="block">
        <span className="text-sm font-bold text-slate-900">Oggetto</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Es. Proposta collaborazione eventi estate"
          className={fieldClass}
          disabled={isSending}
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-slate-900">Messaggio</span>
        <textarea
          rows={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Scrivi il testo della campagna…"
          className={fieldClass}
          disabled={isSending}
        />
        <p className="mt-2 text-xs text-slate-500">
          Verrà inviato da <strong>EVERAS &lt;info@everas.it&gt;</strong> con
          risposta a info@everas.it.
        </p>
      </label>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label className="block min-w-0 flex-1">
            <span className="text-sm font-bold text-slate-900">
              Destinatari
            </span>
            <textarea
              rows={8}
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              placeholder={"una@email.it\naltra@email.it"}
              className={fieldClass}
              disabled={isSending}
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadFromDirectory}
            disabled={isLoadingDirectory || isSending}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] disabled:opacity-60"
          >
            {isLoadingDirectory ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Users className="h-4 w-4" aria-hidden="true" />
            )}
            Carica dalla rubrica
          </button>
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <MailPlus className="h-4 w-4 text-[#075EAE]" aria-hidden="true" />
            {parsedEmails.length} email valide
          </p>
        </div>
      </div>

      {infoMessage ? (
        <p className="text-sm font-medium text-emerald-700">{infoMessage}</p>
      ) : null}
      {errorMessage ? (
        <p role="alert" className="text-sm font-semibold text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSending}
        className="inline-flex items-center gap-2 rounded-xl bg-[#E67E22] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {isSending ? "Invio in corso…" : "Invia campagna"}
      </button>
    </form>
  );
}
