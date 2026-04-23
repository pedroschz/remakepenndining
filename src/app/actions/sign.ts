"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { hashIp, PENN_EMAIL_REGEX } from "@/lib/utils";
import { honeypotClean } from "@/lib/spam-guard";

const SIGN_HOURLY_IP_MAX = 5;
const SIGN_DAILY_IP_MAX = 25;
const SIGN_DAILY_ANON_NULL_EMAIL_MAX = 6;

const SignSchema = z.object({
  displayName: z.coerce.string().trim().min(2).max(80),
  email: z
    .string()
    .max(160)
    .transform((s) => s.trim().toLowerCase())
    .transform((s) => (s === "" ? null : s)),
  signatureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a signature date."),
  attestation: z
    .boolean()
    .refine((v) => v, "You must confirm that your information is accurate."),
  displayPublicly: z.boolean(),
});

export type SignResult =
  | { ok: true }
  | { ok: false; error: string };

function isUniqueViolation(err: { code?: string; message?: string }) {
  const msg = (err.message ?? "").toLowerCase();
  return (
    err.code === "23505" ||
    msg.includes("duplicate key") ||
    msg.includes("unique constraint")
  );
}

export async function signPetition(formData: FormData): Promise<SignResult> {
  if (!honeypotClean(formData)) {
    return {
      ok: false,
      error: "Could not save your signature. Please try again.",
    };
  }

  const parsed = SignSchema.safeParse({
    displayName: formData.get("displayName"),
    email: String(formData.get("email") ?? ""),
    signatureDate: String(formData.get("signatureDate") ?? ""),
    attestation: formData.get("attestation") === "on",
    displayPublicly: formData.get("displayPublicly") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid submission.",
    };
  }

  if (/https?:\/\//i.test(parsed.data.displayName)) {
    return {
      ok: false,
      error: "Printed name cannot contain web links.",
    };
  }

  const todayUtc = new Date().toISOString().slice(0, 10);
  const oneYearAgoUtc = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const tomorrowUtc = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  if (
    parsed.data.signatureDate < oneYearAgoUtc ||
    parsed.data.signatureDate > tomorrowUtc
  ) {
    return {
      ok: false,
      error: `Signature date must be a recent date (on or before ${todayUtc}).`,
    };
  }

  const email = parsed.data.email;
  if (email !== null && !PENN_EMAIL_REGEX.test(email)) {
    return {
      ok: false,
      error:
        "If you add an email, it must be a Penn address: @upenn.edu or @school.upenn.edu (for example @seas.upenn.edu).",
    };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "0.0.0.0";
  const ipHash = await hashIp(ip);

  const service = await createServiceClient();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count: hourCount } = await service
    .from("signatures")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", hourAgo);

  if (hourCount !== null && hourCount >= SIGN_HOURLY_IP_MAX) {
    return {
      ok: false,
      error: "Too many signatures from this network in the last hour. Please try again later.",
    };
  }

  const { count: dayCount } = await service
    .from("signatures")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", dayAgo);

  if (dayCount !== null && dayCount >= SIGN_DAILY_IP_MAX) {
    return {
      ok: false,
      error: "Daily signature limit from this network has been reached. Please try again tomorrow.",
    };
  }

  if (!email) {
    const { count: anonDay } = await service
      .from("signatures")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .is("email", null)
      .gte("created_at", dayAgo);

    if (anonDay !== null && anonDay >= SIGN_DAILY_ANON_NULL_EMAIL_MAX) {
      return {
        ok: false,
        error:
          "Too many anonymous signatures from this network today. Add your Penn email to continue signing, or try again tomorrow.",
      };
    }
  }

  if (email) {
    const { data: existing } = await service
      .from("signatures")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return {
        ok: false,
        error: "This email has already signed. Each Penn address can sign once.",
      };
    }
  }

  const row = {
    user_id: null as string | null,
    email,
    display_name: parsed.data.displayName,
    affiliation: "community" as const,
    school: null as string | null,
    class_year: null as string | null,
    reason: null as string | null,
    display_publicly: parsed.data.displayPublicly,
    verified: true,
    ip_hash: ipHash,
    signature_date: parsed.data.signatureDate,
    attestation_accurate: true,
  };

  const { error } = await service.from("signatures").insert(row);

  if (error) {
    if (email && isUniqueViolation(error)) {
      return {
        ok: false,
        error: "This email has already signed. Each Penn address can sign once.",
      };
    }
    return { ok: false, error: "Could not save your signature. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/petition");
  revalidatePath("/signatures");
  redirect("/sign/thanks");
}
