"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hashIp, PENN_EMAIL_REGEX } from "@/lib/utils";

const SignSchema = z.object({
  displayName: z.string().min(2).max(80),
  affiliation: z.enum([
    "undergraduate",
    "graduate",
    "faculty",
    "staff",
    "alum",
    "parent",
    "community",
  ]),
  school: z.string().max(80).optional().or(z.literal("")),
  classYear: z.string().max(16).optional().or(z.literal("")),
  reason: z.string().max(280).optional().or(z.literal("")),
  displayPublicly: z.boolean().default(true),
});

export type SignResult =
  | { ok: true }
  | { ok: false; error: string };

export async function signPetition(formData: FormData): Promise<SignResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      error: "You must sign in with your @upenn.edu email first.",
    };
  }

  if (!user.email || !PENN_EMAIL_REGEX.test(user.email)) {
    return {
      ok: false,
      error: "Only @upenn.edu email addresses can sign this petition.",
    };
  }

  const parsed = SignSchema.safeParse({
    displayName: formData.get("displayName"),
    affiliation: formData.get("affiliation"),
    school: formData.get("school") ?? undefined,
    classYear: formData.get("classYear") ?? undefined,
    reason: formData.get("reason") ?? undefined,
    displayPublicly: formData.get("displayPublicly") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid submission.",
    };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "0.0.0.0";
  const ipHash = await hashIp(ip);

  const { error } = await supabase.from("signatures").upsert(
    {
      user_id: user.id,
      email: user.email,
      display_name: parsed.data.displayName,
      affiliation: parsed.data.affiliation,
      school: parsed.data.school || null,
      class_year: parsed.data.classYear || null,
      reason: parsed.data.reason || null,
      display_publicly: parsed.data.displayPublicly,
      verified: true,
      ip_hash: ipHash,
    },
    { onConflict: "email" }
  );

  if (error) {
    return { ok: false, error: "Could not save your signature. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/petition");
  revalidatePath("/signatures");
  redirect("/sign/thanks");
}
