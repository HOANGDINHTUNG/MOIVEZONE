import type { TMDBTvEpisodeDetailsWithAppend } from "../../store/tvEpisodeSlice";

interface EpisodeHeroProps {
  detail: TMDBTvEpisodeDetailsWithAppend;
  heroStill: string | null;
  onBack: () => void;
  seriesId: number;
  seasonNumber: number;
}

const EpisodeHero = ({
  detail,
  heroStill,
  onBack,
  seriesId,
}: EpisodeHeroProps) => {
  const episodeCode = `S${detail.season_number
    .toString()
    .padStart(2, "0")} · E${detail.episode_number.toString().padStart(2, "0")}`;

  return (
    <div className="relative w-full">
      {heroStill && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroStill})` }}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-20 pb-10 md:pb-16">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300 hover:text-white"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-[10px]">
            ←
          </span>
          Back
        </button>

        <div className="max-w-3xl space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">
            TV Episode · Show #{seriesId}
          </p>

          <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
            {detail.name || "Untitled Episode"}
          </h1>

          <p className="text-[13px] uppercase tracking-wide text-slate-300">
            {episodeCode}
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-slate-200">
            {detail.air_date && (
              <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
                Air date: {detail.air_date}
              </span>
            )}
            {detail.runtime ? (
              <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
                {detail.runtime} min
              </span>
            ) : null}
            <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
              Season {detail.season_number}
            </span>
            <span className="rounded-full border border-emerald-500/50 bg-slate-900/80 px-3 py-1">
              ★ {detail.vote_average.toFixed(1)} ({detail.vote_count} votes)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeHero;
