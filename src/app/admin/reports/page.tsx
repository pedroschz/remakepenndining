import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { formatDate, relativeTime } from "@/lib/utils";
import { adminLogout } from "../actions";
import { ModerationControls } from "./moderation-controls";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reported testimonies",
  robots: { index: false, follow: false },
};

type ReportedRow = {
  id: string;
  created_at: string;
  body: string;
  hidden: boolean;
  hidden_reason: string | null;
  report_count: number;
  dining_hall: string | null;
  affiliation: string | null;
  image_paths: string[] | null;
  testimony_reports: Array<{
    id: string;
    created_at: string;
    reason: string;
    note: string | null;
  }>;
};

export default async function AdminReportsPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const service = await createServiceClient();
  const { data } = await service
    .from("testimonies")
    .select(
      "id, created_at, body, hidden, hidden_reason, report_count, dining_hall, affiliation, image_paths, testimony_reports (id, created_at, reason, note)"
    )
    .gt("report_count", 0)
    .order("hidden", { ascending: true })
    .order("report_count", { ascending: false })
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as ReportedRow[];
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <section className="container-edit py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink tracking-[-0.02em]">
            Reported testimonies
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {rows.length === 0
              ? "Nothing to review."
              : `${rows.length} testimony${rows.length === 1 ? "" : " entries"} with reports.`}
          </p>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 decoration-rule hover:decoration-ink"
          >
            Sign out
          </button>
        </form>
      </div>

      {rows.length === 0 ? null : (
        <ul className="space-y-8">
          {rows.map((r) => (
            <li
              key={r.id}
              className={`rounded-lg border p-6 ${
                r.hidden
                  ? "border-accent/40 bg-accent/5"
                  : "border-rule bg-cream-50"
              }`}
            >
              <header className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted mb-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-md uppercase tracking-[0.08em] text-[10px] ${
                    r.hidden
                      ? "bg-accent text-cream-50"
                      : "bg-ink text-cream-50"
                  }`}
                >
                  {r.hidden ? "Hidden" : "Visible"}
                </span>
                {r.affiliation && <span>{r.affiliation}</span>}
                {r.dining_hall && <span>· {r.dining_hall}</span>}
                <span>· {formatDate(r.created_at)}</span>
                <span>· {relativeTime(r.created_at)}</span>
                <span className="ml-auto tnum">
                  {r.report_count} report{r.report_count === 1 ? "" : "s"}
                </span>
              </header>

              <p className="text-ink whitespace-pre-wrap text-[1.0625rem] leading-relaxed mb-4">
                {r.body}
              </p>

              {r.image_paths && r.image_paths.length > 0 && (
                <div className="grid grid-cols-4 gap-2 max-w-md mb-4">
                  {r.image_paths.map((p) => {
                    const url = `${base}/storage/v1/object/public/testimony-images/${p}`;
                    return (
                      <a
                        key={p}
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="block aspect-square overflow-hidden rounded-md border border-rule bg-cream-200"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </a>
                    );
                  })}
                </div>
              )}

              <details className="mb-4">
                <summary className="text-sm font-medium text-ink cursor-pointer select-none">
                  Show {r.testimony_reports.length} individual report
                  {r.testimony_reports.length === 1 ? "" : "s"}
                </summary>
                <ul className="mt-3 space-y-2">
                  {r.testimony_reports.map((rep) => (
                    <li
                      key={rep.id}
                      className="border-l-2 border-rule pl-3 text-sm"
                    >
                      <div className="text-ink-muted text-xs mb-0.5">
                        {formatDate(rep.created_at)} —{" "}
                        <span className="font-medium text-ink">
                          {rep.reason}
                        </span>
                      </div>
                      {rep.note && (
                        <div className="text-ink-soft whitespace-pre-wrap">
                          {rep.note}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </details>

              {r.hidden_reason && (
                <div className="text-xs text-ink-muted mb-4">
                  Hidden reason: {r.hidden_reason}
                </div>
              )}

              <ModerationControls id={r.id} hidden={r.hidden} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
