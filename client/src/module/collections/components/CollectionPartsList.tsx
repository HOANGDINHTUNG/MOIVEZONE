// src/module/collections/components/CollectionPartsList.tsx

import { Link } from "react-router-dom";
import moment from "moment";
import type { TMDBCollectionPart } from "../database/interface/collection";

interface CollectionPartsListProps {
  parts: TMDBCollectionPart[];
  imageBaseUrl: string;
}

const CollectionPartsList = ({
  parts,
  imageBaseUrl,
}: CollectionPartsListProps) => {
  const sorted = [...parts].sort((a, b) =>
    (a.release_date || "").localeCompare(b.release_date || "")
  );

  if (!sorted.length) {
    return (
      <div className="text-sm text-neutral-400">
        Chưa có thông tin phim trong bộ sưu tập này.
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-white">
        Danh sách phim trong bộ sưu tập
      </h2>

      <div className="space-y-3">
        {sorted.map((part, index) => {
          const date = part.release_date
            ? moment(part.release_date).format("DD/MM/YYYY")
            : "Chưa rõ ngày phát hành";

          const poster = part.poster_path || part.backdrop_path;

          return (
            <Link
              key={part.id}
              to={`/movie/${part.id}`}
              className="flex gap-4 items-center bg-neutral-900/70 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-neutral-700 rounded-xl p-3 transition-colors"
            >
              {/* STT */}
              <div className="w-8 text-center text-sm text-neutral-400">
                #{index + 1}
              </div>

              {/* Poster */}
              <div className="w-16 h-24 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                {poster ? (
                  <img
                    src={imageBaseUrl + poster}
                    alt={part.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                  {part.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{date}</p>
                {part.overview && (
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                    {part.overview}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="hidden sm:flex flex-col items-end text-xs text-neutral-300">
                <span className="text-neutral-400">Điểm TMDB</span>
                <span className="text-sm font-semibold text-yellow-400">
                  {part.vote_average?.toFixed(1) ?? "–"}
                </span>
                <span className="text-[10px] text-neutral-500">
                  {part.vote_count} votes
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CollectionPartsList;
