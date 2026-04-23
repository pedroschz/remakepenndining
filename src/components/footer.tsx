import Link from "next/link";

export function Footer() {
  return (
    <footer className="rule-soft mt-24 py-14 text-sm text-ink-muted">
      <div className="container-edit grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="font-serif text-lg text-ink tracking-tight"
          >
            Remake Penn Dining
          </Link>
          <p className="mt-3 max-w-md leading-relaxed">
            A student-organized petition built on the public record. We are not
            affiliated with the University of Pennsylvania. Every claim on this
            site cites a primary source; health inspection report, news
            article, or court filing.
          </p>
        </div>
        <div>
          <h4 className="text-ink font-medium mb-3">The case</h4>
          <ul className="space-y-2">
            <li><Link href="/petition" className="hover:text-ink">Read the petition</Link></li>
            <li><Link href="/evidence" className="hover:text-ink">Evidence timeline</Link></li>
            <li><Link href="/compare" className="hover:text-ink">Peer comparison</Link></li>
            <li><Link href="/testimonies" className="hover:text-ink">Testimonies</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-ink font-medium mb-3">Act</h4>
          <ul className="space-y-2">
            <li><Link href="/sign" className="hover:text-ink">Sign the petition</Link></li>
            <li><Link href="/testimonies/new" className="hover:text-ink">Share your experience</Link></li>
            <li><Link href="/share" className="hover:text-ink">Share the campaign</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-edit mt-10 pt-6 border-t border-rule flex flex-wrap items-center justify-between gap-3 text-xs">
        <p>&copy; {new Date().getFullYear()} Remake Penn Dining. Student-organized.</p>
        <p className="text-ink-faint">
          Not affiliated with the University of Pennsylvania or Bon Appétit Management Company.
        </p>
      </div>
    </footer>
  );
}
