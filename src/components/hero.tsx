"use client";

import Link from "@/components/full-page-link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LiveCount } from "./live-count";

export function Hero() {
  const reduce = useReducedMotion();
  const ease: [number, number, number, number] = [0.2, 0.65, 0.25, 1];

  return (
    <section className="relative overflow-hidden">
      <div className="container-edit pt-16 md:pt-28 pb-16 md:pb-24">

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-serif text-ink leading-[0.95] tracking-[-0.03em]"
          style={{ fontSize: "var(--text-display-xl)" }}
        >
          We deserve better
          <br />
          <span className="italic text-accent">than this.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-ink-soft leading-relaxed"
        >
          Thirteen years of health violations. A $6,960 meal plan. A contractor
          that has laid off Penn workers and been found with a dead mouse in
          canned-food storage as recently as January 2026. It is time to insource
          Penn Dining; the way every top-ranked Ivy peer already has.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          className="mt-10 flex w-full max-w-2xl flex-wrap items-end justify-between gap-x-6 gap-y-3"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <Link
              href="/sign"
              className="group inline-flex items-center gap-2 rounded-none bg-ink text-cream-50 px-6 py-3 text-[0.95rem] font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign the petition
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/petition"
              className="inline-flex items-center gap-2 rounded-none border border-rule px-6 py-3 text-[0.95rem] text-ink transition-all duration-200 hover:border-ink hover:bg-cream-200"
            >
              Read the full petition
            </Link>
          </div>
          <LiveCount verbose plain className="shrink-0 self-end" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          className="mt-6"
        >
          <Link
            href="/testimonies"
            className="group inline-flex items-center gap-2 text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
          >
            <span className="underline decoration-accent/60 decoration-[1.5px] underline-offset-[6px] transition-colors group-hover:decoration-accent">
              I&apos;ve had a bad experience with Penn Dining
            </span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
