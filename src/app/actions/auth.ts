"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PENN_EMAIL_REGEX } from "@/lib/utils";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://remakepenndining.org";
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
