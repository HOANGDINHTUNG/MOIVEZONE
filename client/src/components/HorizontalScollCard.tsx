// src/components/HorizontalScollCard.tsx

import { useRef } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

import type { MediaType } from "../module/movies/database/interface/tmdb";
import type {
  MovieSummary,
  MovieDetail,
} from "../module/movies/database/interface/movie";
import type {
  TvSummary,
  TvDetail,
} from "../module/movies/database/interface/tv";

import Card from "./common/Card";

// Dùng chung kiểu CardMovie đã định nghĩa trong Card.tsx
type CardMovie = MovieSummary | MovieDetail | TvSummary | TvDetail;

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
    if (containerRef.current) {
      containerRef.current.scrollLeft += 300;
    }
  };

  const handlePrevious = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 300;
    }
  };

  return (
    <div className="container mx-auto px-3 my-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white capitalize">
          {heading}
        </h2>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="bg-neutral-200 dark:bg-white text-neutral-900 p-1 rounded-full"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleNext}
            className="bg-neutral-200 dark:bg-white text-neutral-900 p-1 rounded-full"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex items-stretch gap-4 overflow-x-auto scrolbar-none pb-2"
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
        <div className="md:hidden absolute inset-y-0 flex justify-between items-center pointer-events-none">
          <button
            onClick={handlePrevious}
            className="bg-white dark:bg-black/70 text-black dark:text-white p-1 rounded-full ml-1 pointer-events-auto"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleNext}
            className="bg-white dark:bg-black/70 text-black dark:text-white p-1 rounded-full mr-1 pointer-events-auto"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScollCard;
