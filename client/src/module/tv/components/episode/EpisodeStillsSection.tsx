import type { TMDBTvEpisodeStill } from "../../database/interface/tv_episode";

interface EpisodeStillsSectionProps {
  stills: TMDBTvEpisodeStill[];
}

const HIRES_BASE = "https://image.tmdb.org/t/p/original/";

const EpisodeStillsSection = ({ stills }: EpisodeStillsSectionProps) => {
  if (!stills.length) {
    return (
      <div
        className="
          rounded-2xl border border-white/10 
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Stills
        </p>
        <p className="text-[11px] text-slate-300">No images.</p>
      </div>
    );
  }

  const top = stills.slice(0, 9);

  return (
    <div
      className="
        rounded-2xl border border-white/10 
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-2xl
      "
    >
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
        Stills ({stills.length})
      </p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {top.map((s) => (
          <div
            key={s.file_path}
            className="
              group relative overflow-hidden rounded-xl 
              border border-white/10 bg-white/5
              shadow-md
              transition-shadow duration-300
              hover:-translate-y-0.5 hover:shadow-[0_0_18px_#22d3ee55]
            "
          >
            <img
              src={`${HIRES_BASE}${s.file_path}`}
              alt="Episode still"
              className="
                h-full w-full object-cover 
                transition-transform duration-300 group-hover:scale-105
              "
              loading="lazy"
            />

            {/* Overlay gradient khi hover */}
            <div
              className="
                pointer-events-none absolute inset-0 
                bg-linear-to-t from-black/85 via-black/20 to-transparent
                opacity-0 transition-opacity duration-300
                group-hover:opacity-100
              "
            />

            {/* Info bar */}
            <div className="pointer-events-none absolute bottom-1 left-1 right-1 flex items-center justify-between px-1">
              <span
                className="
                  rounded-full bg-black/70 px-2 py-0.5 text-[10px]
                  text-slate-100
                "
              >
                {s.iso_639_1 || "no lang"}
              </span>
              <span
                className="
                  rounded-full bg-black/70 px-2 py-0.5 text-[10px]
                  text-amber-300 shadow-[0_0_10px_#fbbf2444]
                "
              >
                ★ {s.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeStillsSection;
