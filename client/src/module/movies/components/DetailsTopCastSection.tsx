import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Divider from "../../../components/common/ux/Divider";

// Gần giống TMDBMovieCast, chỉ lấy những field cần dùng
type CastItem = {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
};

type DetailsTopCastSectionProps = {
  starCast: CastItem[];
  imageURL: string;
};

const PAGE_SIZE = 20;

const DetailsTopCastSection: React.FC<DetailsTopCastSectionProps> = ({
  starCast,
  imageURL,
}) => {
  // 🧠 Hooks luôn ở top (không bị early return)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Không có cast thì thôi
  const sortedCast = useMemo(() => {
    if (!starCast?.length) return [];

    const withImage = starCast
      .filter((c) => !!c.profile_path)
      .sort((a, b) => a.order - b.order);

    const withoutImage = starCast
      .filter((c) => !c.profile_path)
      .sort((a, b) => a.order - b.order);

    return [...withImage, ...withoutImage];
  }, [starCast]);

  const visibleCast = useMemo(
    () => sortedCast.slice(0, visibleCount),
    [sortedCast, visibleCount]
  );

  if (!sortedCast.length) return null;

  const canLoadMore = visibleCount < sortedCast.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedCast.length));
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 260;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Divider />
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold md:text-base">Top Cast</h2>
          <p className="text-[11px] text-neutral-400">
            Đang hiển thị {visibleCast.length}/{sortedCast.length}
          </p>
        </div>

        <div className="relative">
          {/* Nút scroll trái/phải cho desktop */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="
              absolute left-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center
              rounded-full bg-black/60 text-lg text-white transition hover:bg-black/80
              md:flex
            "
            aria-label="Scroll left"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="
              absolute right-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center
              rounded-full bg-black/60 text-lg text-white transition hover:bg-black/80
              md:flex
            "
            aria-label="Scroll right"
          >
            ›
          </button>

          {/* List cast ngang */}
          <div
            ref={scrollRef}
            className="
              flex gap-3 overflow-x-auto scroll-smooth pb-2
            "
            style={{
              scrollbarWidth: "none", // Firefox ẩn scrollbar
            }}
          >
            {visibleCast.map((cast) => (
              <Link
                key={cast.cast_id ?? `${cast.credit_id}-${cast.id}`}
                to={
                  cast.credit_id
                    ? `/credits/${cast.credit_id}`
                    : `/person/${cast.id}`
                }
                className="group w-24 shrink-0"
              >
                <div className="mb-1 h-24 w-24 overflow-hidden rounded-lg bg-neutral-800 transition group-hover:ring-2 group-hover:ring-red-500/70">
                  {cast.profile_path ? (
                    <img
                      src={imageURL + cast.profile_path}
                      alt={cast.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                      No Image
                    </div>
                  )}
                </div>
                <p className="line-clamp-2 text-xs font-semibold group-hover:text-red-400">
                  {cast.name}
                </p>
                <p className="line-clamp-1 text-[11px] text-neutral-400">
                  {cast.character}
                </p>
                {cast.credit_id && (
                  <span className="mt-0.5 inline-flex items-center rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 transition group-hover:bg-red-600 group-hover:text-white">
                    View credit
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Nút load thêm 20 cast */}
        {canLoadMore && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="
                rounded-full border border-neutral-700 bg-neutral-800
                px-4 py-1.5 text-xs text-neutral-100 transition
                hover:bg-neutral-700 md:text-sm
              "
            >
              Xem thêm 20 cast
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailsTopCastSection;
