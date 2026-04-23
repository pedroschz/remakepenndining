import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { ShareKit } from "@/components/share-kit";

export const metadata: Metadata = {
  title: "Share the campaign",
  description: "Spread the word about the Remake Penn Dining petition.",
};

export default function SharePage() {
  return (
    <section className="container-edit py-16 md:py-24 max-w-3xl">
      <FadeIn>
        <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6">
          Share the campaign
        </p>
        <h1
          className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
          style={{ fontSize: "var(--text-display-lg)" }}
        >
          A signature is a message. A share is a multiplier.
        </h1>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed">
          The 2020 BAMCO layoff petition reversed the decision in days. That
          happened because students forwarded it to three friends, who forwarded
          it to three more. You&rsquo;re the next link.
        </p>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-10">
        <ShareKit />
      </FadeIn>

      <FadeIn delay={0.2} className="mt-16">
        <h2 className="font-serif text-xl text-ink mb-4">A short version</h2>
        <blockquote className="rounded-xl border border-rule bg-cream-50 p-6 text-ink-soft leading-relaxed whitespace-pre-wrap">
          {`Penn Dining has logged 13 years of health violations — including a dead mouse in canned food storage as recently as Jan 2026 — while charging $6,960/yr. Every top-ranked Ivy peer self-operates. Johns Hopkins already ended its Bon Appétit contract and raised worker wages.

Sign: remakepenndining.org`}
        </blockquote>
      </FadeIn>
    </section>
  );
}
