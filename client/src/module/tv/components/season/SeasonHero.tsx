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
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
      )}

      {/* Cinematic overlay */}
      <div
        className="
          absolute inset-0 
          bg-linear-to-b from-[#020617]/95 via-black/92 to-black
        "
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-20 pb-10 md:pb-16">
        {/* Back button */}
        <button
          onClick={onBack}
          className="
            mb-6 inline-flex items-center gap-2 
            text-xs uppercase tracking-[0.18em]
            text-slate-300 hover:text-fuchsia-300
            transition-colors
          "
        >
          <span
            className="
              flex h-7 w-7 items-center justify-center rounded-full
              border border-white/25 bg-white/5 text-[10px]
              hover:border-fuchsia-400 hover:bg-fuchsia-500/15
              transition-colors
            "
          >
            ←
          </span>
          Back
        </button>

        <div className="grid items-start gap-6 md:grid-cols-[220px,1fr] lg:grid-cols-[260px,1fr]">
          {/* Poster + left info */}
          <div className="flex flex-col gap-4">
            {/* Poster */}
            <div
              className="
                overflow-hidden rounded-2xl 
                border border-white/12 bg-white/5
                shadow-[0_18px_45px_rgba(0,0,0,0.8)]
              "
            >
              {heroPoster ? (
                <img
                  src={heroPoster}
                  alt={detail?.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-2/3 items-center justify-center text-xs text-slate-400">
                  No poster
                </div>
              )}
            </div>

            {/* Info chips dưới poster */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              {detail?.air_date && (
                <span
                  className="
                    rounded-full px-3 py-1
                    border border-slate-500/70 bg-slate-900/80
                    text-slate-200
                  "
                >
                  {detail.air_date}
                </span>
              )}

              <span
                className="
                  rounded-full px-3 py-1
                  border border-violet-500/70 bg-violet-600/20
                  text-violet-100
                "
              >
                Season {detail?.season_number ?? seasonNumber}
              </span>

              {!!episodes.length && (
                <span
                  className="
                    rounded-full px-3 py-1
                    border border-cyan-400/70 bg-cyan-500/15
                    text-cyan-100
                  "
                >
                  {episodes.length} episodes
                </span>
              )}

              {detail?.vote_average ? (
                <span
                  className="
                    rounded-full px-3 py-1 font-semibold
                    border border-amber-400/80 
                    bg-linear-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25
                    text-amber-100 shadow-[0_0_16px_#fbbf2488]
                  "
                >
                  ★ {detail.vote_average.toFixed(1)}
                </span>
              ) : null}
            </div>

            {/* Networks */}
            {!!detail?.networks?.length && (
              <div
                className="
                  rounded-2xl border border-white/10 
                  bg-white/5 px-3 py-3
                  shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                "
              >
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                  Networks
                </p>
                <div className="flex flex-wrap gap-2">
                  {detail.networks.map((net) => (
                    <span
                      key={net.id}
                      className="
                        rounded-full bg-slate-900/80 px-3 py-1 
                        text-xs text-slate-100 border border-slate-600/70
                      "
                    >
                      {net.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Season info right side */}
          <div className="space-y-4">
            {/* Title */}
            <h1
              className="
                text-2xl font-semibold leading-tight md:text-3xl
                bg-linear-to-r from-fuchsia-300 via-sky-200 to-emerald-300
                bg-clip-text text-transparent
              "
            >
              {detail?.name || `Season ${seasonNumber}`}
            </h1>

            {/* Overview */}
            {detail?.overview && (
              <p className="text-sm leading-relaxed text-slate-200/90 md:text-[15px]">
                {detail.overview}
              </p>
            )}

            {/* Chips dưới overview */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              {detail?.vote_average && (
                <span
                  className="
                    rounded-full border border-emerald-400/80 
                    bg-emerald-500/15 px-3 py-1
                    text-emerald-100
                  "
                >
                  User score: {detail.vote_average.toFixed(1)} / 10
                </span>
              )}

              <span
                className="
                  rounded-full border border-slate-600/80
                  bg-slate-900/80 px-3 py-1 text-slate-200
                "
              >
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
