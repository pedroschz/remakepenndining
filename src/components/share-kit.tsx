"use client";

import { useState } from "react";
import { Check, Copy, Mail, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MESSAGE =
  "Penn Dining has logged 13 years of health violations while charging $6,960/yr. Every top-ranked Ivy peer self-operates. Sign the petition to remake Penn Dining:";

export function ShareKit() {
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const url =
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? "https://remakepenndining.org")
      : window.location.origin;

  const copy = async (what: "link" | "text") => {
    const toCopy = what === "link" ? url : `${MESSAGE} ${url}`;
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(what);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(MESSAGE)}&url=${encodeURIComponent(url)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent("Remake Penn Dining")}&body=${encodeURIComponent(`${MESSAGE}\n\n${url}`)}`;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => copy("link")}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200",
          copied === "link"
            ? "border-accent bg-accent/10 text-accent"
            : "border-rule text-ink hover:border-ink"
        )}
      >
        {copied === "link" ? <Check size={14} /> : <LinkIcon size={14} />}
        {copied === "link" ? "Link copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={() => copy("text")}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200",
          copied === "text"
            ? "border-accent bg-accent/10 text-accent"
            : "border-rule text-ink hover:border-ink"
        )}
      >
        {copied === "text" ? <Check size={14} /> : <Copy size={14} />}
        {copied === "text" ? "Text copied" : "Copy message"}
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm text-ink hover:border-ink transition-colors"
      >
        <XLogo /> Post to X
      </a>
      <a
        href={mailUrl}
        className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm text-ink hover:border-ink transition-colors"
      >
        <Mail size={14} /> Email
      </a>
    </div>
  );
}

function XLogo() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
