import type { TMDBTvEpisodeChange } from "../../database/interface/tv_episode";

interface EpisodeChangesSectionProps {
  changeGroups: TMDBTvEpisodeChange[];
}

const EpisodeChangesSection = ({
  changeGroups,
}: EpisodeChangesSectionProps) => {
  if (!changeGroups.length) {
    return (
      <div
        className="
          rounded-2xl border border-white/10 
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Changes
        </p>
        <p className="text-[11px] text-slate-300">No recent changes.</p>
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
    <div
      className="
        mt-2 rounded-2xl border border-white/10 
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-2xl
      "
    >
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-violet-300/80">
        Changes ({flatItems.length})
      </p>

      <div className="
        max-h-64 space-y-2 overflow-y-auto 
        scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-slate-900
      ">
        {flatItems.map((c) => (
          <div
            key={c.id}
            className="
              flex gap-3 rounded-xl 
              bg-white/5 px-3 py-2 text-[11px]
              border border-white/10
              hover:border-fuchsia-500/70 hover:bg-fuchsia-500/10
              transition-transform duration-200
              hover:-translate-y-0.5
            "
          >
            {/* Accent bar */}
            <div className="
              mt-0.5 h-8 w-1.5 shrink-0 rounded-full 
              bg-linear-to-b from-fuchsia-500 via-violet-500 to-cyan-400
              shadow-[0_0_10px_#e879f955]
            " />

            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-50">
                  {c.key}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(c.time).toLocaleString()}
                </span>
              </div>

              <p className="text-slate-200">
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
