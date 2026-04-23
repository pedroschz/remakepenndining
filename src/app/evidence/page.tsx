import type { Metadata } from "next";
import { Timeline } from "@/components/timeline";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Evidence · Every documented incident",
  description:
    "Every health code violation, food safety incident, and labor event at Penn Dining from 2013 to 2026 — sourced from Philadelphia inspection reports and Daily Pennsylvanian investigations.",
};

export default function EvidencePage() {
  return (
    <>
      <section className="container-edit pt-16 md:pt-24 pb-8">
        <FadeIn className="max-w-3xl">
          <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6">
            The full record
          </p>
          <h1
            className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
            style={{ fontSize: "var(--text-display-lg)" }}
          >
            Every documented incident.
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed">
            This is not a curated selection. Every entry below is either a
            Philadelphia Department of Public Health inspection finding or a
            documented Daily Pennsylvanian report. Each has a primary source.
          </p>
        </FadeIn>
      </section>
      <Timeline />
    </>
  );
}
