"use client";

import { useActionState } from "react";
import { registerAction, type AuthFormState } from "@/app/(auth)/actions";

const initialState: AuthFormState = {};

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? "Registrazione in corso…" : "Registrati"}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
          {state.success}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="full_name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Nome e cognome
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password_confirm"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Conferma password
        </label>
        <input
          id="password_confirm"
          name="password_confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <input type="checkbox" name="privacy" required className="mt-0.5" />
        <span>Accetto l&apos;informativa sulla privacy</span>
      </label>

      <SubmitButton pending={pending} />
    </form>
  );
}
