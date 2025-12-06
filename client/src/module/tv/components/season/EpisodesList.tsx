// src/module/tvSeason/components/EpisodesList.tsx
import { useNavigate } from "react-router-dom";
import type { TMDBTvSeasonEpisode } from "../../database/interface/tv_season";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface EpisodesListProps {
  episodes: TMDBTvSeasonEpisode[];
  seriesId: number;
  seasonNumber: number;
}

const EpisodesList = ({ episodes, seriesId, seasonNumber }: EpisodesListProps) => {
  const navigate = useNavigate();

  const handleEpisodeClick = (episodeNumber: number) => {
    navigate(
      `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`
    );
  };

  if (!episodes.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
        No episodes data.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Episodes
        </p>
        <p className="text-[11px] text-slate-400">{episodes.length} total</p>
      </div>

      <div className="max-h-[460px] divide-y divide-slate-800 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {episodes.map((ep) => {
          const still = ep.still_path
            ? `${IMAGE_BASE}/w300${ep.still_path}`
            : null;
          const director = ep.crew.find((c) => c.job === "Director");

          return (
            <div
              key={ep.id}
              onClick={() => handleEpisodeClick(ep.episode_number)}
              className="flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-slate-900/80"
            >
              <div className="w-24 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                {still ? (
                  <img
                    src={still}
                    alt={ep.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center text-[10px] text-slate-500">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-300">
                    E{ep.episode_number.toString().padStart(2, "0")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {ep.runtime ? `${ep.runtime} min` : "—"}
                  </p>
                </div>

                <p className="text-sm font-medium text-slate-50">
                  {ep.name || "Untitled episode"}
                </p>

                {ep.overview && (
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {ep.overview}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-slate-300">
                  {ep.air_date && (
                    <span className="rounded-full bg-slate-900/90 px-2 py-0.5">
                      {ep.air_date}
                    </span>
                  )}
                  {ep.vote_average ? (
                    <span className="rounded-full bg-emerald-500/80 px-2 py-0.5 font-semibold text-slate-950">
                      ★ {ep.vote_average.toFixed(1)}
                    </span>
                  ) : null}
                  {director && (
                    <span className="rounded-full bg-slate-900/90 px-2 py-0.5">
                      Dir. {director.name}
                    </span>
                  )}
                  {!!ep.guest_stars.length && (
                    <span className="rounded-full bg-slate-900/90 px-2 py-0.5">
                      Guest:{" "}
                      {ep.guest_stars
                        .slice(0, 2)
                        .map((g) => g.name)
                        .join(", ")}
                      {ep.guest_stars.length > 2 ? " +" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EpisodesList;
