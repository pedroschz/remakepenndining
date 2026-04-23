"use client";

import { useEffect, useId, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Props = { className?: string; verbose?: boolean };

export function LiveCount({ className, verbose }: Props) {
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

  if (count === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1 text-xs text-ink-muted",
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ink-faint animate-pulse" />
        loading…
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1 text-xs tnum text-ink",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span className="font-medium">{formatNumber(count)}</span>
      <span className="text-ink-muted">
        {verbose ? "Penn community have signed" : "signed"}
      </span>
    </span>
  );
}
