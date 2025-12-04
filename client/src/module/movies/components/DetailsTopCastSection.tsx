// src/module/movies/components/DetailsTopCastSection.tsx
import React, { useMemo, useRef, useState } from "react";
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
  cast_id?: number;
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
  // Hooks luôn ở top
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Sort: ưu tiên có hình, theo order
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
      <section className="mt-4">
        {/* Header: tên section + số lượng, responsive text */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-neutral-100 md:text-base">
            Top Cast
          </h2>
          <p className="text-[11px] text-neutral-400 md:text-xs">
            Đang hiển thị{" "}
            <span className="font-semibold text-neutral-100">
              {visibleCast.length}
            </span>
            /
            <span className="font-semibold text-neutral-100">
              {sortedCast.length}
            </span>
          </p>
        </div>

        <div className="relative">
          {/* Nút scroll trái/phải cho màn md trở lên */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="
              absolute left-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center
              rounded-full bg-black/60 text-lg text-white shadow-md shadow-black/60
              transition hover:bg-black/80 hover:scale-105
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
              rounded-full bg-black/60 text-lg text-white shadow-md shadow-black/60
              transition hover:bg-black/80 hover:scale-105
              md:flex
            "
            aria-label="Scroll right"
          >
            ›
          </button>

          {/* List cast ngang – responsive card size + ẩn scrollbar */}
          <div
            ref={scrollRef}
            className="
              -mx-1 flex gap-3 overflow-x-auto scroll-smooth pb-2
              sm:mx-0 sm:gap-4
              scrollbar-none
            "
            style={{
              scrollbarWidth: "none", // Firefox
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
                className="
                  group shrink-0
                  w-24
                  sm:w-28
                  md:w-32
                "
              >
                <div
                  className="
                    mb-1
                    h-24 w-24
                    sm:h-28 sm:w-28
                    md:h-32 md:w-32
                    overflow-hidden rounded-lg bg-neutral-800
                    shadow-md shadow-black/40
                    transition
                    group-hover:ring-2 group-hover:ring-red-500/70 group-hover:shadow-red-900/40
                  "
                >
                  {cast.profile_path ? (
                    <img
                      src={imageURL + cast.profile_path}
                      alt={cast.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                      No Image
                    </div>
                  )}
                </div>

                <p className="line-clamp-2 text-xs font-semibold text-neutral-100 group-hover:text-red-400 sm:text-[13px]">
                  {cast.name}
                </p>
                <p className="line-clamp-1 text-[11px] text-neutral-400 sm:text-xs">
                  {cast.character}
                </p>

                {cast.credit_id && (
                  <span
                    className="
                      mt-0.5 inline-flex items-center rounded-full
                      bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300
                      transition group-hover:bg-red-600 group-hover:text-white
                    "
                  >
                    View credit
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Nút load thêm 20 cast – full width trên mobile, nhỏ lại trên md+ */}
        {canLoadMore && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="
                w-full max-w-xs rounded-full border border-neutral-700 bg-neutral-800
                px-4 py-1.5 text-xs text-neutral-100 transition
                hover:bg-neutral-700 hover:border-neutral-500
                sm:text-sm
              "
            >
              Xem thêm 20 cast
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default DetailsTopCastSection;
