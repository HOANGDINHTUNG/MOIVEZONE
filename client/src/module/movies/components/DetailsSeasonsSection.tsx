import type { TMDBTvDetailsResponse } from "../database/interface/tv";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

type TvSeasonSummary = NonNullable<TMDBTvDetailsResponse["seasons"]>[number];

interface DetailsSeasonsSectionProps {
  seasons: TvSeasonSummary[];
  onSelectSeason: (seasonNumber: number) => void;
}

const DetailsSeasonsSection = ({ seasons, onSelectSeason }: DetailsSeasonsSectionProps) => {
  if (!seasons.length) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-base font-semibold text-amber-300">Seasons</h2>

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
              className="
                group flex gap-3 rounded-2xl border
                border-red-700/50 bg-black/60 
                p-2 text-left transition

                hover:border-amber-500 hover:bg-black/80
              "
            >
              {/* Poster */}
              <div className="w-16 shrink-0 overflow-hidden rounded-xl bg-black/40">
                {poster ? (
                  <img
                    src={poster}
                    alt={season.name}
                    className="
                      h-full w-full object-cover
                      transition-transform duration-300
                      group-hover:scale-105
                    "
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-amber-400/70">
                    No poster
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-amber-200">
                  {season.name || `Season ${season.season_number}`}
                </span>

                <span className="mt-0.5 text-[11px] text-amber-300/70">
                  {season.air_date ? new Date(season.air_date).getFullYear() : "—"} ·{" "}
                  {season.episode_count ?? 0} episodes
                </span>

                {season.overview && (
                  <p className="mt-1 line-clamp-2 text-[11px] text-amber-100/80">
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
