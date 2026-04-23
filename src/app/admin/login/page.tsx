import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { adminLogin } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthed()) redirect("/admin/reports");
  const { error } = await searchParams;

  return (
    <section className="container-edit py-16 md:py-24">
      <div className="max-w-sm">
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-6 tracking-[-0.02em]">
          Admin
        </h1>
        {error && (
          <div className="mb-4 rounded-md border border-accent/40 bg-accent/5 text-accent text-sm px-3 py-2">
            Incorrect secret.
          </div>
        )}
        <form action={adminLogin} className="space-y-4">
          <label className="block">
            <span className="block text-sm text-ink mb-1.5">Secret</span>
            <input
              name="secret"
              type="password"
              required
              autoComplete="current-password"
              autoFocus
              className="w-full rounded-md border border-rule bg-cream-50 px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-ink"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-none bg-ink text-cream-50 px-6 py-3 font-medium hover:bg-accent transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
