"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FileUp,
  LoaderCircle,
  MailPlus,
  Paperclip,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  CAMPAIGN_MAX_ATTACHMENTS,
  CAMPAIGN_MAX_ATTACHMENT_BYTES,
  formatBytes,
  isImageContentType,
  parseEmailList,
  resolveAttachmentContentType,
  sanitizeAttachmentFilename,
  validateCampaignAttachments,
} from "@/src/lib/admin/email-campaigns";

type SelectedAttachment = {
  id: string;
  file: File;
  filename: string;
  contentType: string;
  previewUrl?: string;
};

export default function NewCampaignForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientsText, setRecipientsText] = useState("");
  const [attachments, setAttachments] = useState<SelectedAttachment[]>([]);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const parsedEmails = useMemo(
    () => parseEmailList(recipientsText),
    [recipientsText],
  );

  function revokePreviews(files: SelectedAttachment[]) {
    for (const item of files) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    setErrorMessage("");
    const incoming = Array.from(fileList);
    const next: SelectedAttachment[] = [...attachments];

    for (const file of incoming) {
      if (next.length >= CAMPAIGN_MAX_ATTACHMENTS) {
        setErrorMessage(`Massimo ${CAMPAIGN_MAX_ATTACHMENTS} allegati.`);
        break;
      }

      const filename = sanitizeAttachmentFilename(file.name || "allegato");
      const contentType = resolveAttachmentContentType(filename, file.type);
      next.push({
        id: `${filename}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        filename,
        contentType,
        previewUrl: isImageContentType(contentType)
          ? URL.createObjectURL(file)
          : undefined,
      });
    }

    const validationError = validateCampaignAttachments(
      next.map((item) => ({
        filename: item.filename,
        contentType: item.contentType,
        sizeBytes: item.file.size,
      })),
    );

    if (validationError) {
      const added = next.slice(attachments.length);
      revokePreviews(added);
      setErrorMessage(validationError);
      return;
    }

    const removed = attachments.filter(
      (old) => !next.some((item) => item.id === old.id),
    );
    revokePreviews(removed);
    setAttachments(next);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  }

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

    const attachmentNote =
      attachments.length > 0
        ? `\nAllegati: ${attachments.length}`
        : "";

    const confirmed = window.confirm(
      `Confermi l’invio a ${parsedEmails.length} destinatari?\n\nMittente: info@mail.everas.it\nRisposte: info@everas.it\nOggetto: ${subject.trim()}${attachmentNote}`,
    );
    if (!confirmed) return;

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.set("subject", subject.trim());
      formData.set("message", message.trim());
      formData.set("emails", parsedEmails.join("\n"));
      for (const item of attachments) {
        formData.append("attachments", item.file, item.filename);
      }

      const response = await fetch("/api/admin/campaigns/send", {
        method: "POST",
        body: formData,
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

      revokePreviews(attachments);
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
          Gli indirizzi web e le email nel testo diventano cliccabili. Verrà
          inviato da <strong>EVERAS &lt;info@mail.everas.it&gt;</strong> (dominio
          Resend verificato). Le risposte vanno a info@everas.it.
        </p>
      </label>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900">Allegati</p>
            <p className="mt-1 text-xs text-slate-500">
              Immagini (JPG, PNG, WebP, GIF) e file (PDF, Word, Excel, testo).
              Max {CAMPAIGN_MAX_ATTACHMENTS} file,{" "}
              {formatBytes(CAMPAIGN_MAX_ATTACHMENT_BYTES)} ciascuno. Le immagini
              compaiono anche nel corpo dell’email.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]">
            <FileUp className="h-4 w-4" aria-hidden="true" />
            Carica file
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,application/pdf"
              className="sr-only"
              disabled={isSending || attachments.length >= CAMPAIGN_MAX_ATTACHMENTS}
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {attachments.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {attachments.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"
              >
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-[#075EAE]">
                    <Paperclip className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.filename}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(item.file.size)}
                    {isImageContentType(item.contentType)
                      ? " · immagine nel messaggio"
                      : " · allegato"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(item.id)}
                  disabled={isSending}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-red-600 disabled:opacity-50"
                  aria-label={`Rimuovi ${item.filename}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-500">
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Nessun allegato selezionato
          </p>
        )}
      </div>

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
