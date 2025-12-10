import type { TMDBTvEpisodeAccountStates } from "../../database/interface/tv_episode";

interface EpisodeAccountStatesSectionProps {
  accountStates: TMDBTvEpisodeAccountStates | null;
}

const EpisodeAccountStatesSection = ({ accountStates }: EpisodeAccountStatesSectionProps) => {
  if (!accountStates) {
    return (
      <div
        className="
          rounded-2xl border border-white/10 
          bg-linear-to-br from-[#0c0c0f]/80 to-[#1a1a25]/70
          backdrop-blur-md p-4 shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-wide text-purple-300/70">
          My status
        </p>
        <p className="text-[11px] text-slate-300">
          Sign in to see your rating, favorites and watchlist.
        </p>
      </div>
    );
  }

  const ratedValue =
    typeof accountStates.rated === "object" ? accountStates.rated.value : null;

  return (
    <div
      className="
        space-y-3 rounded-2xl border border-white/10 
        bg-linear-to-br from-[#0d0d12]/80 to-[#1a1a23]/70
        backdrop-blur-lg p-4 shadow-2xl
      "
    >
      <p className="text-xs uppercase tracking-wide text-fuchsia-300/80">
        My status
      </p>

      <div className="flex flex-wrap gap-2 text-[11px]">

        {/* Favorite */}
        <span
          className={`
            rounded-full border px-3 py-1 transition
            ${
              accountStates.favorite
                ? "border-fuchsia-500/70 bg-linear-to-r from-fuchsia-600/30 to-pink-500/30 text-pink-200 shadow-[0_0_10px_#f472b633]"
                : "border-white/10 bg-white/5 text-slate-200"
            }
          `}
        >
          {accountStates.favorite ? "In favorites" : "Not favorite"}
        </span>

        {/* Watchlist */}
        <span
          className={`
            rounded-full border px-3 py-1 transition
            ${
              accountStates.watchlist
                ? "border-violet-500/70 bg-linear-to-r from-violet-600/30 to-purple-500/30 text-purple-200 shadow-[0_0_10px_#8b5cf633]"
                : "border-white/10 bg-white/5 text-slate-200"
            }
          `}
        >
          {accountStates.watchlist ? "In watchlist" : "Not in watchlist"}
        </span>

        {/* Rating */}
        {ratedValue !== null && (
          <span
            className="
              rounded-full border border-amber-400/70 
              bg-linear-to-r from-amber-500/20 to-yellow-400/20
              px-3 py-1 text-amber-200 shadow-[0_0_10px_#fbbf2444]
            "
          >
            Your rating: {ratedValue} / 10
          </span>
        )}
      </div>
    </div>
  );
};

export default EpisodeAccountStatesSection;
