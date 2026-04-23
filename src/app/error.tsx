"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container-edit py-24 md:py-32 max-w-xl">
      <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6">
        Something went wrong
      </p>
      <h1
        className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
        style={{ fontSize: "var(--text-display-md)" }}
      >
        Sorry.
      </h1>
      <p className="mt-6 text-ink-soft">
        Something on our side didn&rsquo;t work. You can try again if this
        keeps happening, the bug is ours, not yours.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-ink-faint font-mono">Ref: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-none bg-ink text-cream-50 px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        Try again
      </button>
    </section>
  );
}
