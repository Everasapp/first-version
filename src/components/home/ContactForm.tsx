"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setErrorMessage("Inserisci il tuo nome.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setErrorMessage("Inserisci un'email valida.");
      return;
    }

    if (trimmedMessage.length < 10) {
      setErrorMessage("Il messaggio deve avere almeno 10 caratteri.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });

    if (error) {
      setErrorMessage(`Invio non riuscito: ${error.message}`);
      setIsSubmitting(false);
      return;
    }

    setName("");
    setEmail("");
    setMessage("");
    setSuccessMessage("Messaggio inviato. Ti risponderemo al più presto.");
    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="everas-light-fields space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      <label className="block">
        <span className="text-sm font-bold text-slate-900">Nome</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Il tuo nome"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-slate-900">Email</span>
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

      <label className="block">
        <span className="text-sm font-bold text-slate-900">Messaggio</span>
        <textarea
          name="message"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Come possiamo aiutarti?"
          className="mt-2 w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-6 py-4 font-bold text-white transition hover:bg-[#E86F00] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
        ) : (
          <Send aria-hidden="true" className="h-5 w-5" />
        )}
        {isSubmitting ? "Invio in corso..." : "Invia messaggio"}
      </button>
    </form>
  );
}
