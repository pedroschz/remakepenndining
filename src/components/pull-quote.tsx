import { FadeIn } from "./fade-in";

type Props = {
  quote: string;
  attribution: string;
  role?: string;
};

export function PullQuote({ quote, attribution, role }: Props) {
  return (
    <section className="rule-soft bg-cream-50">
      <div className="container-edit py-20 md:py-28 max-w-4xl">
        <FadeIn>
          <div className="font-serif text-accent text-7xl leading-none select-none">
            &ldquo;
          </div>
          <blockquote
            className="font-serif text-ink leading-[1.15] tracking-[-0.02em] mt-2"
            style={{ fontSize: "var(--text-display-md)" }}
          >
            {quote}
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-10 bg-accent" />
            <div>
              <div className="text-ink font-medium">{attribution}</div>
              {role && <div className="text-sm text-ink-muted">{role}</div>}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
