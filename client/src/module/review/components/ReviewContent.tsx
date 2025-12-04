import type { TMDBReviewDetails } from "../database/interface/review";

interface ReviewContentProps {
  review?: TMDBReviewDetails | null;
}

const ReviewContent = ({ review }: ReviewContentProps) => {
  if (!review) {
    return null;
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-lg shadow-black/40 md:p-6">
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          Review content
        </p>

        <div className="mt-3 max-h-[65vh] overflow-y-auto pr-2 text-sm leading-relaxed text-neutral-100 scrollbar-none">
          {/* TMDB content thường có xuống dòng, giữ lại bằng whitespace-pre-line */}
          <p className="whitespace-pre-line">{review.content}</p>
        </div>
      </div>
    </section>
  );
};

export default ReviewContent;
