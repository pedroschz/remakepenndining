"use client";

import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { reportTestimony } from "@/app/actions/testimony";
import { cn, relativeTime, formatDate } from "@/lib/utils";

export type Testimony = {
  id: string;
  created_at: string;
  body: string;
  dining_hall: string | null;
  incident_month: string | null;
  affiliation: string | null;
  image_urls: string[];
};

const REPORT_REASONS = [
  { value: "harassment", label: "Harassment or personal attack" },
  { value: "personal_info", label: "Contains identifying info" },
  { value: "off_topic", label: "Off-topic" },
  { value: "spam", label: "Spam or advertising" },
  { value: "misinformation", label: "Misinformation" },
  { value: "other", label: "Other" },
];

export function TestimonyCard({ t }: { t: Testimony }) {
  const [reportOpen, setReportOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <article className="py-8 border-b border-rule last:border-0">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted mb-3">
        {t.affiliation && (
          <span className="inline-flex px-2 py-0.5 rounded-full bg-cream-200 text-ink tracking-[0.08em] uppercase text-[10px]">
            {t.affiliation}
          </span>
        )}
        {t.dining_hall && (
          <span className="text-ink-soft">{t.dining_hall}</span>
        )}
        {t.incident_month && (
          <span>· incident {formatDate(t.incident_month)}</span>
        )}
        <span className="ml-auto tnum" title={formatDate(t.created_at)}>
          {relativeTime(t.created_at)}
        </span>
      </header>

      <p className="text-ink leading-relaxed whitespace-pre-wrap text-[1.0625rem]">
        {t.body}
      </p>

      {t.image_urls.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 max-w-lg">
          {t.image_urls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="block aspect-square overflow-hidden rounded-md border border-rule bg-cream-200"
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
              />
            </a>
          ))}
        </div>
      )}

      <footer className="mt-4 flex items-center justify-end">
        {!reportOpen && !reported && (
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-ink-faint hover:text-accent"
          >
            <Flag size={12} /> Report
          </button>
        )}
        {reported && (
          <span className="text-xs text-ink-muted">Thanks; report filed.</span>
        )}
      </footer>

      {reportOpen && !reported && (
        <form
          action={(fd) =>
            startTransition(async () => {
              fd.append("testimonyId", t.id);
              await reportTestimony(fd);
              setReported(true);
              setReportOpen(false);
            })
          }
          className="mt-3 rounded-md border border-rule bg-cream-50 p-4 space-y-3"
        >
          <fieldset>
            <legend className="text-sm text-ink font-medium mb-2">
              Why are you reporting this?
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    required
                    className="accent-accent"
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </fieldset>
          <input
            name="note"
            maxLength={500}
            placeholder="Optional note"
            className="w-full rounded-md border border-rule bg-cream-50 px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="text-sm text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className={cn(
                "text-sm rounded-full bg-ink text-cream-50 px-3 py-1.5 hover:bg-accent",
                pending && "opacity-60"
              )}
            >
              {pending ? "Filing…" : "File report"}
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
