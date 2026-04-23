"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { hashIp } from "@/lib/utils";

const BANNED_PATTERNS = [
  /\b(kill|murder|rape)\s+[a-z]+\b/i,
  /\bn[i1]gg[ae]r/i,
  /\bf[a@]gg?[o0]t/i,
];

const DINING_HALLS = [
  "1920 Commons",
  "Hill House",
  "Kings Court English",
  "Lauder",
  "Quaker Kitchen",
  "Houston Market",
  "Joe's Cafe",
  "Pret",
  "Accenture Cafe",
  "Gourmet Grocer",
  "Falk Kosher",
  "Penn Pi",
  "Other",
] as const;

const AFFIL = [
  "undergraduate",
  "graduate",
  "faculty",
  "staff",
  "alum",
  "parent",
  "community",
] as const;

const TestimonySchema = z.object({
  body: z.string().min(30, "Tell us a little more; at least 30 characters.").max(2000),
  diningHall: z.enum(DINING_HALLS).optional().or(z.literal("")),
  incidentMonth: z.string().optional().or(z.literal("")),
  affiliation: z.enum(AFFIL).optional().or(z.literal("")),
});

export type TestimonyResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function submitTestimony(formData: FormData): Promise<TestimonyResult> {
  const parsed = TestimonySchema.safeParse({
    body: formData.get("body"),
    diningHall: formData.get("diningHall") ?? undefined,
    incidentMonth: formData.get("incidentMonth") ?? undefined,
    affiliation: formData.get("affiliation") ?? undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }

  const body = parsed.data.body.trim();
  if (BANNED_PATTERNS.some((p) => p.test(body))) {
    return {
      ok: false,
      error:
        "Your post appears to violate the community guidelines. Please revise and focus on experiences, not people.",
    };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "0.0.0.0";
  const ipHash = await hashIp(ip);

  const supabase = await createClient();

  const { data: recent } = await supabase
    .from("testimonies")
    .select("id, created_at")
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

  if (recent && recent.length >= 2) {
    return {
      ok: false,
      error: "You've posted a lot recently. Please wait a few minutes before posting again.",
    };
  }

  const service = await createServiceClient();
  const imagePaths: string[] = [];
  const files = formData.getAll("images").filter((v): v is File => v instanceof File && v.size > 0);

  for (const file of files.slice(0, 3)) {
    if (file.size > 5 * 1024 * 1024) continue;
    if (!/^image\/(jpe?g|png|webp|heic)$/.test(file.type)) continue;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${ipHash}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await service.storage
      .from("testimony-images")
      .upload(path, file, { contentType: file.type, cacheControl: "3600" });
    if (!upErr) imagePaths.push(path);
  }

  const { data, error } = await supabase
    .from("testimonies")
    .insert({
      body,
      dining_hall: parsed.data.diningHall || null,
      incident_month: parsed.data.incidentMonth
        ? `${parsed.data.incidentMonth}-01`
        : null,
      affiliation: parsed.data.affiliation || null,
      image_paths: imagePaths,
      ip_hash: ipHash,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: "Could not save your testimony. Please try again." };
  }

  revalidatePath("/testimonies");
  return { ok: true, id: data.id };
}

const ReportSchema = z.object({
  testimonyId: z.string().uuid(),
  reason: z.enum([
    "harassment",
    "personal_info",
    "off_topic",
    "spam",
    "misinformation",
    "other",
  ]),
  note: z.string().max(500).optional().or(z.literal("")),
});

export async function reportTestimony(formData: FormData) {
  const parsed = ReportSchema.safeParse({
    testimonyId: formData.get("testimonyId"),
    reason: formData.get("reason"),
    note: formData.get("note") ?? undefined,
  });

  if (!parsed.success) return { ok: false, error: "Invalid report." };

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "0.0.0.0";
  const ipHash = await hashIp(ip);

  const supabase = await createClient();
  const { error } = await supabase.from("testimony_reports").insert({
    testimony_id: parsed.data.testimonyId,
    reason: parsed.data.reason,
    note: parsed.data.note || null,
    ip_hash: ipHash,
  });

  if (error && !error.message.includes("duplicate")) {
    return { ok: false, error: "Could not file the report." };
  }

  revalidatePath("/testimonies");
  return { ok: true };
}
