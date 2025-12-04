import { useMemo } from "react";
import type { TMDBPersonChangesResponse } from "../database/interface/person";

interface PersonChangesProps {
  changes?: TMDBPersonChangesResponse;
}

const PersonChanges = ({ changes }: PersonChangesProps) => {
  const recentChanges = useMemo(() => {
    if (!changes) return [];
    const flat = changes.changes.flatMap((c) =>
      c.items.map((item) => ({ key: c.key, ...item }))
    );
    return flat.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 8);
  }, [changes]);

  return (
    <section id="changes" className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight md:text-2xl">
          Changes
        </h2>
        <span className="text-xs text-neutral-400">
          Hiển thị {recentChanges.length} thay đổi gần nhất
        </span>
      </div>

      <div className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-sm">
        {recentChanges.length ? (
          recentChanges.map((change) => (
            <div
              key={`${change.key}-${change.id}-${change.time}`}
              className="flex flex-col gap-1 border-l border-neutral-700 pl-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  {change.key}
                </p>
                <p className="text-[11px] text-neutral-500">{change.time}</p>
              </div>
              <p className="text-xs text-neutral-200">
                {change.action} ·{" "}
                <span className="text-neutral-400">
                  {String(change.value).slice(0, 120)}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-400">
            TMDB không trả về lịch sử thay đổi cho người này.
          </p>
        )}
      </div>
    </section>
  );
};

export default PersonChanges;
