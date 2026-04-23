"use client";

import { useState, useTransition } from "react";
import { signPetition } from "@/app/actions/sign";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

type Props = { email: string; defaultName?: string };

const affiliations = [
  { value: "undergraduate", label: "Undergraduate student" },
  { value: "graduate", label: "Graduate / professional student" },
  { value: "faculty", label: "Faculty" },
  { value: "staff", label: "Staff" },
  { value: "alum", label: "Alum" },
  { value: "parent", label: "Parent" },
  { value: "community", label: "Community member" },
];

export function SignForm({ email, defaultName }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [affil, setAffil] = useState<string>("undergraduate");

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const res = await signPetition(fd);
          if (!res.ok) setError(res.error);
        })
      }
      className="rounded-xl border border-rule bg-cream-50 p-8 md:p-10 space-y-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-rule">
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-ink-muted">
            Signed in as
          </p>
          <p className="font-medium text-ink">{email}</p>
        </div>
        <button
          type="button"
          onClick={() => startTransition(() => { void signOut(); })}
          className="text-sm text-ink-muted hover:text-accent underline decoration-rule decoration-2 underline-offset-4"
        >
          Sign out
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-accent/40 bg-accent/5 text-accent text-sm px-4 py-3">
          {error}
        </div>
      )}

      <Field label="Display name" hint="Shown publicly if you opt in below.">
        <input
          name="displayName"
          required
          minLength={2}
          maxLength={80}
          defaultValue={defaultName}
          placeholder="Jane Franklin"
          className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink"
        />
      </Field>

      <Field label="Affiliation">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {affiliations.map((a) => (
            <label
              key={a.value}
              className={cn(
                "cursor-pointer rounded-md border px-3 py-2.5 text-sm text-center transition-colors",
                affil === a.value
                  ? "border-ink bg-ink text-cream-50"
                  : "border-rule text-ink-soft hover:border-ink"
              )}
            >
              <input
                type="radio"
                name="affiliation"
                value={a.value}
                className="sr-only"
                checked={affil === a.value}
                onChange={() => setAffil(a.value)}
              />
              {a.label}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="School / department" hint="Optional.">
          <input
            name="school"
            maxLength={80}
            placeholder="College of Arts & Sciences"
            className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink"
          />
        </Field>
        <Field label="Class year / role" hint="Optional.">
          <input
            name="classYear"
            maxLength={16}
            placeholder="2028"
            className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink"
          />
        </Field>
      </div>

      <Field
        label="Why I'm signing"
        hint="Optional. Shown publicly. 280 characters."
      >
        <textarea
          name="reason"
          maxLength={280}
          rows={3}
          placeholder="One line on why this matters to you."
          className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink resize-none"
        />
      </Field>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="displayPublicly"
          defaultChecked
          className="mt-1 h-4 w-4 rounded border-rule accent-accent"
        />
        <span className="text-sm text-ink-soft leading-snug">
          Display my name and affiliation publicly in the signatures list. A
          public signatures list makes the petition more credible; your email
          is never shown.
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "w-full rounded-full bg-ink text-cream-50 px-6 py-3 font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.01] active:scale-[0.99]",
          pending && "opacity-60"
        )}
      >
        {pending ? "Signing…" : "Add my signature"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm text-ink font-medium">{label}</span>
        {hint && <span className="text-xs text-ink-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
