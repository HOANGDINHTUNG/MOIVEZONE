import React from "react";
import type { DetailVideoItem } from "../pages/DetailsPage";

interface DetailsVideosSectionProps {
  mainTrailer: DetailVideoItem | null;
  extraVideos: DetailVideoItem[];
  onPlay: (video: DetailVideoItem) => void;
}

const badgeColorByType = (type: string) => {
  const t = type.toLowerCase();
  if (t === "trailer") return "bg-red-500/90 text-white";
  if (t === "teaser") return "bg-blue-500/90 text-white";
  return "bg-neutral-700 text-neutral-50";
};

const DetailsVideosSection: React.FC<DetailsVideosSectionProps> = ({
  mainTrailer,
  extraVideos,
  onPlay,
}) => {
  if (!mainTrailer && extraVideos.length === 0) return null;

  const allVideos = mainTrailer ? [mainTrailer, ...extraVideos] : extraVideos;

  return (
    <section
      aria-label="Videos"
      className="rounded-xl bg-neutral-900/60 p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
          Videos
        </h2>
        <span className="text-[11px] text-neutral-400">
          {allVideos.length} video
          {allVideos.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="-mx-3 overflow-x-auto px-3 pb-1">
        <div className="flex gap-3">
          {allVideos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => onPlay(video)}
              className="group flex w-60 shrink-0 flex-col overflow-hidden rounded-lg bg-neutral-800/80 text-left hover:bg-neutral-700/80"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                  alt={video.name}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/70">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/90 text-white shadow-lg shadow-red-500/40">
                    ▶
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeColorByType(
                      video.type
                    )}`}
                  >
                    {video.type}
                  </span>
                  <span className="rounded-full bg-neutral-900/70 px-2 py-0.5 text-[10px] text-neutral-300">
                    {video.site}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-xs font-semibold text-neutral-100 group-hover:text-white">
                  {video.name}
                </h3>
                <p className="text-[10px] text-neutral-400">
                  Published:{" "}
                  {new Date(video.published_at).toLocaleDateString("en-US")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailsVideosSection;
