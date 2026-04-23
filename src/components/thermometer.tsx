"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { formatNumber } from "@/lib/utils";

export function Thermometer({ goal, dark }: { goal: number; dark?: boolean }) {
  const [count, setCount] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const fetchCount = async () => {
      const { data } = await supabase
        .from("signature_count")
        .select("total")
        .maybeSingle();
      if (mounted) {
        setCount(data?.total ?? 0);
        setLoaded(true);
      }
    };
    fetchCount();

    const channel = supabase
      .channel(`thermometer-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signatures" },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const pct = Math.min(100, Math.round((count / goal) * 100));

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <span className={`font-serif text-4xl md:text-5xl tnum ${dark ? "text-cream-50" : "text-ink"}`}>
            {formatNumber(count)}
          </span>
          <span className={`text-sm ${dark ? "text-cream-300/70" : "text-ink-muted"}`}>
            of {formatNumber(goal)} goal
          </span>
        </div>
        <span className={`text-sm tnum ${dark ? "text-cream-300/70" : "text-ink-muted"}`}>{pct}%</span>
      </div>
      <div className={`h-[6px] w-full overflow-hidden rounded-full ${dark ? "bg-cream-50/15" : "bg-cream-300/70"}`}>
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${loaded ? pct : 0}%` }}
          transition={{
            duration: reduce ? 0.2 : 1.1,
            ease: [0.2, 0.65, 0.25, 1],
          }}
        />
      </div>
    </div>
  );
}
