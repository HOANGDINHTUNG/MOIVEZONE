// src/module/movies/components/DetailsReviewsSection.tsx
import { Link } from "react-router-dom";

type ReviewItem = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details?: {
    rating?: number | null;
    username?: string;
    avatar_path?: string | null;
  };
};

interface DetailsReviewsSectionProps {
  reviews: ReviewItem[];
}

const DetailsReviewsSection = ({ reviews }: DetailsReviewsSectionProps) => {
  if (!reviews.length) {
    return (
      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-50 md:text-xl">
          Reviews
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Chưa có review nào cho nội dung này trên TMDB.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-50 md:text-xl">
          Reviews
        </h2>
        <span className="text-xs text-neutral-400">
          {reviews.length} review từ TMDB
        </span>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => {
          const rating = review.author_details?.rating ?? null;
          const createdDate = new Date(
            review.created_at
          ).toLocaleDateString();

          // cắt content cho gọn, full thì qua trang /review/:id xem
          const shortContent =
            review.content.length > 400
              ? review.content.slice(0, 400) + "..."
              : review.content;

          return (
            <article
              key={review.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 text-sm text-neutral-100 shadow-md shadow-black/30 md:p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Review by
                  </p>
                  <p className="text-sm font-semibold text-neutral-50">
                    {review.author}
                  </p>
                  {review.author_details?.username && (
                    <p className="text-xs text-neutral-400">
                      @{review.author_details.username}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {createdDate}
                  </p>
                </div>

                {rating !== null && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 border border-amber-400/70">
                      <span className="text-xs font-semibold text-amber-300">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wide text-neutral-400">
                      User Score
                    </span>
                  </div>
                )}
              </div>

              {/* Content excerpt */}
              <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-neutral-100">
                {shortContent}
              </p>

              {/* Footer: link sang trang review chi tiết */}
              <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                <Link
                  to={`/review/${review.id}`}
                  className="inline-flex items-center gap-1 text-amber-300 underline-offset-2 hover:text-amber-200 hover:underline"
                >
                  Xem chi tiết review
                  <span aria-hidden>→</span>
                </Link>

                <span className="text-[11px] text-neutral-500">
                  Review #{review.id}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default DetailsReviewsSection;
