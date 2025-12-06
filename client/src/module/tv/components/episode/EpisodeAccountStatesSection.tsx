import type { TMDBTvEpisodeAccountStates } from "../../database/interface/tv_episode";

interface EpisodeAccountStatesSectionProps {
  accountStates: TMDBTvEpisodeAccountStates | null;
}

const EpisodeAccountStatesSection = ({
  accountStates,
}: EpisodeAccountStatesSectionProps) => {
  if (!accountStates) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          My status
        </p>
        <p className="text-[11px] text-slate-400">
          Sign in to see your rating, favorites and watchlist.
        </p>
      </div>
    );
  }

  const ratedValue =
    typeof accountStates.rated === "object" ? accountStates.rated.value : null;

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        My status
      </p>
      <div className="flex flex-wrap gap-2 text-[11px]">
        <span
          className={`rounded-full border px-3 py-1 ${
            accountStates.favorite
              ? "border-pink-500/60 bg-pink-500/10 text-pink-200"
              : "border-slate-700 bg-slate-900/80 text-slate-200"
          }`}
        >
          {accountStates.favorite ? "In favorites" : "Not favorite"}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            accountStates.watchlist
              ? "border-sky-500/60 bg-sky-500/10 text-sky-200"
              : "border-slate-700 bg-slate-900/80 text-slate-200"
          }`}
        >
          {accountStates.watchlist ? "In watchlist" : "Not in watchlist"}
        </span>
        {ratedValue !== null && (
          <span className="rounded-full border border-amber-500/70 bg-amber-500/10 px-3 py-1 text-amber-100">
            Your rating: {ratedValue} / 10
          </span>
        )}
      </div>
    </div>
  );
};

export default EpisodeAccountStatesSection;
