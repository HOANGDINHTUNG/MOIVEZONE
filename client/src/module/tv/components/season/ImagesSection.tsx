import { useMemo } from "react";
import type { TMDBTvSeasonPoster } from "../../database/interface/tv_season";

interface ImagesSectionProps {
  posters: TMDBTvSeasonPoster[];
}

const ImagesSection = ({ posters }: ImagesSectionProps) => {
  // ======== HIGH RES BASE ========
  const hiResBase = useMemo(() => {
    return "https://image.tmdb.org/t/p/original/";
  }, []);

  if (!posters.length) {
    return (
      <div
        className="
          rounded-2xl border border-white/10
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Posters
        </p>
        <p className="text-[11px] text-slate-300">No posters.</p>
      </div>
    );
  }

  const topPosters = posters.slice(0, 9);

  return (
    <div
      className="
        rounded-2xl border border-white/10
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-2xl
      "
    >
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
        Posters ({posters.length})
      </p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {topPosters.map((p) => {
          const fullImage = `${hiResBase}${p.file_path}`;

          return (
            <div
              key={p.file_path}
              className="
                group relative overflow-hidden rounded-xl
                border border-white/10 bg-white/5
                transition-transform duration-300
                hover:-translate-y-1 hover:border-fuchsia-500/60 hover:shadow-[0_0_18px_#e879f955]
              "
            >
              <img
                src={fullImage}
                alt="Season poster"
                loading="lazy"
                className="
                  h-full w-full object-cover
                  transition-transform duration-300 group-hover:scale-105
                "
              />

              {/* Soft cinematic linear overlay */}
              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-linear-to-t from-black/80 via-black/20 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                "
              />

              {/* Bottom info chip group */}
              <div className="pointer-events-none absolute bottom-1 left-1 right-1 flex items-center justify-between px-1">
                <span
                  className="
                    rounded-full bg-black/70 px-2 py-0.5
                    text-[10px] text-slate-100
                  "
                >
                  {p.iso_639_1 || "no lang"}
                </span>

                <span
                  className="
                    rounded-full px-2 py-0.5 text-[10px]
                    bg-black/70 text-amber-300
                    shadow-[0_0_10px_#fbbf2444]
                  "
                >
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
