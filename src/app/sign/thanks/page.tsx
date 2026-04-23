import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ShareKit } from "@/components/share-kit";
import { LiveCount } from "@/components/live-count";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your signature has been added.",
};

export default function ThanksPage() {
  return (
    <section className="container-edit py-20 md:py-28 max-w-2xl">
      <FadeIn>
        <CheckCircle2 size={48} className="text-accent mb-6" />
        <h1
          className="font-serif text-ink leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "var(--text-display-md)" }}
        >
          Thank you.
        </h1>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed">
          Your signature has been recorded. Petitions only work when they grow —
          the most effective thing you can do in the next sixty seconds is send
          this to three friends.
        </p>
        <div className="mt-8">
          <LiveCount verbose />
        </div>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-12">
        <h2 className="font-serif text-xl text-ink mb-4">Share the campaign</h2>
        <ShareKit />
      </FadeIn>

      <FadeIn delay={0.25} className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/testimonies/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink text-cream-50 px-6 py-3 font-medium hover:bg-accent transition-colors"
        >
          Share your experience →
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-ink hover:border-ink transition-colors"
        >
          Back to the case
        </Link>
      </FadeIn>
    </section>
  );
}
