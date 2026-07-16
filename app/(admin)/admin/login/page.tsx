"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <main className="grid min-h-screen place-items-center bg-muted p-4">
      <form
        className="w-full max-w-sm space-y-4 rounded-xl border bg-background p-6 shadow-sm"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError("");
          const form = new FormData(event.currentTarget);
          const { error } = await authClient.signIn.email({
            email: String(form.get("email")),
            password: String(form.get("password")),
          });
          setPending(false);
          if (error) setError(error.message ?? "Invalid email or password.");
          else router.replace("/admin/banner");
        }}
      >
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <label className="grid gap-1 text-sm">
          Email{" "}
          <input
            className="rounded-md border p-2"
            name="email"
            type="email"
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          Password{" "}
          <input
            className="rounded-md border p-2"
            name="password"
            type="password"
            required
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          className="w-full rounded-md bg-primary p-2 text-primary-foreground disabled:opacity-50"
          disabled={pending}
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
