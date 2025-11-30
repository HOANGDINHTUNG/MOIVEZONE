// src/pages/DetailsReviewsSection.tsx
import moment from "moment";
import Divider from "../../../components/common/ux/Divider";

type ReviewItem = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details?: { rating?: number | null };
};

type DetailsReviewsSectionProps = {
  reviews: ReviewItem[];
};

const DetailsReviewsSection: React.FC<DetailsReviewsSectionProps> = ({
  reviews,
}) => {
  if (!reviews.length) return null;

  return (
    <>
      <Divider />
      <div className="mt-4">
        <h2 className="font-semibold mb-2 text-sm md:text-base">Reviews</h2>
        <div className="space-y-3">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="p-3 rounded bg-neutral-100 dark:bg-neutral-800 text-sm"
            >
              <p className="font-semibold">
                {review.author}{" "}
                {review.author_details?.rating != null &&
                  `– ${review.author_details.rating}/10`}
              </p>
              <p className="text-xs text-neutral-500">
                {moment(review.created_at).format("YYYY-MM-DD")}
              </p>
              <p className="mt-1 line-clamp-4">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailsReviewsSection;
