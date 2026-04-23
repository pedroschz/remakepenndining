"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { hashIp, isSafeTestimonyImageObjectPath } from "@/lib/utils";
import {
  countHttpUrls,
  honeypotClean,
  maxConsecutiveSameChar,
} from "@/lib/spam-guard";

const IMAGE_MAX_DIMENSION = 1600;
const IMAGE_WEBP_QUALITY = 80;

const BANNED_PATTERNS = [
  /\b(kill|murder|rape)\s+[a-z]+\b/i,
  /\bn[i1]gg[ae]r/i,
  /\bf[a@]gg?[o0]t/i,
];

const POST_SHORT_WINDOW_MS = 15 * 60 * 1000;
const POST_SHORT_WINDOW_MAX = 2;
const POST_DAILY_IP_MAX = 12;
const MAX_URLS_IN_BODY = 8;
const MAX_CHAR_RUN = 36;
const MAX_IMAGE_BYTES_PER_POST = 14 * 1024 * 1024;

const REPORT_HOURLY_IP_MAX = 15;

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
  if (!honeypotClean(formData)) {
    return { ok: false, error: "Could not save your experience. Please try again." };
  }

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

  if (countHttpUrls(body) > MAX_URLS_IN_BODY) {
    return {
      ok: false,
      error: "Too many links in one post. Please remove extra URLs and try again.",
    };
  }

  if (maxConsecutiveSameChar(body) > MAX_CHAR_RUN) {
    return {
      ok: false,
      error: "This post looks like automated filler. Please use normal sentences and try again.",
    };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "0.0.0.0";
  const ipHash = await hashIp(ip);

  const service = await createServiceClient();
  const shortSince = new Date(Date.now() - POST_SHORT_WINDOW_MS).toISOString();
  const daySince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count: shortCount } = await service
    .from("testimonies")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", shortSince);

  if (shortCount !== null && shortCount >= POST_SHORT_WINDOW_MAX) {
    return {
      ok: false,
      error: "You've posted several times recently. Please wait before posting again.",
    };
  }

  const { count: dayCount } = await service
    .from("testimonies")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", daySince);

  if (dayCount !== null && dayCount >= POST_DAILY_IP_MAX) {
    return {
      ok: false,
      error: "Daily post limit from this network has been reached. Please try again tomorrow.",
    };
  }

  const imagePaths: string[] = [];
  const files = formData.getAll("images").filter((v): v is File => v instanceof File && v.size > 0);

  let totalBytes = 0;
  for (const file of files.slice(0, 3)) {
    if (file.size > 5 * 1024 * 1024) continue;
    if (!/^image\/(jpe?g|png|webp|heic|heif)$/.test(file.type)) continue;
    totalBytes += file.size;
    if (totalBytes > MAX_IMAGE_BYTES_PER_POST) {
      return {
        ok: false,
        error: "Total image size is too large for one post. Remove or shrink images and try again.",
      };
    }

    let processed: Buffer;
    try {
      processed = await sharp(Buffer.from(await file.arrayBuffer()), {
        failOn: "none",
      })
        .rotate()
        .resize({
          width: IMAGE_MAX_DIMENSION,
          height: IMAGE_MAX_DIMENSION,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: IMAGE_WEBP_QUALITY })
        .toBuffer();
    } catch {
      continue;
    }

    const path = `${ipHash}/${crypto.randomUUID()}.webp`;
    if (!isSafeTestimonyImageObjectPath(path)) continue;

    const { error: upErr } = await service.storage
      .from("testimony-images")
      .upload(path, processed, {
        contentType: "image/webp",
        cacheControl: "31536000",
      });
    if (!upErr) imagePaths.push(path);
  }

  const { data, error } = await service
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
    return { ok: false, error: "Could not save your experience. Please try again." };
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
  if (!honeypotClean(formData)) {
    return { ok: false, error: "Could not file the report." };
  }

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

  const service = await createServiceClient();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: reportHour } = await service
    .from("testimony_reports")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", hourAgo);

  if (reportHour !== null && reportHour >= REPORT_HOURLY_IP_MAX) {
    return {
      ok: false,
      error: "Too many reports from this network recently. Please try again later.",
    };
  }

  const { error } = await service.from("testimony_reports").insert({
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
