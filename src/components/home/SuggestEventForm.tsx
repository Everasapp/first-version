"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Link2 } from "lucide-react";

export default function SuggestEventForm() {
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const trimmedLink = link.trim();
    const trimmedNote = note.trim();
    const trimmedEmail = email.trim();

    if (!trimmedLink) {
      setErrorMessage("Incolla il link dell'evento.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/suggest-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          link: trimmedLink,
          note: trimmedNote,
          email: trimmedEmail,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          payload?.error || "Invio non riuscito. Riprova tra poco.",
        );
      }

      setLink("");
      setNote("");
      setEmail("");
      setSuccessMessage(
        "Grazie! Abbiamo ricevuto il link e lo controlleremo al più presto.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Invio non riuscito. Riprova tra poco.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="everas-light-fields space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      <label className="block">
        <span className="text-sm font-bold text-slate-900">
          Incolla il link
        </span>
        <input
          type="url"
          name="link"
          inputMode="url"
          autoComplete="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://…"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
        />
        <span className="mt-2 block text-sm text-slate-500">
          Facebook, Instagram, sito ufficiale o biglietteria: va bene qualsiasi
          pagina pubblica dell&apos;evento.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-bold text-slate-900">
          Nota{" "}
          <span className="font-medium text-slate-400">(opzionale)</span>
        </span>
        <textarea
          name="note"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Data, città o altre info utili…"
          className="mt-2 w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-slate-900">
          La tua email{" "}
          <span className="font-medium text-slate-400">(opzionale)</span>
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nome@email.it"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
        />
      </label>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
        >
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E67E22] px-6 py-4 font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
        ) : (
          <Link2 aria-hidden="true" className="h-5 w-5" />
        )}
        {isSubmitting ? "Invio in corso..." : "Invia segnalazione"}
      </button>
    </form>
  );
}
