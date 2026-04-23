import Link from "@/components/full-page-link";
import { FadeIn } from "./fade-in";
import { timelineEvents, type TimelineEvent } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const categoryLabel: Record<TimelineEvent["category"], string> = {
  sanitation: "Sanitation",
  pest: "Pest",
  "food-safety": "Food safety",
  labor: "Labor",
  policy: "Policy",
};

type Props = { preview?: boolean };

export function Timeline({ preview = false }: Props) {
  const events = preview ? timelineEvents.slice(-6).reverse() : [...timelineEvents].reverse();

  return (
    <section className="rule-soft">
      <div className="container-edit py-16 md:py-24">
        <ol className="mt-14 relative">
          <div
            aria-hidden
            className="absolute left-[7px] md:left-[calc(8rem+7px)] top-2 bottom-2 w-px bg-rule"
          />
          {events.map((e, i) => (
            <FadeIn
              key={`${e.date}-${e.title}`}
              delay={i * 0.04}
              as="article"
              className="relative pl-8 md:pl-40 pb-10 md:pb-12"
            >
              <div
                aria-hidden
                className={cn(
                  "absolute left-0 md:left-32 top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-cream-100",
                  e.category === "pest" || e.category === "food-safety"
                    ? "border-accent"
                    : "border-ink"
                )}
              />
              <div className="md:absolute md:left-0 md:top-0 md:w-28 text-xs tracking-[0.12em] uppercase text-ink-muted font-medium">
                {e.date}
              </div>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <span className="text-[10px] tracking-[0.14em] uppercase text-accent font-medium">
                  {categoryLabel[e.category]}
                </span>
                {e.facility && (
                  <span className="text-[10px] tracking-[0.12em] uppercase text-ink-faint">
                    {e.facility}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-ink mt-2 tracking-[-0.015em]">
                {e.title}
              </h3>
              {e.detail && (
                <p className="mt-2 text-ink-soft leading-relaxed max-w-2xl">
                  {e.detail}
                </p>
              )}
              {e.sourceUrl && (
                <a
                  href={e.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-ink-muted hover:text-accent transition-colors"
                >
                  Source <ExternalLink size={12} />
                </a>
              )}
            </FadeIn>
          ))}
        </ol>

        {preview && (
          <div className="mt-4 md:pl-40">
            <Link
              href="/evidence"
              className="inline-flex items-center gap-2 text-sm text-ink underline decoration-rule decoration-2 underline-offset-4 hover:decoration-accent"
            >
              See every documented incident →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
