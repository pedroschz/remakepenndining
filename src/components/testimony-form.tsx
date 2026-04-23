"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Image as ImageIcon, X } from "lucide-react";
import { submitTestimony } from "@/app/actions/testimony";
import { communityGuidelines } from "@/lib/data";
import { cn } from "@/lib/utils";

const HALLS = [
  "1920 Commons",
  "Hill House",
  "Kings Court English",
  "Lauder",
  "Quaker Kitchen",
  "Houston Market",
  "Joe's Cafe",
  "Pret",
  "Accenture Cafe",
  "Gourmet Grocer",
  "Falk Kosher",
  "Penn Pi",
  "Other",
];

export function TestimonyForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [body, setBody] = useState("");
  const [agreed, setAgreed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit = agreed && body.trim().length >= 30 && !pending;

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files)
      .filter((f) => /^image\/(jpe?g|png|webp|heic)$/.test(f.type))
      .filter((f) => f.size <= 5 * 1024 * 1024)
      .slice(0, 3 - images.length);
    setImages((prev) => [...prev, ...list].slice(0, 3));
  }

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          setError(null);
          images.forEach((f) => fd.append("images", f));
          const res = await submitTestimony(fd);
          if (res.ok) router.push("/testimonies?new=1");
          else setError(res.error);
        })
      }
      className="space-y-6"
    >
      <div className="rounded-xl border border-rule bg-cream-50 p-6 md:p-8">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle size={18} className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-ink">Community guidelines</p>
            <p className="text-sm text-ink-muted mt-1">
              Testimonies publish immediately and are reviewed by the community.
              Three reports auto-hide a post.
            </p>
          </div>
        </div>
        <ul className="space-y-2 pl-6 list-disc marker:text-ink-faint text-sm text-ink-soft">
          {communityGuidelines.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <label className="mt-5 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-rule accent-accent"
          />
          <span className="text-sm text-ink-soft">
            I have read and will abide by the community guidelines.
          </span>
        </label>
      </div>

      {error && (
        <div className="rounded-md border border-accent/40 bg-accent/5 text-accent text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-rule bg-cream-50 p-6 md:p-8 space-y-5">
        <label className="block">
          <span className="flex items-baseline justify-between mb-1.5">
            <span className="text-sm text-ink font-medium">Your story</span>
            <span className="text-xs text-ink-faint tnum">
              {body.length}/2000
            </span>
          </span>
          <textarea
            name="body"
            required
            minLength={30}
            maxLength={2000}
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe what happened. Specific dates, dining halls, and meals are especially useful."
            className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink resize-y leading-relaxed"
          />
          <span className="text-xs text-ink-faint mt-1 block">
            Minimum 30 characters. No identifying information.
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Dining hall" hint="Optional">
            <select
              name="diningHall"
              className="w-full rounded-md border border-rule bg-cream-50 px-4 py-[11px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">—</option>
              {HALLS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </Field>
          <Field label="Incident month" hint="Optional">
            <input
              type="month"
              name="incidentMonth"
              className="w-full rounded-md border border-rule bg-cream-50 px-4 py-[10px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </Field>
          <Field label="Affiliation" hint="Optional, anonymous">
            <select
              name="affiliation"
              className="w-full rounded-md border border-rule bg-cream-50 px-4 py-[11px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">—</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
              <option value="alum">Alum</option>
              <option value="parent">Parent</option>
              <option value="community">Community</option>
            </select>
          </Field>
        </div>

        <div>
          <span className="flex items-baseline justify-between mb-1.5">
            <span className="text-sm text-ink font-medium">Photos</span>
            <span className="text-xs text-ink-faint">
              Up to 3 · max 5MB each
            </span>
          </span>
          <div className="flex flex-wrap gap-3">
            {images.map((f, i) => (
              <div
                key={i}
                className="relative h-20 w-20 rounded-md overflow-hidden border border-rule bg-cream-200"
              >
                <img
                  src={URL.createObjectURL(f)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  aria-label="Remove image"
                  className="absolute top-1 right-1 h-5 w-5 inline-flex items-center justify-center rounded-full bg-ink text-cream-50 hover:bg-accent"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="h-20 w-20 inline-flex flex-col items-center justify-center rounded-md border border-dashed border-rule text-ink-muted hover:border-ink hover:text-ink transition-colors"
              >
                <ImageIcon size={18} />
                <span className="text-[10px] mt-1">Add</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "w-full rounded-full bg-ink text-cream-50 px-6 py-3 font-medium transition-all duration-200",
          canSubmit
            ? "hover:bg-accent hover:scale-[1.01] active:scale-[0.99]"
            : "opacity-50 cursor-not-allowed"
        )}
      >
        {pending ? "Posting…" : "Post testimony"}
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
