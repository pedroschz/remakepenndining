"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PENN_EMAIL_REGEX } from "@/lib/utils";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl()}/auth/callback`,
      queryParams: { hd: "upenn.edu", prompt: "select_account" },
    },
  });
  if (error || !data.url) {
    return { ok: false, error: error?.message ?? "Could not start Google sign-in." };
  }
  redirect(data.url);
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!PENN_EMAIL_REGEX.test(email)) {
    return { ok: false, error: "Please use your @upenn.edu email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) return { ok: false, error: error.message };

  return { ok: true, email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
