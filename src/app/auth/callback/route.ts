import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Same-origin path only — blocks open redirects via ?next= */
function safeNextPath(raw: string | null): string {
  const fallback = "/sign";
  if (raw == null || raw === "") return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://") || trimmed.includes("\\")) return fallback;
  if (trimmed.length > 2048) return fallback;
  return trimmed;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextPath = safeNextPath(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/sign?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/sign?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/sign?error=no_email", url.origin));
  }

  return NextResponse.redirect(new URL(nextPath, url.origin));
}
