"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { signInWithMagicLink } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export function SignInCard({ error }: { error?: string | null }) {
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"email" | "sent">("email");
  const [message, setMessage] = useState<string | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);

  const errorCopy: Record<string, string> = {
    not_penn:
      "Only @upenn.edu email addresses can sign this petition. You've been signed out.",
    missing_code: "The sign-in link was invalid or already used.",
  };
  const displayError = error ? errorCopy[error] ?? error : message;

  return (
    <div className="rounded-xl border border-rule bg-cream-50 p-8 md:p-10">
      <h2 className="font-serif text-2xl md:text-3xl text-ink tracking-[-0.015em]">
        Verify you&rsquo;re at Penn
      </h2>
      <p className="mt-3 text-ink-soft text-[0.95rem] leading-relaxed">
        We only accept signatures from <strong className="text-ink">@upenn.edu</strong>{" "}
        addresses. Your email stays private. Your name appears publicly only if you
        choose to display it.
      </p>

      {displayError && (
        <div className="mt-5 rounded-md border border-accent/40 bg-accent/5 text-accent text-sm px-4 py-3">
          {displayError}
        </div>
      )}

      {mode === "email" && (
        <form
          className="mt-8 space-y-4"
          action={(fd) =>
            startTransition(async () => {
              const res = await signInWithMagicLink(fd);
              if (res.ok) {
                setEmailSentTo(res.email ?? null);
                setMode("sent");
                setMessage(null);
              } else {
                setMessage(res.error ?? "Could not send the magic link.");
              }
            })
          }
        >
          <label className="block">
            <span className="text-sm text-ink-muted mb-1.5 block">
              Penn email
            </span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@upenn.edu"
              autoComplete="email"
              pattern="^[^\s@]+@([a-z0-9.-]+\.)?upenn\.edu$"
              className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className={cn(
              "w-full rounded-full bg-ink text-cream-50 px-5 py-3 font-medium transition-all duration-200 hover:bg-accent",
              pending && "opacity-60"
            )}
          >
            {pending ? "Sending…" : "Send magic link"}
          </button>
        </form>
      )}

      {mode === "sent" && (
        <div className="mt-8 flex flex-col items-center text-center">
          <CheckCircle2 size={36} className="text-accent mb-3" />
          <p className="font-serif text-xl text-ink">Check your email</p>
          <p className="text-ink-soft mt-2 text-sm">
            We sent a sign-in link to{" "}
            <strong className="text-ink">{emailSentTo}</strong>. Open it on this
            device to continue.
          </p>
          <button
            type="button"
            onClick={() => setMode("email")}
            className="mt-5 text-sm text-ink-muted underline decoration-rule decoration-2 underline-offset-4 hover:decoration-accent"
          >
            Use a different email
          </button>
        </div>
      )}
    </div>
  );
}

