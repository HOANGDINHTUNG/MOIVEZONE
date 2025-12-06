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
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">Overview</p>

      {detail.overview ? (
        <p className="text-sm leading-relaxed text-slate-200">
          {detail.overview}
        </p>
      ) : (
        <p className="text-sm text-slate-400">No overview available.</p>
      )}

      <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-300">
        {director && (
          <span className="rounded-full bg-slate-900/80 px-3 py-1">
            Director: <span className="text-slate-50">{director.name}</span>
          </span>
        )}
        {writer && (
          <span className="rounded-full bg-slate-900/80 px-3 py-1">
            Writer: <span className="text-slate-50">{writer.name}</span>
          </span>
        )}
        {detail.production_code && (
          <span className="rounded-full bg-slate-900/80 px-3 py-1">
            Prod. code: {detail.production_code}
          </span>
        )}
      </div>
    </div>
  );
};

export default EpisodeOverview;
