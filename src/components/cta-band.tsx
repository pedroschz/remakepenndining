import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "./fade-in";
import { Thermometer } from "./thermometer";

export function CtaBand() {
  const goal = Number(process.env.NEXT_PUBLIC_SIGNATURE_GOAL ?? 5000);

  return (
    <section className="bg-ink text-cream-50">
      <div className="container-edit py-20 md:py-28">
        <FadeIn className="max-w-4xl">
          <p className="text-xs tracking-[0.2em] uppercase text-accent-soft mb-6">
            Act now
          </p>
          <h2
            className="font-serif leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "var(--text-display-lg)" }}
          >
            Sign with your <span className="italic">@upenn.edu</span> email.
          </h2>
          <p className="mt-6 text-lg text-cream-300/90 leading-relaxed max-w-2xl">
            Every signature increases pressure. The 2020 worker petition gathered
            8,322 signatures and forced Penn to reverse course in days. This is
            a bigger ask — and we need a bigger number.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-12 max-w-xl">
          <Thermometer goal={goal} dark />
        </FadeIn>

        <FadeIn delay={0.25} className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/sign"
            className="group inline-flex items-center gap-2 rounded-full bg-cream-50 text-ink px-6 py-3 font-medium transition-all duration-200 hover:bg-accent hover:text-cream-50 hover:scale-[1.02]"
          >
            Sign the petition
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/testimonies/new"
            className="inline-flex items-center gap-2 rounded-full border border-cream-50/30 px-6 py-3 text-cream-50 transition-all duration-200 hover:border-cream-50 hover:bg-cream-50/5"
          >
            Share your experience
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
