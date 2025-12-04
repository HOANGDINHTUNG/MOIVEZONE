import { memo } from "react";
import type { CardMediaType } from "./Card";

interface RatingBadgeProps {
  rating: number;
  voteCount: number;
}

const RatingBadge = memo(function RatingBadge({
  rating,
  voteCount,
}: RatingBadgeProps) {
  // màu theo rating
  const color =
    rating >= 8
      ? "bg-emerald-500/90 text-emerald-950"
      : rating >= 7
      ? "bg-amber-400/90 text-amber-950"
      : rating >= 5
      ? "bg-yellow-500/90 text-yellow-950"
      : "bg-red-500/90 text-red-50";

  return (
    <div className="flex items-center gap-1 rounded-full bg-neutral-950/60 px-1.5 py-1 text-[10px] shadow">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${color}`}
      >
        {rating.toFixed(1)}
      </span>
      <span className="text-[9px] text-neutral-300">
        {voteCount.toLocaleString()} votes
      </span>
    </div>
  );
});

interface TypeBadgeProps {
  type: CardMediaType;
}

const TypeBadge = memo(function TypeBadge({ type }: TypeBadgeProps) {
  const label = type === "movie" ? "Movie" : "TV";
  const color =
    type === "movie"
      ? "bg-blue-500/80 text-blue-50"
      : "bg-purple-500/80 text-purple-50";

  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide shadow ${color}`}
    >
      {label}
    </span>
  );
});

const CardBadges = {
  RatingBadge,
  TypeBadge,
};

export default CardBadges;
