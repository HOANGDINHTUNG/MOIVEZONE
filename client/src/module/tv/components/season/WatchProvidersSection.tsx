import type { TMDBTvSeasonWatchProviderCountry } from "../../database/interface/tv_season";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface WatchProvidersSectionProps {
  provider: TMDBTvSeasonWatchProviderCountry | null;
  region: string;
}

const WatchProvidersSection = ({
  provider,
  region,
}: WatchProvidersSectionProps) => {
  if (!provider) {
    return (
      <div
        className="
          rounded-2xl border border-white/10
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Where to watch
        </p>
        <p className="text-[11px] text-slate-300">
          No watch providers for region {region}.
        </p>
      </div>
    );
  }

  const renderList = (items?: typeof provider.flatrate) =>
    items?.map((item) => (
      <div
        key={item.provider_id}
        className="
          flex items-center gap-2 rounded-xl
          bg-white/5 px-2 py-1.5
          border border-white/10
          hover:border-cyan-400/70 hover:bg-cyan-500/10
          transition-transform duration-200
          hover:-translate-y-0.5
        "
      >
        <div className="h-7 w-7 overflow-hidden rounded-lg bg-slate-900/80">
          {item.logo_path ? (
            <img
              src={`${IMAGE_BASE}/w45${item.logo_path}`}
              alt={item.provider_name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
              {item.provider_name[0]}
            </div>
          )}
        </div>
        <p className="truncate text-[11px] text-slate-100">
          {item.provider_name}
        </p>
      </div>
    ));

  return (
    <div
      className="
        space-y-3 rounded-2xl border border-white/10
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-2xl
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Where to watch
        </p>
        <p className="text-[11px] text-slate-300">
          Region{" "}
          <span className="rounded-full border border-slate-500/70 bg-slate-900/80 px-2 py-0.5">
            {region}
          </span>
        </p>
      </div>

      <div className="grid gap-3">
        {!!provider.flatrate?.length && (
          <div>
            <p className="mb-1 text-[11px] text-cyan-200">Stream</p>
            <div className="flex flex-wrap gap-2">
              {renderList(provider.flatrate)}
            </div>
          </div>
        )}

        {!!provider.buy?.length && (
          <div>
            <p className="mb-1 text-[11px] text-amber-200">Buy</p>
            <div className="flex flex-wrap gap-2">
              {renderList(provider.buy)}
            </div>
          </div>
        )}

        {!!provider.rent?.length && (
          <div>
            <p className="mb-1 text-[11px] text-violet-200">Rent</p>
            <div className="flex flex-wrap gap-2">
              {renderList(provider.rent)}
            </div>
          </div>
        )}

        {!provider.flatrate?.length &&
          !provider.buy?.length &&
          !provider.rent?.length && (
            <p className="text-[11px] text-slate-300">
              No provider types for this region.
            </p>
          )}
      </div>
    </div>
  );
};

export default WatchProvidersSection;
