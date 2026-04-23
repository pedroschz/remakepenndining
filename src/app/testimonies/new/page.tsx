import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { TestimonyForm } from "@/components/testimony-form";

export const metadata: Metadata = {
  title: "Share your experience",
  description:
    "Post an anonymous, respectful testimony about Penn Dining. Optional photos. Community-moderated.",
};

export default function NewTestimonyPage() {
  return (
    <section className="container-edit py-16 md:py-24">
      <div className="max-w-3xl">
        <FadeIn>
          <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6">
            Share your experience
          </p>
          <h1
            className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
            style={{ fontSize: "var(--text-display-lg)" }}
          >
            Tell us what happened.
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed">
            You can post anonymously. Be specific, be respectful, don&rsquo;t
            name individual workers. Photos are optional.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <TestimonyForm />
        </FadeIn>
      </div>
    </section>
  );
}
