"use client";

import { useEffect, useId, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Props = { className?: string; verbose?: boolean; plain?: boolean };

/** Standalone text — no border/box. Parent row should use items-end for baseline with buttons. */
export function LiveCount({ className, verbose, plain }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const id = useId();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const fetchCount = async () => {
      const { data } = await supabase
        .from("signature_count")
        .select("total")
        .maybeSingle();
      if (mounted) setCount(data?.total ?? 0);
    };

    fetchCount();

    const channel = supabase
      .channel(`signatures-live-${id}`)
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

  const plainBody =
    "text-lg md:text-xl text-ink-soft leading-relaxed font-sans";
  const compactBody =
    "font-sans text-sm text-ink-soft leading-none tracking-tight";

  if (count === null) {
    return (
      <span
        className={cn(
          "inline-flex items-end gap-2",
          plain ? plainBody : cn(compactBody, "text-ink-muted"),
          className
        )}
      >
        <span className="h-1.5 w-1.5 shrink-0 translate-y-px rounded-full bg-ink-faint animate-pulse" />
        loading…
      </span>
    );
  }

  const verboseSuffix =
    count === 1 ? "person has signed" : "people have signed";

  return (
    <span
      className={cn(
        "inline-flex items-end flex-wrap gap-x-1.5 gap-y-0",
        plain ? plainBody : compactBody,
        className
      )}
    >
      <span
        className={plain ? "tabular-nums" : "tabular-nums font-medium text-ink"}
      >
        {formatNumber(count)}
      </span>
      <span className={plain ? undefined : "text-ink-muted"}>
        {verbose ? verboseSuffix : "signed"}
      </span>
    </span>
  );
}
