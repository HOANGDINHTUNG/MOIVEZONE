import { useMemo } from "react";
import type {
  TMDBTvSeasonDetail,
  TMDBTvSeasonEpisode,
} from "../../database/interface/tv_season";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface SeasonHeroProps {
  detail: TMDBTvSeasonDetail | null;
  episodes: TMDBTvSeasonEpisode[];
  onBack: () => void;
  seasonNumber: string;
}

const SeasonHero = ({
  detail,
  episodes,
  onBack,
  seasonNumber,
}: SeasonHeroProps) => {
  const heroPoster = useMemo(() => {
    if (!detail?.poster_path) return null;
    return `${IMAGE_BASE}/w500${detail.poster_path}`;
  }, [detail]);

  const heroBg = useMemo(() => {
    if (!detail?.poster_path) return null;
    return `${IMAGE_BASE}/w780${detail.poster_path}`;
  }, [detail]);

  return (
    <div className="relative w-full">
      {heroBg && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-10 md:pb-16">
        <button
          onClick={onBack}
          className="mb-6 text-xs uppercase tracking-wide text-slate-300 hover:text-white flex items-center gap-2"
        >
          <span className="h-6 w-6 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
            ←
          </span>
          Back
        </button>

        <div className="grid gap-6 md:grid-cols-[220px,1fr] lg:grid-cols-[260px,1fr] items-start">
          {/* Poster */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
              {heroPoster ? (
                <img
                  src={heroPoster}
                  alt={detail?.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-2/3 flex items-center justify-center text-xs text-slate-500">
                  No poster
                </div>
              )}
            </div>

            {/* Info chips dưới poster */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              {detail?.air_date && (
                <span className="rounded-full bg-slate-800/80 px-3 py-1">
                  {detail.air_date}
                </span>
              )}
              <span className="rounded-full bg-slate-800/80 px-3 py-1">
                Season {detail?.season_number ?? seasonNumber}
              </span>
              {!!episodes.length && (
                <span className="rounded-full bg-slate-800/80 px-3 py-1">
                  {episodes.length} episodes
                </span>
              )}
              {detail?.vote_average ? (
                <span className="rounded-full bg-emerald-500/90 px-3 py-1 font-semibold">
                  ★ {detail.vote_average.toFixed(1)}
                </span>
              ) : null}
            </div>

            {/* Networks */}
            {!!detail?.networks?.length && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">
                  Networks
                </p>
                <div className="flex flex-wrap gap-2">
                  {detail.networks.map((net) => (
                    <span
                      key={net.id}
                      className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-100"
                    >
                      {net.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Season info */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
              {detail?.name || `Season ${seasonNumber}`}
            </h1>

            {detail?.overview && (
              <p className="text-sm md:text-[15px] text-slate-200/90 leading-relaxed">
                {detail.overview}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              {detail?.vote_average && (
                <span className="rounded-full bg-slate-900/90 border border-emerald-500/50 px-3 py-1">
                  User score: {detail.vote_average.toFixed(1)} / 10
                </span>
              )}
              <span className="rounded-full bg-slate-900/90 border border-slate-700 px-3 py-1">
                Season ID: {detail?.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonHero;
