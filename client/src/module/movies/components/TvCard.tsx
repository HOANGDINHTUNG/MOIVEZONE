// src/module/movies/components/TvCard.tsx
import { useNavigate } from "react-router-dom";
import type { TMDBTvSummary } from "../database/interface/tvList";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface TvCardProps {
  tv: TMDBTvSummary;
  onClick?: (tv: TMDBTvSummary) => void;
}

export default function TvCard({ tv, onClick }: TvCardProps) {
  const navigate = useNavigate();

  const imageUrl =
    tv.poster_path || tv.backdrop_path
      ? `${IMAGE_BASE}${tv.poster_path ?? tv.backdrop_path}`
      : undefined;

  const year = tv.first_air_date
    ? new Date(tv.first_air_date).getFullYear()
    : "N/A";

  const handleClick = () => {
    if (onClick) return onClick(tv);
    // 👉 Điều hướng đến trang chi tiết TV
    navigate(`/tv/${tv.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-2xl bg-neutral-900/80 shadow-lg ring-1 ring-neutral-800
        transition duration-300
        hover:-translate-y-1 hover:bg-neutral-900 hover:shadow-2xl hover:ring-indigo-400/80
        w-full text-left
      "
    >
      {/* Ảnh */}
      <div className="relative w-full overflow-hidden bg-neutral-800 aspect-2/3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tv.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs sm:text-sm text-neutral-400">
            No image
          </div>
        )}

        {/* overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* badge vote */}
        <div className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 rounded-full bg-black/80 px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-[11px] font-semibold text-indigo-300 backdrop-blur">
          ★ {tv.vote_average.toFixed(1)}
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col gap-1 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <h3 className="line-clamp-2 text-[12px] sm:text-[13px] md:text-sm font-semibold text-neutral-50 group-hover:text-indigo-300">
          {tv.name}
        </h3>

        <div className="mt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400">
          <span>{year}</span>
          <span className="rounded-full bg-neutral-800/80 px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wide text-neutral-300">
            TV Show
          </span>
        </div>
      </div>
    </button>
  );
}
