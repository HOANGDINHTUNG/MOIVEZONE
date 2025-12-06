import type { TMDBTvEpisodeStill } from "../../database/interface/tv_episode";

interface EpisodeStillsSectionProps {
  stills: TMDBTvEpisodeStill[];
}

const HIRES_BASE = "https://image.tmdb.org/t/p/original/";

const EpisodeStillsSection = ({ stills }: EpisodeStillsSectionProps) => {
  if (!stills.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Stills
        </p>
        <p className="text-[11px] text-slate-400">No images.</p>
      </div>
    );
  }

  const top = stills.slice(0, 9);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
        Stills ({stills.length})
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {top.map((s) => (
          <div
            key={s.file_path}
            className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
          >
            <img
              src={`${HIRES_BASE}${s.file_path}`}
              alt="Episode still"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="pointer-events-none absolute bottom-1 left-1 right-1 flex items-center justify-between px-1">
              <span className="text-[10px] text-slate-200">
                {s.iso_639_1 || "no lang"}
              </span>
              <span className="text-[10px] text-amber-300">
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
