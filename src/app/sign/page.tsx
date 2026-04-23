import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SignInCard } from "@/components/sign-in-card";
import { SignForm } from "@/components/sign-form";
import { Thermometer } from "@/components/thermometer";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Sign the petition",
  description:
    "Add your signature. @upenn.edu email required. Your name appears publicly only if you opt in.",
};

type SearchParams = Promise<{ error?: string }>;

export default async function SignPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const goal = Number(process.env.NEXT_PUBLIC_SIGNATURE_GOAL ?? 5000);
  const isPennEmail = user?.email?.match(/@([a-z0-9.-]+\.)?upenn\.edu$/i);

  return (
    <section className="container-edit py-16 md:py-24">
      <div className="max-w-3xl">
        <FadeIn>
          <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6">
            Sign the petition
          </p>
          <h1
            className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
            style={{ fontSize: "var(--text-display-lg)" }}
          >
            Add your name.
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed">
            Every signature raises the cost of inaction for the administration.
            This takes about 60 seconds.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <Thermometer goal={goal} />
        </FadeIn>

        <FadeIn delay={0.2} className="mt-12">
          {user && isPennEmail ? (
            <SignForm
              email={user.email!}
              defaultName={user.user_metadata?.full_name ?? user.user_metadata?.name}
            />
          ) : (
            <SignInCard error={error ?? null} />
          )}
        </FadeIn>
      </div>
    </section>
  );
}
