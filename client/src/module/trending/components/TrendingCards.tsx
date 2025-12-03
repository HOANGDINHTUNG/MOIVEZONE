import type {
  TMDBTrendingMovieItem,
  TMDBTrendingTvItem,
  TMDBTrendingPersonItem,
} from "../database/interface/trending";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface BaseCardProps {
  onClick?: () => void;
}

type MovieOrTv = TMDBTrendingMovieItem | TMDBTrendingTvItem;

function isMovie(item: MovieOrTv): item is TMDBTrendingMovieItem {
  return (item as TMDBTrendingMovieItem).media_type === "movie";
}

export const MovieTvCard = ({
  item,
  onClick,
}: BaseCardProps & { item: MovieOrTv }) => {
  const title = isMovie(item) ? item.title : item.name;
  const date = isMovie(item) ? item.release_date : item.first_air_date;
  const poster = item.poster_path
    ? `${IMAGE_BASE}/w342${item.poster_path}`
    : item.backdrop_path
    ? `${IMAGE_BASE}/w342${item.backdrop_path}`
    : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl bg-neutral-900/80 ring-1 ring-neutral-800/80 hover:ring-[#ecad29] transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-900/95"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-400">
            No Image
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent" />
        <div className="absolute left-2 top-2 rounded-full bg-neutral-950/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-200 backdrop-blur">
          {isMovie(item) ? "Movie" : "TV Show"}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-neutral-950/80 px-2 py-0.5 text-[10px] text-neutral-100 backdrop-blur">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#ecad29]" />
          <span>{item.vote_average.toFixed(1)}</span>
          <span className="text-[9px] text-neutral-400">
            /10 &bull; {item.vote_count} votes
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 py-3 text-left">
        <h3 className="line-clamp-1 text-[13px] font-semibold text-neutral-50 group-hover:text-[#ecad29]">
          {title}
        </h3>
        <p className="text-[11px] text-neutral-400">{date || "Updating..."}</p>
        <p className="mt-1 line-clamp-2 text-[11px] text-neutral-300/90">
          {item.overview || "No overview yet."}
        </p>
      </div>
    </button>
  );
};

export const PersonCard = ({
  item,
  onClick,
}: BaseCardProps & { item: TMDBTrendingPersonItem }) => {
  const profile = item.profile_path
    ? `${IMAGE_BASE}/w342${item.profile_path}`
    : undefined;

  const knownForText =
    item.known_for?.map((k) => ("title" in k ? k.title : k.name)).join(", ") ||
    "Updating...";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl bg-linear-to-b from-neutral-900/90 to-neutral-950 ring-1 ring-neutral-800/70 hover:ring-[#ecad29] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden">
        {profile ? (
          <img
            src={profile}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-400">
            No Image
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-neutral-950/90 via-transparent to-transparent" />
        <div className="absolute left-2 top-2 rounded-full bg-neutral-950/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-200 backdrop-blur">
          Person
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-neutral-950/80 px-2 py-0.5 text-[10px] text-neutral-100 backdrop-blur">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
          <span>Pop {item.popularity.toFixed(0)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 py-3 text-left">
        <h3 className="line-clamp-1 text-[13px] font-semibold text-neutral-50 group-hover:text-[#ecad29]">
          {item.name}
        </h3>
        <p className="text-[11px] text-neutral-400">
          {item.known_for_department || "Talent"}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] text-neutral-300/90">
          {knownForText}
        </p>
      </div>
    </button>
  );
};
