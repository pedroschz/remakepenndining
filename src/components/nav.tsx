"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LiveCount } from "./live-count";

const links = [
  { href: "/petition", label: "Petition" },
  { href: "/evidence", label: "Evidence" },
  { href: "/compare", label: "Compare" },
  { href: "/testimonies", label: "Testimonies" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[background,border,backdrop-filter] duration-300",
        scrolled
          ? "bg-cream-100/85 backdrop-blur-md border-b border-rule"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-edit flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150"
          />
          <span className="font-serif text-[1.05rem] tracking-tight text-ink">
            Remake Penn Dining
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[0.875rem] text-ink-muted">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative transition-colors duration-200 hover:text-ink",
                pathname === l.href && "text-ink"
              )}
            >
              {l.label}
              {pathname === l.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LiveCount className="hidden sm:inline-flex" />
          <Link
            href="/sign"
            className="inline-flex items-center rounded-full bg-ink text-cream-50 px-4 py-2 text-[0.875rem] font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign the petition
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-ink"
          >
            <span className="sr-only">Toggle menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-rule bg-cream-100">
          <nav className="container-edit py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "py-3 text-[0.95rem] border-b border-rule/60",
                  pathname === l.href ? "text-accent" : "text-ink"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
