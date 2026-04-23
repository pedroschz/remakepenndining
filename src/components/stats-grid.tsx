import { FadeIn } from "./fade-in";
import { headlineStats } from "@/lib/data";

export function StatsGrid() {
  return (
    <section className="rule-soft">
      <div className="container-edit py-16 md:py-24">
        <FadeIn>
          <p className="text-xs tracking-[0.2em] uppercase text-ink-muted mb-4">
            By the numbers
          </p>
          <h2
            className="font-serif text-ink max-w-3xl leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "var(--text-display-md)" }}
          >
            The case against Bon Appétit is not a matter of opinion.
            It is a matter of record.
          </h2>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
          {headlineStats.map((stat, i) => (
            <FadeIn
              key={stat.label}
              delay={i * 0.06}
              className="bg-cream-100 p-8 md:p-10 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="font-serif text-5xl md:text-6xl text-accent tnum tracking-[-0.02em] leading-none">
                  {stat.value}
                </div>
                <div className="mt-3 text-ink font-medium">{stat.label}</div>
              </div>
              <p className="text-sm text-ink-muted mt-6 leading-relaxed">
                {stat.context}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
