// src/module/reviews/components/ReviewHero.tsx
import { Link } from "react-router-dom";
import type { TMDBReviewDetails } from "../database/interface/review";

const AVATAR_BASE = "https://image.tmdb.org/t/p/w185";

interface ReviewHeroProps {
  review?: TMDBReviewDetails | null;
}

function getAvatarUrl(avatarPath: string | null): string | null {
  if (!avatarPath) return null;

  if (avatarPath.startsWith("/https://") || avatarPath.startsWith("/http://")) {
    return avatarPath.slice(1);
  }
  if (avatarPath.startsWith("https://") || avatarPath.startsWith("http://")) {
    return avatarPath;
  }
  return `${AVATAR_BASE}${avatarPath}`;
}

const ReviewHero = ({ review }: ReviewHeroProps) => {
  const author = review?.author_details;
  const avatarUrl = getAvatarUrl(author?.avatar_path ?? null);

  const createdDate = review
    ? new Date(review.created_at).toLocaleDateString()
    : "";
  const updatedDate = review
    ? new Date(review.updated_at).toLocaleDateString()
    : "";

  const isEdited = review && review.created_at !== review.updated_at;

  const rating = author?.rating ?? null;
  const ratingPercent = rating !== null ? (rating / 10) * 100 : null;

  const mediaTypeLabel =
    review?.media_type === "tv"
      ? "TV Show"
      : review?.media_type === "movie"
      ? "Movie"
      : review?.media_type ?? "Unknown";

  return (
    <section className="relative border-b border-neutral-900 bg-linear-to-b from-neutral-900 via-neutral-950 to-neutral-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-10 pt-20 md:flex-row md:items-center md:pb-14 md:pt-24">
        {/* Avatar + rating */}
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-5">
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-neutral-800 bg-neutral-900 shadow-lg shadow-black/50 md:h-24 md:w-24">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={author?.username ?? review?.author ?? "Author"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                  No Avatar
                </div>
              )}
            </div>
            <div className="flex flex-col md:hidden">
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Review by
              </p>
              <p className="text-base font-semibold text-neutral-50">
                {author?.name ||
                  review?.author ||
                  author?.username ||
                  "Unknown"}
              </p>
              {author?.username && (
                <p className="text-xs text-neutral-400">@{author.username}</p>
              )}
            </div>
          </div>

          {/* Rating circle */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900/80 shadow-inner shadow-black/70 md:h-20 md:w-20">
              <div className="absolute inset-1 rounded-full bg-neutral-950" />
              <div className="relative flex h-full w-full items-center justify-center rounded-full border border-neutral-700/80">
                {ratingPercent !== null ? (
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900">
                    <span className="text-xs font-semibold text-amber-300 md:text-sm">
                      {rating?.toFixed(1)}
                    </span>
                    <span className="absolute inset-0 rounded-full border-2 border-amber-400/60" />
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-500">
                    No rating
                  </span>
                )}
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-wide text-neutral-400">
              User Score
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="md:flex-1">
          <div className="hidden md:flex md:flex-col">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Review by
            </p>
            <p className="text-lg font-semibold text-neutral-50 md:text-xl">
              {author?.name || review?.author || author?.username || "Unknown"}
            </p>
            {author?.username && (
              <p className="text-xs text-neutral-400">@{author.username}</p>
            )}
          </div>

          {/* Media title */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] uppercase tracking-wide text-neutral-300">
              {mediaTypeLabel}
            </span>
            {review?.media_title && (
              <h1 className="text-xl font-semibold tracking-tight text-neutral-50 md:text-2xl">
                {review.media_title}
              </h1>
            )}
          </div>

          {/* Dates */}
          {review && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
              <span>
                Viết ngày{" "}
                <span className="text-neutral-200">{createdDate}</span>
              </span>
              {isEdited && (
                <span>
                  · Chỉnh sửa lần cuối{" "}
                  <span className="text-neutral-200">{updatedDate}</span>
                </span>
              )}
              {review.iso_639_1 && (
                <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px]">
                  Lang: {review.iso_639_1.toUpperCase()}
                </span>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {review && (
              <>
                {/* Link tới TMDB */}
                <a
                  href={review.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-500/60 bg-sky-500/10 px-4 py-2 font-medium text-sky-200 transition-colors hover:bg-sky-500/20"
                >
                  Xem trên TMDB
                </a>

                {/* Link về movie / tv trong app */}
                {review.media_type === "movie" && (
                  <Link
                    to={`/movie/${review.media_id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 font-medium text-neutral-100 transition-colors hover:bg-neutral-800"
                  >
                    ← Xem chi tiết phim
                  </Link>
                )}
                {review.media_type === "tv" && (
                  <Link
                    to={`/tv/${review.media_id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 font-medium text-neutral-100 transition-colors hover:bg-neutral-800"
                  >
                    ← Xem chi tiết TV Show
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewHero;
