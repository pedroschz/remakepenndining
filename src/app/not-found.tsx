import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-edit py-24 md:py-32 max-w-xl">
      <p className="text-xs tracking-[0.2em] uppercase text-accent mb-6">404</p>
      <h1
        className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
        style={{ fontSize: "var(--text-display-md)" }}
      >
        Not found.
      </h1>
      <p className="mt-6 text-ink-soft">
        The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink text-cream-50 px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        Back to the case →
      </Link>
    </section>
  );
}
