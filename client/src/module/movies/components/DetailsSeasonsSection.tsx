import type { TMDBTvDetailsResponse } from "../database/interface/tv";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

type TvSeasonSummary = NonNullable<TMDBTvDetailsResponse["seasons"]>[number];

interface DetailsSeasonsSectionProps {
  seasons: TvSeasonSummary[];
  onSelectSeason: (seasonNumber: number) => void;
}

const DetailsSeasonsSection = ({
  seasons,
  onSelectSeason,
}: DetailsSeasonsSectionProps) => {
  if (!seasons.length) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-base font-semibold text-white">Seasons</h2>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {seasons.map((season) => {
          const poster = season.poster_path
            ? `${IMAGE_BASE}/w185${season.poster_path}`
            : null;

          return (
            <button
              key={season.id}
              type="button"
              onClick={() => onSelectSeason(season.season_number)}
              className="group flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-2 text-left transition hover:border-sky-500/70 hover:bg-slate-900"
            >
              <div className="w-16 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                {poster ? (
                  <img
                    src={poster}
                    alt={season.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                    No poster
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-slate-50">
                  {season.name || `Season ${season.season_number}`}
                </span>
                <span className="mt-0.5 text-[11px] text-slate-400">
                  {season.air_date
                    ? new Date(season.air_date).getFullYear()
                    : "—"}{" "}
                  · {season.episode_count ?? 0} episodes
                </span>
                {season.overview && (
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-300">
                    {season.overview}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default DetailsSeasonsSection;
