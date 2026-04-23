"use client";

import { useTransition } from "react";
import { deleteTestimony, hideTestimony, unhideTestimony } from "../actions";

export function ModerationControls({
  id,
  hidden,
}: {
  id: string;
  hidden: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {hidden ? (
        <form action={(fd) => startTransition(() => unhideTestimony(fd))}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={pending}
            className="text-sm rounded-none border border-rule px-3 py-1.5 text-ink hover:border-ink disabled:opacity-50"
          >
            Unhide
          </button>
        </form>
      ) : (
        <form action={(fd) => startTransition(() => hideTestimony(fd))}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="reason" value="manual review" />
          <button
            type="submit"
            disabled={pending}
            className="text-sm rounded-none bg-ink text-cream-50 px-3 py-1.5 hover:bg-accent disabled:opacity-50"
          >
            Hide
          </button>
        </form>
      )}

      <form
        action={(fd) => {
          if (
            !confirm(
              "Permanently delete this testimony and its images? This cannot be undone."
            )
          )
            return;
          startTransition(() => deleteTestimony(fd));
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={pending}
          className="text-sm rounded-none border border-accent/40 text-accent px-3 py-1.5 hover:bg-accent/10 disabled:opacity-50"
        >
          Delete permanently
        </button>
      </form>
    </div>
  );
}
