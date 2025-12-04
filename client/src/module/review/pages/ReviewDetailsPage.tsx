import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import { fetchReviewById } from "../store/reviewSlice";
import ReviewHero from "../components/ReviewHero";
import ReviewContent from "../components/ReviewContent";

const ReviewDetailsPage = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);

  const { data, status, error } = useAppSelector((state) => state.review);

  useEffect(() => {
    if (reviewId) {
      dispatch(fetchReviewById({ reviewId, language }));
    }
  }, [dispatch, reviewId, language]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <ReviewHero review={data} />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-4">
        {/* Loading / error */}
        {status === "loading" && (
          <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 text-sm text-neutral-300">
            Đang tải review...
          </div>
        )}
        {status === "failed" && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/80 p-4 text-sm text-red-200">
            Lỗi tải review: {error}
          </div>
        )}

        {/* Nội dung review */}
        <ReviewContent review={data} />

        {/* Back link nhỏ */}
        <div className="mt-6 flex justify-end text-xs">
          <Link
            to={
              data?.media_type === "tv"
                ? `/tv/${data.media_id}`
                : `/movie/${data?.media_id ?? ""}`
            }
            className="text-neutral-400 underline-offset-2 hover:text-neutral-200 hover:underline"
          >
            ← Quay lại {data?.media_type === "tv" ? "TV Show" : "phim"}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ReviewDetailsPage;
