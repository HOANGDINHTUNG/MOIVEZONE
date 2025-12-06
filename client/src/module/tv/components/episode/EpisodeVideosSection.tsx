import type { TMDBTvEpisodeVideo } from "../../database/interface/tv_episode";

interface EpisodeVideosSectionProps {
  videos: TMDBTvEpisodeVideo[];
}

const EpisodeVideosSection = ({ videos }: EpisodeVideosSectionProps) => {
  if (!videos.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Videos
        </p>
        <p className="text-[11px] text-slate-400">No videos.</p>
      </div>
    );
  }

  const main =
    videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ||
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.find((v) => v.site === "YouTube") ||
    videos[0];

  const others = videos.filter((v) => v.id !== main.id).slice(0, 6);
  const isYouTube = main.site === "YouTube";

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">Videos</p>

      {isYouTube ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${main.key}`}
            title={main.name}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-300">
          Main video not from YouTube ({main.site}). Key: {main.key}
        </div>
      )}

      {!!others.length && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-slate-400">More videos</p>
          <div className="max-h-32 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            {others.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-lg bg-slate-900/80 px-2.5 py-1.5 text-[11px]"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-slate-100">
                    {v.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {v.type} · {v.site}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
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

export default EpisodeVideosSection;
