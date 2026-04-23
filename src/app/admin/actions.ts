"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import {
  clearAdminCookie,
  isAdminAuthed,
  setAdminCookie,
  verifyAdminSecret,
} from "@/lib/admin-auth";

export async function adminLogin(formData: FormData) {
  const secret = String(formData.get("secret") ?? "");
  if (!verifyAdminSecret(secret)) {
    redirect("/admin/login?error=1");
  }
  await setAdminCookie();
  redirect("/admin/reports");
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }
}

export async function hideTestimony(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const reason =
    String(formData.get("reason") ?? "").trim() || "manual review";
  const service = await createServiceClient();
  await service
    .from("testimonies")
    .update({ hidden: true, hidden_reason: reason })
    .eq("id", id);
  revalidatePath("/admin/reports");
  revalidatePath("/testimonies");
}

export async function unhideTestimony(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const service = await createServiceClient();
  await service
    .from("testimonies")
    .update({ hidden: false, hidden_reason: null })
    .eq("id", id);
  revalidatePath("/admin/reports");
  revalidatePath("/testimonies");
}

export async function deleteTestimony(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const service = await createServiceClient();

  const { data: t } = await service
    .from("testimonies")
    .select("image_paths")
    .eq("id", id)
    .single();

  const paths = (t?.image_paths ?? []) as string[];
  if (paths.length > 0) {
    await service.storage.from("testimony-images").remove(paths);
  }

  await service.from("testimonies").delete().eq("id", id);

  revalidatePath("/admin/reports");
  revalidatePath("/testimonies");
}
