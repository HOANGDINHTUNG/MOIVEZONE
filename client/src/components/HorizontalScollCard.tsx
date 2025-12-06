// src/components/HorizontalScollCard.tsx

import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

import Card from "./common/Card";
import type {
  MediaType,
  TMDBMediaBase,
} from "../module/movies/database/interface/movieLists";

// import TMDBTimeWindow để dùng kiểu "day" | "week"
import type { TMDBTimeWindow } from "../module/trending/database/interface/trending";

type CardMovie = TMDBMediaBase;

interface HorizontalScrollCardProps {
  data?: CardMovie[];
  heading: string;
  headingTo?: string;
  trending?: boolean;
  media_type?: MediaType;
  showTimeToggle?: boolean;
  timeWindow?: TMDBTimeWindow;
  onTimeWindowChange?: (tw: TMDBTimeWindow) => void;
}

const HorizontalScollCard = ({
  data = [],
  heading,
  headingTo,
  trending,
  media_type = "movie",
  showTimeToggle = false,
  timeWindow, // có thể undefined -> sẽ dùng local state
  onTimeWindowChange,
}: HorizontalScrollCardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ===== scroll left / right =====
  const handleNext = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || 300;
    containerRef.current.scrollBy({ left: width * 0.9, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || 300;
    containerRef.current.scrollBy({ left: -width * 0.9, behavior: "smooth" });
  };

  // nếu cha KHÔNG truyền timeWindow -> dùng state local
  const [localTimeWindow, setLocalTimeWindow] = useState<TMDBTimeWindow>("day");

  // timeWindow thực tế để render UI
  const activeTimeWindow: TMDBTimeWindow = timeWindow ?? localTimeWindow;

  const todayRef = useRef<HTMLButtonElement | null>(null);
  const weekRef = useRef<HTMLButtonElement | null>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    width: number;
    left: number;
  }>({
    width: 0,
    left: 0,
  });

  // giống TrendingPage: khi đổi timeWindow -> cập nhật UI
  useLayoutEffect(() => {
    if (!showTimeToggle) return;

    const activeBtn =
      activeTimeWindow === "day" ? todayRef.current : weekRef.current;
    if (!activeBtn) return;

    const parent = activeBtn.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const rect = activeBtn.getBoundingClientRect();

    setIndicatorStyle({
      width: rect.width,
      left: rect.left - parentRect.left,
    });
  }, [activeTimeWindow, showTimeToggle]);

  // giống dispatch(setTimeWindow(tw)) bên TrendingPage
  const handleTimeWindowClick = (tw: TMDBTimeWindow) => {
    if (onTimeWindowChange) {
      onTimeWindowChange(tw); 
    } else {
      setLocalTimeWindow(tw); 
    }
  };

  const HeadingEl = (
    <span
      className="
        text-lg sm:text-xl lg:text-2xl font-bold capitalize
        text-neutral-900 dark:text-white
        transition-all duration-300
        hover:bg-linear-to-r hover:from-red-500 hover:via-orange-500 hover:to-yellow-400
        hover:bg-clip-text hover:text-transparent
        active:bg-linear-to-r active:from-red-500 active:via-orange-500 active:to-yellow-400
        active:bg-clip-text active:text-transparent
      "
    >
      {heading}
    </span>
  );

  return (
    <div className="container mx-auto px-2 sm:px-3 my-6 sm:my-10">
      <div className="flex items-center justify-between mb-3">
        {/* Heading / link heading + (option) time toggle */}
        <div className="flex items-center gap-3">
          {headingTo ? (
            <Link
              to={headingTo}
              className="inline-flex items-center"
              aria-label={`Go to ${heading}`}
            >
              {HeadingEl}
            </Link>
          ) : (
            <h2>{HeadingEl}</h2>
          )}

          {/* Today / This Week toggle – chỉ hiện khi showTimeToggle = true */}
          {showTimeToggle && (
            <div className="flex items-center">
              <div className="relative flex items-center gap-1 rounded-full bg-black/40 p-1 text-[11px] sm:text-xs md:text-sm">
                {/* Thanh highlight trượt mượt + gradient đỏ → vàng */}
                <div
                  className="absolute top-1 bottom-1 rounded-full bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 shadow-lg transition-all duration-300 ease-out"
                  style={{
                    width: indicatorStyle.width,
                    left: indicatorStyle.left,
                  }}
                />

                {/* TODAY BTN (day) */}
                <button
                  ref={todayRef}
                  type="button"
                  onClick={() => handleTimeWindowClick("day")}
                  className={`
                    relative z-10 rounded-full px-3 py-1 font-semibold transition-colors duration-300
                    ${
                      activeTimeWindow === "day"
                        ? "text-black"
                        : "text-neutral-200/80 hover:text-white"
                    }
                  `}
                >
                  Today
                </button>

                {/* THIS WEEK BTN (week) */}
                <button
                  ref={weekRef}
                  type="button"
                  onClick={() => handleTimeWindowClick("week")}
                  className={`
                    relative z-10 rounded-full px-3 py-1 font-semibold transition-colors duration-300
                    ${
                      activeTimeWindow === "week"
                        ? "text-black"
                        : "text-neutral-200/80 hover:text-white"
                    }
                  `}
                >
                  This Week
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nút scroll trái/phải (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="relative p-2 rounded-full bg-neutral-900 text-white shadow-md
                       overflow-hidden transition-all duration-200
                       hover:scale-110 hover:bg-linear-to-r hover:from-red-500 hover:to-yellow-400"
          >
            <FaAngleLeft className="text-lg" />
          </button>
          <button
            onClick={handleNext}
            className="relative p-2 rounded-full bg-neutral-900 text-white shadow-md
                       overflow-hidden transition-all duration-200
                       hover:scale-110 hover:bg-linear-to-r hover:from-red-500 hover:to-yellow-400"
          >
            <FaAngleRight className="text-lg" />
          </button>
        </div>
      </div>

      {/* List card */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2 scroll-smooth"
        >
          {data.map((item, index) => (
            <Card
              key={`${item.id}-${heading}`}
              data={item}
              trending={trending}
              index={index}
              media_type={media_type}
            />
          ))}
        </div>

        {/* Mobile arrows overlay (tạm ẩn) */}
        <div className="hidden absolute inset-y-0 justify-between items-center px-1 pointer-events-none" />
      </div>
    </div>
  );
};

export default HorizontalScollCard;
