"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flag, X } from "lucide-react";
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
  const [reportError, setReportError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxUrl) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxUrl(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxUrl]);

  return (
    <article className="py-8 border-b border-rule last:border-0">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted mb-3">
        {t.affiliation && (
          <span className="inline-flex px-2 py-0.5 rounded-md bg-cream-200 text-ink tracking-[0.08em] uppercase text-[10px]">
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
            <button
              key={url}
              type="button"
              onClick={() => setLightboxUrl(url)}
              aria-label="View image"
              className="group relative block aspect-square overflow-hidden rounded-md border border-rule bg-cream-200 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-accent/60"
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="(min-width: 640px) 170px, 33vw"
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setLightboxUrl(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 backdrop-blur-sm p-4 sm:p-8 cursor-zoom-out"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <motion.img
              key={lightboxUrl}
              src={lightboxUrl}
              alt=""
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] max-w-[92vw] rounded-md shadow-2xl object-contain cursor-default"
            />
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              aria-label="Close"
              className="fixed top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 backdrop-blur hover:bg-cream-50/20 focus:outline-none focus:ring-2 focus:ring-cream-50/60"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
              setReportError(null);
              fd.append("testimonyId", t.id);
              const res = await reportTestimony(fd);
              if (res.ok) {
                setReported(true);
                setReportOpen(false);
              } else {
                setReportError(res.error ?? "Could not file the report.");
              }
            })
          }
          className="relative mt-3 rounded-md border border-rule bg-cream-50 p-4 space-y-3"
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
          <div
            className="absolute -left-[10000px] h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor={`report-website-hp-${t.id}`}>Website</label>
            <input
              type="text"
              id={`report-website-hp-${t.id}`}
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          {reportError && (
            <p className="text-sm text-accent">{reportError}</p>
          )}
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
                "text-sm rounded-none bg-ink text-cream-50 px-3 py-1.5 hover:bg-accent",
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
