import { memo, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaStar } from "react-icons/fa";

import CardImage from "./CardImage";
import CardBadges from "./CardBadges";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

export type CardMediaType = "movie" | "tv";
export type CardVariant = "default" | "compact";

// Kiểu dữ liệu tối thiểu mà Card cần
export interface CardData {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
}

export interface CardProps {
  data: CardData; // CHÍNH Ở ĐÂY: nhận kiểu base, nên TMDBPersonCastCombined dùng được
  media_type?: CardMediaType; // nếu không truyền sẽ auto đoán
  onClick?: (item: CardData) => void;
  showOverview?: boolean;
  variant?: CardVariant;
  className?: string;
}

function resolveMediaType(
  data: CardData,
  media_type?: CardMediaType
): CardMediaType {
  if (media_type) return media_type;
  if (data.title || data.original_title) return "movie";
  return "tv";
}

function resolveTitle(data: CardData): string {
  if (data.title) return data.title;
  if (data.name) return data.name;
  if (data.original_title) return data.original_title;
  if (data.original_name) return data.original_name;
  return "Untitled";
}

function resolveYear(data: CardData): string {
  const date = data.release_date || data.first_air_date || "";
  return date ? date.slice(0, 4) : "----";
}

const Card = memo(function Card({
  data,
  media_type,
  onClick,
  showOverview = false,
  variant = "default",
  className = "",
}: CardProps) {
  const navigate = useNavigate();

  const type = resolveMediaType(data, media_type);
  const title = resolveTitle(data);
  const year = resolveYear(data);

  const posterPath = data.poster_path || data.backdrop_path;
  const posterUrl = posterPath
    ? `${IMAGE_BASE}/w342${posterPath}`
    : undefined;

  const rating = data.vote_average ?? 0;
  const voteCount = data.vote_count ?? 0;
  const popularity = data.popularity ?? 0;

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick(data);
    } else {
      navigate(`/${type}/${data.id}`);
    }
  };

  const isCompact = variant === "compact";

  return (
    <div
      onClick={handleClick}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/80 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-500 hover:bg-neutral-900/90 ${className}`}
    >
      {/* Poster */}
      <div className="relative w-full overflow-hidden">
        <CardImage src={posterUrl} alt={title} />

        {/* gradient overlay bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-neutral-950/90 via-transparent to-transparent" />

        {/* Play button hover */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950/80 backdrop-blur">
            <FaPlay className="ml-0.5 text-xs text-amber-300" />
          </div>
        </div>

        {/* Top badges (rating + type) */}
        <div className="absolute left-2 right-2 top-2 flex items-start justify-between gap-2">
          <CardBadges.RatingBadge rating={rating} voteCount={voteCount} />
          <CardBadges.TypeBadge type={type} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2 text-xs text-neutral-200 md:px-3.5 md:pb-3.5">
        {/* Title + year */}
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className={`truncate font-semibold text-neutral-50 ${
              isCompact ? "text-xs md:text-sm" : "text-sm md:text-base"
            }`}
            title={title}
          >
            {title}
          </h3>
          <span className="shrink-0 text-[10px] text-neutral-400">
            {year}
          </span>
        </div>

        {/* Overview */}
        {showOverview && data.overview && (
          <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-neutral-300">
            {data.overview}
          </p>
        )}

        {/* Footer meta */}
        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-neutral-400">
          <div className="flex items-center gap-1">
            <FaStar className="text-[10px] text-amber-400" />
            <span className="font-medium text-neutral-100">
              {rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-neutral-500">
              ({voteCount.toLocaleString()})
            </span>
          </div>

          <span className="rounded-full bg-neutral-800/80 px-2 py-0.5">
            Pop {popularity.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default Card;
