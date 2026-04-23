import Link from "@/components/full-page-link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { LiveCount } from "@/components/live-count";

export const metadata: Metadata = {
  title: "The petition",
  description:
    "The full case against Bon Appétit at Penn (13 years of violations, a $6,960 meal plan, and the proven insourcing path Penn has refused to take).",
};

export default function PetitionPage() {
  return (
    <article className="container-edit py-16 md:py-24 max-w-3xl">
      <FadeIn>
        <h1
          className="font-serif text-ink leading-[1.02] tracking-[-0.025em]"
          style={{ fontSize: "var(--text-display-lg)" }}
        >
          The case against Bon Appétit at Penn
        </h1>
        <div className="mt-8 flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <Link
              href="/sign"
              className="group inline-flex items-center gap-2 rounded-none bg-ink text-cream-50 px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent"
            >
              Add my signature
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
          <LiveCount verbose className="shrink-0 self-end" />
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-16 prose-custom space-y-8 text-ink-soft leading-[1.75] text-[1.0625rem]">
        <p className="drop-cap font-serif text-[1.15rem] leading-[1.7] text-ink">
          The factual record (drawn from Philadelphia Department of Public
          Health inspection reports, Daily Pennsylvanian investigations,
          peer-institution comparisons, and a national pattern of labor and
          safety failures at Bon Appétit Management Company (BAMCO) accounts)
          supports every core claim of this petition. Penn pays{" "}
          <strong className="text-ink">$6,744 / year</strong> (rising to{" "}
          <strong className="text-ink">$6,960 in 2026–27</strong>) for a program
          that has logged 100+ health code observations in a single 2023
          inspection cycle, documented
          repeat pest violations into 2026, no Princeton Review ranking, and a
          contractor with a documented history of worker mistreatment at Penn
          and elsewhere.
        </p>

        <Section title="A 13-year pattern of sanitation failures">
          <p>
            The Philadelphia Office of Food Protection inspection record
            establishes a sustained pattern of violations at BAMCO-operated Penn
            facilities from 2013 through February 2026. The 2023 crisis was
            systemic, not accidental: a winter 2022–23 inspection cycle produced{" "}
            100 total observations of health code violations across Penn
            Dining facilities. Hill House Dining logged 16 distinct violations
            and 38 points of concern (including six separate sightings of mouse
            droppings), two in direct contact with pans and
            containers of ingredients.
          </p>
          <p>
            The pattern extends forward, directly contradicting Penn's 2023
            reassurances. In the January–February 2026 inspection cycle,
            inspectors found a dead mouse on a sticky trap in 1920
            Commons&rsquo; canned-food storage room, cited explicitly as a
            repeat violation under Category 53. At Houston Market, inspectors
            logged ten violations in a single visit (including cooked eggs held
            overnight at improper temperature that were discarded by the
            inspector).
          </p>
        </Section>

        <Section title="What students pay, and what they get">
          <p>
            First-year students are required to buy either the 296-swipe or
            187-swipe plan, both priced at{" "}
            <strong className="text-ink">$6,744 / year</strong>. The Board of
            Trustees approved a rise to{" "}
            <strong className="text-ink">$6,960 / year</strong> for 2026–27.
            First-years pay $10.97–$15.89 per swipe; upperclass plans cost
            $17.50–$17.77 per swipe; the market inverts standard demand
            elasticity so that students who cannot leave get the &ldquo;volume
            discount&rdquo; while those who can leave are priced punitively.
          </p>
          <p>
            Student satisfaction has been measured, and it is dire. A December
            2022 Class of 2025 GroupMe poll found only 4.9%
            satisfied with Penn Dining. A 2016 DP survey of 290 freshmen found
            ~80% wished they did not have to be on a meal plan. Penn's contract
            with BAMCO has not been
            publicly rebid since 2009.
          </p>
        </Section>

        <Section title="Peers who self-operate deliver better food for comparable or lower cost">
          <p>
            The 2026 Princeton Review Top 25 for Best Campus Food is dominated
            by self-operated programs. Not a single Bon Appétit-operated Ivy or
            Ivy+ peer appears. UMass Amherst has held #1 for nine consecutive
            years. Yale's unlimited plan costs $9,100 / year; Princeton ~$4,500;
            Cornell $7,328 (all self-operated, ranked peers). Johns Hopkins
            ended its BAMCO contract in 2022 and rehired every hourly worker as a
            JHU
            employee, now earning a starting wage of $19.88 / hr with full
            benefits. Kent State and the University of Rochester have done the
            same.
          </p>
        </Section>

        <Section title="BAMCO has a documented labor record (at Penn and nationally)">
          <p>
            Penn's dining workforce is split in two: residential halls are
            staffed by AFSCME-represented Penn employees; retail locations and
            Falk Kosher Dining are staffed by Bon Appétit employees
            represented by Teamsters Local 929. In March 2020, BAMCO planned
            to lay off ~140 Penn retail dining workers without pay. A student
            petition drew 8,322 signatures in days and Penn reversed course, but
            the episode
            demonstrated that outsourcing exports Penn's labor risk to a
            contractor that sheds Penn workers first in a crisis. Penn-employed
            residential workers retained pay throughout.
          </p>
          <p>
            Compass Group, BAMCO's parent, has paid{" "}
            <strong className="text-ink">$41.9 million in documented
            regulatory penalties since 2000</strong>. Oberlin College
            terminated Bon Appétit in 2020 after an executive chef sexual
            harassment lawsuit and chronic kitchen safety failures. Washington
            University lost its 25-year BAMCO contract in 2023 when BAMCO
            itself walked away after workers unionized.
          </p>
        </Section>

        <Section title="What we're asking for">
          <ol className="list-decimal pl-6 space-y-3 marker:text-accent marker:font-serif marker:text-lg">
            <li>
              <strong className="text-ink">End Penn&rsquo;s contract with
              Bon Appétit Management Company</strong> at the earliest available
              exit point, and commit to a fully self-operated dining program.
            </li>
            <li>
              <strong className="text-ink">Retain every current dining
              worker</strong> (both AFSCME residential staff and Teamsters Local
              929 retail staff) as direct University employees at
              improved wages, parity between residential and retail roles, and
              full Penn benefits.
            </li>
            <li>
              <strong className="text-ink">Establish a Dining Advisory
              Board</strong> with real authority, seating students, workers,
              and nutrition/sustainability experts, with published minutes and
              binding input on menus, hours, pricing, and vendor sourcing.
            </li>
            <li>
              <strong className="text-ink">Publish a multi-year capital and
              operating plan</strong> for the transition that acknowledges the
              known pitfalls of the Johns Hopkins switch and budgets
              accordingly for staffing, training, and facility investment.
            </li>
            <li>
              <strong className="text-ink">Restructure the meal plan</strong>{" "}
              to eliminate swipe forfeiture, allow mid-semester opt-out, and
              bring per-swipe cost into line with self-operated peers.
            </li>
          </ol>
        </Section>

        <p className="pt-6 font-serif text-xl text-ink italic leading-snug">
          The record supports every major factual claim of this petition. BAMCO&rsquo;s performance justifies
          termination, and it is time for Penn to meet the standard that its
          Ivy+ peers have already set.
        </p>
      </FadeIn>

      <FadeIn delay={0.2} className="mt-16 flex flex-wrap gap-4 items-center">
        <Link
          href="/sign"
          className="group inline-flex items-center gap-2 rounded-none bg-ink text-cream-50 px-6 py-3 font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.02]"
        >
          Sign the petition
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href="/evidence"
          className="inline-flex items-center gap-2 rounded-none border border-rule px-6 py-3 text-ink transition-all duration-200 hover:border-ink"
        >
          See every cited source
        </Link>
      </FadeIn>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl md:text-3xl text-ink mt-12 mb-4 tracking-[-0.015em]">
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
