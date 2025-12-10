import type { TMDBTvSeasonVideo } from "../../database/interface/tv_season";

interface VideosSectionProps {
  videos: TMDBTvSeasonVideo[];
}

const VideosSection = ({ videos }: VideosSectionProps) => {
  if (!videos.length) {
    return (
      <div
        className="
          rounded-2xl border border-white/10
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Videos
        </p>
        <p className="text-[11px] text-slate-300">No videos.</p>
      </div>
    );
  }

  const main = videos.find((v) => v.type === "Trailer") || videos[0];
  const others = videos.filter((v) => v.id !== main.id).slice(0, 6);
  const isYouTube = main.site === "YouTube";

  return (
    <div
      className="
        space-y-3 rounded-2xl border border-white/10
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-2xl
      "
    >
      <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
        Videos
      </p>

      {/* MAIN VIDEO */}
      {isYouTube ? (
        <div
          className="
            relative aspect-video w-full overflow-hidden rounded-xl
            border border-fuchsia-500/60 bg-black/80
            shadow-[0_0_25px_#e879f933]
          "
        >
          <iframe
            src={`https://www.youtube.com/embed/${main.key}`}
            title={main.name}
            className="h-full w-full"
            allowFullScreen
          />
          <div
            className="
              pointer-events-none absolute inset-0
              bg-linear-to-t from-black/40 via-transparent to-transparent
            "
          />
        </div>
      ) : (
        <div
          className="
            rounded-xl border border-amber-400/70
            bg-amber-500/10 p-3 text-[11px] text-amber-100
            shadow-[0_0_14px_#fbbf2444]
          "
        >
          Main video not from YouTube ({main.site}). Key: {main.key}
        </div>
      )}

      {/* MORE VIDEOS */}
      {!!others.length && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-slate-300">More videos</p>

          <div
            className="
              max-h-32 space-y-1.5 overflow-y-auto
              scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-slate-900
            "
          >
            {others.map((v) => (
              <div
                key={v.id}
                className="
                  flex items-center justify-between rounded-lg
                  bg-white/5 px-2.5 py-1.5 text-[11px]
                  border border-white/10
                  hover:border-cyan-400/70 hover:bg-cyan-500/10
                  transition-transform duration-200
                  hover:-translate-y-0.5
                "
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-slate-50">
                    {v.name}
                  </span>
                  <span className="text-[10px] text-slate-300">
                    {v.type} · {v.site}
                  </span>
                </div>
                <span className="shrink-0 text-[10px] text-slate-400">
                  {new Date(v.published_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosSection;
