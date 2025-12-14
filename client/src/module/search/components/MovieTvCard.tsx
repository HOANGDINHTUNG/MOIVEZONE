import type {
  TMDBSearchMovieItem,
  TMDBSearchTvItem,
  TMDBSearchMultiMovie,
  TMDBSearchMultiTv,
} from "../database/interface/search";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

// Union dùng chung cho tất cả kết quả movie/tv
export type MovieTvItem =
  | TMDBSearchMovieItem
  | TMDBSearchTvItem
  | TMDBSearchMultiMovie
  | TMDBSearchMultiTv;

interface MovieTvCardProps {
  item: MovieTvItem;
  onClick?: () => void;
}

function isMovie(
  item: MovieTvItem
): item is TMDBSearchMovieItem | TMDBSearchMultiMovie {
  // tất cả movie (cả /movie và /multi movie) đều có trường title
  return "title" in item;
}

export default function MovieTvCard({ item, onClick }: MovieTvCardProps) {
  const title = isMovie(item) ? item.title : item.name;
  const subTitle = isMovie(item)
    ? item.original_title
    : item.original_name ?? item.name;
  const date = isMovie(item) ? item.release_date : item.first_air_date;
  const vote =
    typeof item.vote_average === "number"
      ? item.vote_average.toFixed(1)
      : undefined;

  const posterPath = item.poster_path ?? item.backdrop_path ?? null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/85 shadow transition-all hover:-translate-y-1.5 hover:border-amber-400/80 hover:shadow-2xl hover:shadow-red-700/40"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        {posterPath ? (
          <img
            src={`${IMAGE_BASE}/w342${posterPath}`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-400">
            No image
          </div>
        )}
        {vote && (
          <div className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-semibold text-amber-300 shadow shadow-black/80">
            ★ {vote}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 text-left">
        <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-amber-300">
          {title}
        </h3>
        <p className="line-clamp-1 text-[11px] text-neutral-400">{subTitle}</p>
        <div className="mt-auto flex items-center justify-between text-[11px] text-neutral-400">
          <span>{date || "Unknown"}</span>
          <span className="rounded-full border border-red-600/60 bg-red-900/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-200">
            {isMovie(item) ? "Movie" : "TV"}
          </span>
        </div>
      </div>
    </button>
  );
}
