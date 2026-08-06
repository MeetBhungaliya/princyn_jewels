"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, {
    status: "idle",
    message: "",
  });

  if (state.status === "success") {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="size-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2.5">
      <div className="relative flex items-center">
        {/* Honeypot field - visually hidden */}
        <input
          type="text"
          name="bot_field"
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <input
          name="email"
          type="email"
          required
          disabled={isPending}
          placeholder="Your email address"
          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] py-2.5 pl-4 pr-12 text-sm text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-primary)] disabled:opacity-50"
        />

        <button
          type="submit"
          aria-label="Subscribe"
          disabled={isPending}
          className="absolute right-1 top-1 bottom-1 flex aspect-square items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-75"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </button>
      </div>
      {state.status === "error" && (
        <p className="px-1 text-xs text-red-500">{state.message}</p>
      )}
    </form>
  );
}
