// src/module/tvSeason/components/EpisodesList.tsx
import { useNavigate } from "react-router-dom";
import type { TMDBTvSeasonEpisode } from "../../database/interface/tv_season";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface EpisodesListProps {
  episodes: TMDBTvSeasonEpisode[];
  seriesId: number;
  seasonNumber: number;
}

const EpisodesList = ({
  episodes,
  seriesId,
  seasonNumber,
}: EpisodesListProps) => {
  const navigate = useNavigate();

  const handleEpisodeClick = (episodeNumber: number) => {
    navigate(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`);
  };

  if (!episodes.length) {
    return (
      <div
        className="
          rounded-2xl border border-white/10
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 text-sm text-slate-200
          backdrop-blur-md shadow-xl
        "
      >
        No episodes data.
      </div>
    );
  }

  return (
    <div
      className="
        rounded-2xl border border-white/10
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        backdrop-blur-xl shadow-2xl
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between border-b border-white/10
          px-4 py-3
        "
      >
        <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Episodes
        </p>
        <p className="text-[11px] text-slate-300">{episodes.length} total</p>
      </div>

      {/* List */}
      <div
        className="
          max-h-[460px] overflow-y-auto
          divide-y divide-white/10
          scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-slate-900
        "
      >
        {episodes.map((ep) => {
          const still = ep.still_path
            ? `${IMAGE_BASE}/w300${ep.still_path}`
            : null;
          const director = ep.crew.find((c) => c.job === "Director");

          return (
            <div
              key={ep.id}
              onClick={() => handleEpisodeClick(ep.episode_number)}
              className="
                flex cursor-pointer gap-3 px-4 py-3
                transition-transform duration-200
                hover:bg-white/5 hover:-translate-y-0.5
              "
            >
              {/* Thumbnail */}
              <div
                className="
                  w-24 shrink-0 overflow-hidden rounded-xl
                  border border-white/10 bg-slate-900/80
                "
              >
                {still ? (
                  <img
                    src={still}
                    alt={ep.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-video h-full w-full items-center justify-center text-[10px] text-slate-400">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1.5">
                {/* Top row: episode code + runtime */}
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-cyan-200">
                    E{ep.episode_number.toString().padStart(2, "0")}
                  </p>
                  <p className="text-xs text-slate-300">
                    {ep.runtime ? `${ep.runtime} min` : "—"}
                  </p>
                </div>

                {/* Title */}
                <p className="text-sm font-medium text-slate-50">
                  {ep.name || "Untitled episode"}
                </p>

                {/* Overview */}
                {ep.overview && (
                  <p className="line-clamp-2 text-[11px] text-slate-200/90">
                    {ep.overview}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                  {ep.air_date && (
                    <span
                      className="
                        rounded-full bg-slate-900/80 px-2 py-0.5
                        text-slate-200
                      "
                    >
                      {ep.air_date}
                    </span>
                  )}

                  {ep.vote_average ? (
                    <span
                      className="
                        rounded-full px-2 py-0.5 font-semibold
                        border border-amber-400/80
                        bg-linear-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25
                        text-amber-100 shadow-[0_0_10px_#fbbf2488]
                      "
                    >
                      ★ {ep.vote_average.toFixed(1)}
                    </span>
                  ) : null}

                  {director && (
                    <span
                      className="
                        rounded-full bg-fuchsia-500/15 px-2 py-0.5
                        text-fuchsia-100 border border-fuchsia-400/60
                      "
                    >
                      Dir. {director.name}
                    </span>
                  )}

                  {!!ep.guest_stars.length && (
                    <span
                      className="
                        rounded-full bg-violet-500/15 px-2 py-0.5
                        text-violet-100 border border-violet-400/60
                      "
                    >
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
