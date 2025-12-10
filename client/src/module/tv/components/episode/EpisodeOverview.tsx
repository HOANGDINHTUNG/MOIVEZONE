import type { TMDBTvEpisodeDetailsWithAppend } from "../../store/tvEpisodeSlice";

interface EpisodeOverviewProps {
  detail: TMDBTvEpisodeDetailsWithAppend;
}

const EpisodeOverview = ({ detail }: EpisodeOverviewProps) => {
  const director = detail.crew.find((c) => c.job === "Director");
  const writer =
    detail.crew.find((c) => c.job === "Writer") ||
    detail.crew.find((c) => c.job === "Screenplay");

  return (
    <div
      className="
        space-y-3 rounded-2xl border border-white/10 
        bg-linear-to-br from-[#080a12]/90 via-[#0b0d15]/90 to-black/90
        p-4 md:p-5 backdrop-blur-xl shadow-2xl
      "
    >
      {/* OVERVIEW HEADER */}
      <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
        Overview
      </p>

      {/* OVERVIEW TEXT */}
      {detail.overview ? (
        <p className="text-sm leading-relaxed text-slate-200/90">
          {detail.overview}
        </p>
      ) : (
        <p className="text-sm text-slate-400">No overview available.</p>
      )}

      {/* BADGES */}
      <div className="flex flex-wrap gap-3 pt-1 text-[11px]">
        {director && (
          <span
            className="
              rounded-full px-3 py-1
              border border-fuchsia-400/60 bg-fuchsia-500/10 text-fuchsia-100
              shadow-[0_0_8px_#e879f955]
            "
          >
            Director: <span className="font-semibold">{director.name}</span>
          </span>
        )}

        {writer && (
          <span
            className="
              rounded-full px-3 py-1
              border border-cyan-400/60 bg-cyan-500/10 text-cyan-100
              shadow-[0_0_8px_#22d3ee55]
            "
          >
            Writer: <span className="font-semibold">{writer.name}</span>
          </span>
        )}

        {detail.production_code && (
          <span
            className="
              rounded-full px-3 py-1
              border border-violet-400/60 bg-violet-500/10 text-violet-100
              shadow-[0_0_8px_#8b5cf655]
            "
          >
            Prod. code: {detail.production_code}
          </span>
        )}
      </div>
    </div>
  );
};

export default EpisodeOverview;
