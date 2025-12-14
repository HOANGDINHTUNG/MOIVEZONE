import type { TMDBTvEpisodeDetailsWithAppend } from "../../store/tvEpisodeSlice";

interface EpisodeHeroProps {
  detail: TMDBTvEpisodeDetailsWithAppend;
  heroStill: string | null;
  onBack: () => void;
  seriesId: number;
  seasonNumber: number;
}

const EpisodeHero = ({
  detail,
  heroStill,
  onBack,
  seriesId,
}: EpisodeHeroProps) => {
  const episodeCode = `S${detail.season_number
    .toString()
    .padStart(2, "0")} · E${detail.episode_number.toString().padStart(2, "0")}`;

  return (
    <div className="relative w-full">
      {heroStill && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${heroStill})` }}
        />
      )}

      {/* Overlay gradient cinematic */}
      <div
        className="
          absolute inset-0 
          bg-linear-to-b from-[#020617]/90 via-black/92 to-black
        "
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-20 pb-10 md:pb-16">
        {/* Back button */}
        <button
          onClick={onBack}
          className="
            mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em]
            text-slate-300 hover:text-fuchsia-300
            transition-colors
          "
        >
          <span
            className="
              flex h-7 w-7 items-center justify-center rounded-full
              border border-white/20 bg-white/5 text-[10px]
              hover:border-fuchsia-400 hover:bg-fuchsia-500/15
              transition-colors
            "
          >
            ←
          </span>
          Back
        </button>

        <div className="max-w-3xl space-y-3">
          {/* Tiny label */}
          <p className="text-[11px] uppercase tracking-[0.22em] text-fuchsia-300/80">
            TV Episode · Show #{seriesId}
          </p>

          {/* Title with gradient text */}
          <h1
            className="
              text-2xl md:text-3xl font-semibold leading-tight
              bg-linear-to-r from-fuchsia-300 via-sky-200 to-emerald-300
              bg-clip-text text-transparent
            "
          >
            {detail.name || "Untitled Episode"}
          </h1>

          {/* Episode code */}
          <p className="text-[13px] uppercase tracking-wide text-slate-200/90">
            {episodeCode}
          </p>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            {detail.air_date && (
              <span
                className="
                  rounded-full border px-3 py-1
                  border-fuchsia-400/70 bg-fuchsia-500/15 text-fuchsia-100
                  shadow-[0_0_12px_#e879f933]
                "
              >
                Air date: {detail.air_date}
              </span>
            )}

            {detail.runtime ? (
              <span
                className="
                  rounded-full border px-3 py-1
                  border-cyan-400/80 bg-cyan-500/15 text-cyan-100
                  shadow-[0_0_12px_#22d3ee44]
                "
              >
                {detail.runtime} min
              </span>
            ) : null}

            <span
              className="
                rounded-full border px-3 py-1
                border-violet-500/70 bg-violet-500/15 text-violet-100
                shadow-[0_0_12px_#8b5cf644]
              "
            >
              Season {detail.season_number}
            </span>

            <span
              className="
                rounded-full border px-3 py-1
                border-amber-400/80 
                bg-linear-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25
                text-amber-100
                shadow-[0_0_16px_#fbbf2488]
              "
            >
              ★ {detail.vote_average.toFixed(1)} ({detail.vote_count} votes)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeHero;
