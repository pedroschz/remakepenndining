import type { Metadata } from "next";
import { ComparisonTable } from "@/components/comparison-table";
import { FadeIn } from "@/components/fade-in";
import { PullQuote } from "@/components/pull-quote";

export const metadata: Metadata = {
  title: "Compare · Peers who already made the switch",
  description:
    "Peer-institution dining models, meal plan prices, and Princeton Review rankings. Johns Hopkins insourced in 2022. Penn can too.",
};

export default function ComparePage() {
  return (
    <>
      <section className="container-edit pt-16 md:pt-24 pb-2">
        <FadeIn className="max-w-3xl">
          <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6">
            Peer comparison
          </p>
          <h1
            className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
            style={{ fontSize: "var(--text-display-lg)" }}
          >
            Every top-ranked peer has already decided.
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed">
            Of the Princeton Review 2026 Top 25 for Best Campus Food, the
            self-operated programs dominate. Of the Ivy League and Ivy+ peers,
            Penn is the outlier. Of the institutions that have made the switch
            recently, none have reversed.
          </p>
        </FadeIn>
      </section>
      <ComparisonTable />
      <PullQuote
        quote="We support the University's switch from Bon Appétit to in-house dining operations. This semester, students have noted an improvement in the dining halls' food quality and diversity."
        attribution="The Johns Hopkins News-Letter editorial board"
        role="November 2022"
      />
    </>
  );
}
