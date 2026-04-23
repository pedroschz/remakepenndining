import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDate(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function relativeTime(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const diff = (Date.now() - d.getTime()) / 1000;
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let value = -diff;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [step, u] of units) {
    if (Math.abs(value) < step) { unit = u; break; }
    value = value / step;
    unit = u;
  }
  return new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(
    Math.round(value),
    unit
  );
}

/**
 * Hash an IP address for rate-limiting without storing PII.
 * Not cryptographically strong — defense-in-depth only.
 */
export async function hashIp(ip: string, salt = "remakepenndining") {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const PENN_EMAIL_REGEX = /^[^\s@]+@([a-z0-9.-]+\.)?upenn\.edu$/i;
