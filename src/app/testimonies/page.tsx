import Link from "@/components/full-page-link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSafeTestimonyImageObjectPath } from "@/lib/utils";
import { FadeIn } from "@/components/fade-in";
import { TestimonyCard, type Testimony } from "@/components/testimony-card";

export const metadata: Metadata = {
  title: "Personal experiences",
  description:
    "Anonymous personal experiences with Penn Dining. Community-moderated.",
};

export const revalidate = 0;

export default async function TestimoniesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: isNew } = await searchParams;
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("testimonies")
    .select("id, created_at, body, dining_hall, incident_month, affiliation, image_paths")
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(200);

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const stories: Testimony[] = (rows ?? []).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    body: r.body,
    dining_hall: r.dining_hall,
    incident_month: r.incident_month,
    affiliation: r.affiliation,
    image_urls: (r.image_paths ?? [])
      .filter((p: string) => isSafeTestimonyImageObjectPath(p))
      .map(
        (p: string) => `${base}/storage/v1/object/public/testimony-images/${p}`
      ),
  }));

  return (
    <section className="container-edit py-16 md:py-24">
      <div className="max-w-3xl">
        <FadeIn>
          <h1
            className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
            style={{ fontSize: "var(--text-display-lg)" }}
          >
            In our own words.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/testimonies/new"
              className="inline-flex items-center gap-2 rounded-none bg-ink text-cream-50 px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              Share yours
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/sign"
              className="inline-flex items-center gap-2 rounded-none border border-rule px-5 py-2.5 text-sm text-ink hover:border-ink transition-colors"
            >
              Sign the petition
            </Link>
          </div>
        </FadeIn>
      </div>

      {isNew && (
        <div className="mt-10 rounded-md border border-accent/30 bg-accent/5 text-ink px-4 py-3 text-sm max-w-3xl">
          Posted. Thank you for sharing.
        </div>
      )}

      <div className="mt-14 max-w-3xl">
        {stories.length === 0 ? (
          <FadeIn>
            <div className="rounded-xl border border-dashed border-rule p-10 text-center">
              <p className="text-ink-muted">
                No personal experiences yet.{" "}
                <Link
                  href="/testimonies/new"
                  className="text-ink underline decoration-accent decoration-2 underline-offset-4"
                >
                  Be the first.
                </Link>
              </p>
            </div>
          </FadeIn>
        ) : (
          <div>
            {stories.map((t, i) => (
              <FadeIn key={t.id} delay={Math.min(i * 0.03, 0.3)}>
                <TestimonyCard t={t} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
