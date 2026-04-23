import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PENN_EMAIL_REGEX } from "@/lib/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/sign";

  if (!code) {
    return NextResponse.redirect(new URL("/sign?error=missing_code", url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/sign?error=${encodeURIComponent(error.message)}`, url)
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !PENN_EMAIL_REGEX.test(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/sign?error=not_penn", url));
  }

  return NextResponse.redirect(new URL(next, url));
}
