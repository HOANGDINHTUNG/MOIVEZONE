import { useMemo } from "react";
import type { TMDBTvSeasonPoster } from "../../database/interface/tv_season";

interface ImagesSectionProps {
  posters: TMDBTvSeasonPoster[];
}

const ImagesSection = ({ posters }: ImagesSectionProps) => {
  // ======== HIGH RES BASE giống logic bạn đã dùng ========
  const hiResBase = useMemo(() => {
    const fallback = "https://image.tmdb.org/t/p/original/";

    // không có config → xài fallback
    return fallback;
  }, []);

  if (!posters.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
          Posters
        </p>
        <p className="text-[11px] text-slate-400">No posters.</p>
      </div>
    );
  }

  const topPosters = posters.slice(0, 9);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
        Posters ({posters.length})
      </p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {topPosters.map((p) => {
          const fullImage = `${hiResBase}${p.file_path}`;

          return (
            <div
              key={p.file_path}
              className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 group"
            >
              <img
                src={fullImage}
                alt="Season poster"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between px-1">
                <span className="text-[10px] text-slate-200">
                  {p.iso_639_1 || "no lang"}
                </span>
                <span className="text-[10px] text-amber-300">
                  ★ {p.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagesSection;
