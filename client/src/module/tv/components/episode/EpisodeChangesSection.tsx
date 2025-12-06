import type { TMDBTvEpisodeChange } from "../../database/interface/tv_episode";

interface EpisodeChangesSectionProps {
  changeGroups: TMDBTvEpisodeChange[];
}

const EpisodeChangesSection = ({
  changeGroups,
}: EpisodeChangesSectionProps) => {
  if (!changeGroups.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Changes
        </p>
        <p className="text-[11px] text-slate-400">No recent changes.</p>
      </div>
    );
  }

  const flatItems = changeGroups
    .flatMap((group) =>
      group.items.map((item) => ({
        key: group.key,
        ...item,
      }))
    )
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 15);

  return (
    <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
        Changes ({flatItems.length})
      </p>
      <div className="max-h-64 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {flatItems.map((c) => (
          <div
            key={c.id}
            className="flex gap-3 rounded-xl bg-slate-900/80 px-3 py-2 text-[11px]"
          >
            <div className="mt-0.5 h-4 w-1 shrink-0 rounded-full bg-sky-500/70" />
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-100">{c.key}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(c.time).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-300">
                {c.action} ·{" "}
                <span className="text-slate-400">
                  {JSON.stringify(c.value).slice(0, 80)}
                  {JSON.stringify(c.value).length > 80 ? "…" : ""}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeChangesSection;
