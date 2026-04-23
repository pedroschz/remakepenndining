"use client";

import { useState, useTransition } from "react";
import { signPetition } from "@/app/actions/sign";
import { cn } from "@/lib/utils";

type Props = { signatureDateDefault: string };

export function SignForm({ signatureDateDefault }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [printedName, setPrintedName] = useState("");
  const [attestation, setAttestation] = useState(false);

  const canSubmit =
    printedName.trim().length >= 2 && attestation && !pending;

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          setError(null);
          const res = await signPetition(fd);
          if (!res.ok) setError(res.error);
        })
      }
      className="relative rounded-xl border border-rule bg-cream-50 p-8 md:p-10 space-y-5"
    >
      {error && (
        <div className="rounded-md border border-accent/40 bg-accent/5 text-accent text-sm px-4 py-3">
          {error}
        </div>
      )}

      <Field label="Printed name" hint="As it should appear if you opt in below.">
        <input
          name="displayName"
          required
          minLength={2}
          maxLength={80}
          value={printedName}
          onChange={(e) => setPrintedName(e.target.value)}
          placeholder="Ben Franklin"
          className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink"
        />
      </Field>

      <Field
        label="Penn email"
      >
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={160}
          placeholder="you@upenn.edu"
          className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink"
        />
      </Field>

      <Field label="Date of signature">
        <input
          name="signatureDate"
          type="date"
          required
          defaultValue={signatureDateDefault}
          className="w-full rounded-md border border-rule bg-cream-50 px-4 py-[10px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink"
        />
      </Field>

      <div className="rounded-lg border border-rule bg-cream-50/80 px-4 py-4 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="attestation"
            checked={attestation}
            onChange={(e) => setAttestation(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-rule accent-accent"
          />
          <span className="text-sm text-ink-soft leading-snug">
            I certify that my printed name, the date above, and my email (if I
            entered one) are truthful and accurate to the best of my
            knowledge.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="displayPublicly"
            className="mt-1 h-4 w-4 rounded border-rule accent-accent"
          />
          <span className="text-sm text-ink-soft leading-snug">
            Display my printed name on the public signatures list. Your email is
            never shown.
          </span>
        </label>
      </div>

      <div
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="sign-website-hp">Website</label>
        <input
          type="text"
          id="sign-website-hp"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "w-full rounded-none bg-ink text-cream-50 px-6 py-3 font-medium transition-all duration-200",
          canSubmit
            ? "hover:bg-accent hover:scale-[1.01] active:scale-[0.99]"
            : "opacity-50 cursor-not-allowed"
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
      <span className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
        <span className="text-sm text-ink font-medium">{label}</span>
        {hint && (
          <span className="text-xs text-ink-faint sm:text-right sm:max-w-[55%]">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
