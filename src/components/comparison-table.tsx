import { FadeIn } from "./fade-in";
import { peerSchools } from "@/lib/data";
import { cn, formatNumber } from "@/lib/utils";

const modelLabel: Record<string, string> = {
  "self-op": "Self-operated",
  contracted: "Outsourced",
  hybrid: "Hybrid",
};

export function ComparisonTable() {
  return (
    <section className="rule-soft">
      <div className="container-edit py-16 md:py-24">
        <FadeIn className="max-w-3xl">
          <p className="text-xs tracking-[0.2em] uppercase text-ink-muted mb-4">
            Peer comparison
          </p>
          <h2
            className="font-serif text-ink leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "var(--text-display-md)" }}
          >
            Every top-ranked Ivy peer
            <span className="italic text-accent"> self-operates</span>.
          </h2>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed">
            Johns Hopkins, Kent State, Oberlin, and the University of Rochester
            have already terminated their contracts. Penn pays 20–40% more per
            year than UMass Amherst — ranked #1 for nine consecutive years.
          </p>
        </FadeIn>

        <FadeIn className="mt-12 overflow-x-auto rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-200 border-b border-rule text-left">
                <th className="py-4 px-5 font-medium text-ink-muted uppercase tracking-[0.1em] text-xs">
                  School
                </th>
                <th className="py-4 px-5 font-medium text-ink-muted uppercase tracking-[0.1em] text-xs">
                  Model
                </th>
                <th className="py-4 px-5 font-medium text-ink-muted uppercase tracking-[0.1em] text-xs text-right">
                  Unlimited plan / yr
                </th>
                <th className="py-4 px-5 font-medium text-ink-muted uppercase tracking-[0.1em] text-xs text-right">
                  PR Rank
                </th>
                <th className="py-4 px-5 font-medium text-ink-muted uppercase tracking-[0.1em] text-xs">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {peerSchools.map((s) => {
                const isPenn = s.name === "Penn";
                return (
                  <tr
                    key={s.name}
                    className={cn(
                      "border-b border-rule/70 last:border-0 align-top",
                      isPenn && "bg-accent/5"
                    )}
                  >
                    <td className="py-5 px-5">
                      <div
                        className={cn(
                          "font-serif text-lg",
                          isPenn ? "text-accent font-medium" : "text-ink"
                        )}
                      >
                        {s.name}
                      </div>
                      {s.contractor && (
                        <div className="text-xs text-ink-muted mt-1">
                          {s.contractor}
                        </div>
                      )}
                    </td>
                    <td className="py-5 px-5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs",
                          s.model === "self-op"
                            ? "bg-ink text-cream-50"
                            : s.model === "contracted"
                            ? "bg-accent/10 text-accent"
                            : "bg-cream-300 text-ink"
                        )}
                      >
                        {modelLabel[s.model]}
                      </span>
                    </td>
                    <td className="py-5 px-5 text-right tnum text-ink">
                      {s.unlimitedPlanYear
                        ? `$${formatNumber(s.unlimitedPlanYear)}`
                        : "—"}
                    </td>
                    <td className="py-5 px-5 text-right tnum text-ink">
                      {s.princetonReviewRank === "—"
                        ? "—"
                        : `#${s.princetonReviewRank}`}
                    </td>
                    <td className="py-5 px-5 text-ink-muted max-w-md">
                      {s.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </FadeIn>
        <p className="mt-6 text-xs text-ink-faint max-w-3xl">
          Princeton Review rankings from the 2026 Best Campus Food list. Plan
          costs reflect publicly listed unlimited plans; some peers do not list
          single-tier unlimited equivalents.
        </p>
      </div>
    </section>
  );
}
