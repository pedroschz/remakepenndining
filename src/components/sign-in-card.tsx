"use client";

import { useState, useTransition } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { signInWithGoogle, signInWithMagicLink } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export function SignInCard({ error }: { error?: string | null }) {
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"choose" | "email" | "sent">("choose");
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

      {mode === "choose" && (
        <div className="mt-8 space-y-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => { void signInWithGoogle(); })}
            className={cn(
              "w-full inline-flex items-center justify-center gap-3 rounded-full border border-ink/90 bg-ink text-cream-50 px-5 py-3 font-medium transition-all duration-200 hover:bg-accent hover:border-accent",
              pending && "opacity-60"
            )}
          >
            <GoogleLogo />
            Continue with Penn Google
          </button>
          <button
            type="button"
            onClick={() => setMode("email")}
            className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-rule text-ink px-5 py-3 transition-colors duration-200 hover:border-ink hover:bg-cream-200"
          >
            <Mail size={16} />
            Email me a magic link
          </button>
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
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setMode("choose"); setMessage(null); }}
              className="rounded-full border border-rule px-5 py-3 text-ink hover:border-ink transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={pending}
              className={cn(
                "flex-1 rounded-full bg-ink text-cream-50 px-5 py-3 font-medium transition-all duration-200 hover:bg-accent",
                pending && "opacity-60"
              )}
            >
              {pending ? "Sending…" : "Send magic link"}
            </button>
          </div>
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
            onClick={() => setMode("choose")}
            className="mt-5 text-sm text-ink-muted underline decoration-rule decoration-2 underline-offset-4 hover:decoration-accent"
          >
            Use a different email
          </button>
        </div>
      )}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#fff"
        d="M16.51 8.18c0-.55-.05-1.1-.15-1.63H9v3.08h4.23a3.6 3.6 0 01-1.56 2.36v1.97h2.53c1.48-1.36 2.33-3.36 2.33-5.78z"
      />
      <path
        fill="#fff"
        opacity=".9"
        d="M9 17c2.11 0 3.88-.7 5.17-1.89l-2.52-1.96c-.7.47-1.6.75-2.65.75-2.04 0-3.77-1.38-4.39-3.23H2.01v2.03A7.99 7.99 0 009 17z"
      />
      <path
        fill="#fff"
        opacity=".7"
        d="M4.61 10.67a4.82 4.82 0 010-3.09V5.55H2.01a8 8 0 000 6.9l2.6-2.03z"
      />
      <path
        fill="#fff"
        opacity=".6"
        d="M9 3.58c1.15 0 2.18.4 2.99 1.18l2.24-2.24A7.99 7.99 0 002.01 5.55l2.6 2.03C5.23 5.74 6.96 4.36 9 3.58z"
      />
    </svg>
  );
}
