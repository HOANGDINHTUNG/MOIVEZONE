// src/module/movies/components/MovieCard.tsx
import { useNavigate } from "react-router-dom";
import type { TMDBMovieListItem } from "../database/interface/movieLists";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: TMDBMovieListItem;
  onClick?: (movie: TMDBMovieListItem) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const navigate = useNavigate();

  const imagePath = movie.poster_path ?? movie.backdrop_path ?? null;
  const imageUrl = imagePath ? `${IMAGE_BASE}${imagePath}` : undefined;

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const handleClick = () => {
    if (onClick) return onClick(movie);
    navigate(`/movie/${movie.id}`);
  };

  const title = movie.title ?? "Untitled";

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        group relative flex h-full w-full flex-col overflow-hidden
        rounded-2xl bg-neutral-900/80 shadow-lg ring-1 ring-neutral-800
        transition duration-300
        hover:-translate-y-1 hover:bg-neutral-900 hover:shadow-2xl hover:ring-yellow-400/80
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950
      "
    >
      {/* IMAGE BLOCK */}
      <div className="relative w-full overflow-hidden bg-neutral-800 aspect-2/3 sm:aspect-2/3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] sm:text-xs text-neutral-400">
            No image
          </div>
        )}

        {/* overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* badge vote */}
        {typeof movie.vote_average === "number" && (
          <div className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-yellow-300 backdrop-blur">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      {/* TEXT BLOCK */}
      <div className="flex flex-1 flex-col gap-1 px-2.5 py-2.5 text-left sm:px-3">
        <h3
          className="
            line-clamp-2 text-xs sm:text-[13px] font-semibold text-neutral-50
            group-hover:text-yellow-300
          "
        >
          {title}
        </h3>

        <div className="mt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400">
          <span>{year}</span>
          <span className="rounded-full bg-neutral-800/80 px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wide text-neutral-300">
            Movie
          </span>
        </div>
      </div>
    </button>
  );
}
