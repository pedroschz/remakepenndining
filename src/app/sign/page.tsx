import type { Metadata } from "next";
import { SignForm } from "@/components/sign-form";
import { Thermometer } from "@/components/thermometer";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Sign the petition",
  description:
    "Add your signature with your printed name, date, and optional Penn email (@upenn.edu or @*.upenn.edu). Each email signs once; it is never shown publicly.",
};

export const revalidate = 0;

export default function SignPage() {
  const goal = Number(process.env.NEXT_PUBLIC_SIGNATURE_GOAL ?? 5000);
  const signatureDateDefault = new Date().toISOString().slice(0, 10);

  return (
    <section className="container-edit py-16 md:py-24">
      <div className="max-w-3xl">
        <FadeIn>
          <h1
            className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
            style={{ fontSize: "var(--text-display-lg)" }}
          >
            Add your name.
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed">
            Every signature raises the cost of inaction for the administration.
            No account required.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <Thermometer goal={goal} />
        </FadeIn>

        <FadeIn delay={0.2} className="mt-12">
          <SignForm signatureDateDefault={signatureDateDefault} />
        </FadeIn>
      </div>
    </section>
  );
}
