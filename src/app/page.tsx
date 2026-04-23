import { Hero } from "@/components/hero";
import { StatsGrid } from "@/components/stats-grid";
import { Timeline } from "@/components/timeline";
import { ComparisonTable } from "@/components/comparison-table";
import { PullQuote } from "@/components/pull-quote";
import { CtaBand } from "@/components/cta-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsGrid />
      <PullQuote
        quote="We've normalized the abnormal, accepting substandard conditions that would shutter any regular restaurant in Philadelphia."
        attribution="Elo Esalomi"
        role="Daily Pennsylvanian, November 2024"
      />
      <Timeline preview />
      <ComparisonTable />
      <PullQuote
        quote="Everything is elevating but us."
        attribution="Troy Harris"
        role="Falk Dining chef, 23+ years at Penn"
      />
      <CtaBand />
    </>
  );
}
