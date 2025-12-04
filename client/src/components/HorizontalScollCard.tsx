import { useRef } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

import Card from "./common/Card";
import type {
  MediaType,
  TMDBMediaBase,
} from "../module/movies/database/interface/movieLists";

// Card dùng kiểu media base chung
type CardMovie = TMDBMediaBase;

interface HorizontalScrollCardProps {
  data?: CardMovie[];
  heading: string;
  trending?: boolean;
  media_type?: MediaType;
}

const HorizontalScollCard = ({
  data = [],
  heading,
  trending,
  media_type = "movie",
}: HorizontalScrollCardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleNext = () => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;

    containerRef.current.scrollBy({
      left: width * 0.9, // gần 1 “trang” → có đà
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;

    containerRef.current.scrollBy({
      left: -width * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <div className="container mx-auto px-2 sm:px-3 my-6 sm:my-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white capitalize">
          {heading}
        </h2>

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

        {/* Mobile arrows overlay */}
        <div className="md:hidden absolute inset-y-0 flex justify-between items-center px-1 pointer-events-none">
          <button
            onClick={handlePrevious}
            className="bg-white dark:bg-black/70 text-black dark:text-white p-1 rounded-full ml-1 pointer-events-auto
                       transition-all duration-200 hover:scale-110 hover:bg-linear-to-r hover:from-red-500 hover:to-yellow-400"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleNext}
            className="bg-white dark:bg-black/70 text-black dark:text-white p-1 rounded-full mr-1 pointer-events-auto
                       transition-all duration-200 hover:scale-110 hover:bg-linear-to-r hover:from-red-500 hover:to-yellow-400"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScollCard;
