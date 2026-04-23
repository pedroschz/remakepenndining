import type { Metadata } from "next";
import Link from "@/components/full-page-link";
import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/fade-in";
import { Thermometer } from "@/components/thermometer";
import { formatDate, formatNumber, relativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Signatures",
  description: "Public list of people who have signed the petition.",
};

export const revalidate = 0;

const AFFIL_LABEL: Record<string, string> = {
  undergraduate: "Undergraduate",
  graduate: "Graduate",
  faculty: "Faculty",
  staff: "Staff",
  alum: "Alum",
  parent: "Parent",
  community: "Community",
};

export default async function SignaturesPage() {
  const supabase = await createClient();
  const [{ data: sigs }, { data: countRow }] = await Promise.all([
    supabase
      .from("signatures")
      .select(
        "display_name, affiliation, school, class_year, reason, created_at, signature_date"
      )
      .eq("display_publicly", true)
      .eq("verified", true)
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("signature_count").select("total").maybeSingle(),
  ]);

  const goal = Number(process.env.NEXT_PUBLIC_SIGNATURE_GOAL ?? 5000);
  const total = countRow?.total ?? 0;

  return (
    <section className="container-edit py-16 md:py-24">
      <div className="max-w-3xl">
        <FadeIn>
          <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6">
            Signatures
          </p>
          <h1
            className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
            style={{ fontSize: "var(--text-display-lg)" }}
          >
            {formatNumber(total)} and growing.
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed">
            A partial list of people who have added their name. Only
            signatories who opted in are shown.
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10">
          <Thermometer goal={goal} />
        </FadeIn>
        <FadeIn delay={0.15} className="mt-6">
          <Link
            href="/sign"
            className="inline-flex items-center gap-2 rounded-none bg-ink text-cream-50 px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            Add your name →
          </Link>
        </FadeIn>
      </div>

      <div className="mt-14">
        {sigs && sigs.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {sigs.map((s, i) => {
              const showAffiliation =
                s.affiliation &&
                !(
                  s.affiliation === "community" &&
                  !s.school &&
                  !s.class_year
                );
              return (
              <FadeIn
                key={`${s.display_name}-${i}`}
                delay={Math.min(i * 0.01, 0.2)}
                as="article"
                className="py-4 border-b border-rule/70"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-serif text-lg text-ink tracking-[-0.01em]">
                    {s.display_name}
                  </p>
                  <span className="text-[11px] tnum text-ink-faint">
                    {relativeTime(s.created_at)}
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">
                  Signed {formatDate(s.signature_date ?? s.created_at)}
                  {showAffiliation && (
                    <>
                      {" · "}
                      {AFFIL_LABEL[s.affiliation] ?? s.affiliation}
                      {s.school && <> · {s.school}</>}
                      {s.class_year && <> · {s.class_year}</>}
                    </>
                  )}
                </p>
                {s.reason && (
                  <p className="text-sm text-ink-soft mt-2 italic">&ldquo;{s.reason}&rdquo;</p>
                )}
              </FadeIn>
            );
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-rule p-10 text-center text-ink-muted">
            No public signatures yet.
          </div>
        )}
      </div>
    </section>
  );
}
