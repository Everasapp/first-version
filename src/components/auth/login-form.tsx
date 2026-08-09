"use client";

import { useActionState } from "react";
import { loginAction, type AuthFormState } from "@/app/(auth)/actions";

const initialState: AuthFormState = {};

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? "Accesso in corso…" : "Accedi"}
    </button>
  );
}

export function LoginForm({ callbackError }: { callbackError?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const error = callbackError ?? state.error;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}

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
          autoComplete="current-password"
          required
          minLength={8}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <SubmitButton pending={pending} />
    </form>
  );
}
