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
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
          Where to watch
        </p>
        <p className="text-[11px] text-slate-400">
          No watch providers for region {region}.
        </p>
      </div>
    );
  }

  const renderList = (items?: typeof provider.flatrate) =>
    items?.map((item) => (
      <div
        key={item.provider_id}
        className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-2 py-1.5"
      >
        <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800">
          {item.logo_path ? (
            <img
              src={`${IMAGE_BASE}/w45${item.logo_path}`}
              alt={item.provider_name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-500">
              {item.provider_name[0]}
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-100 truncate">
          {item.provider_name}
        </p>
      </div>
    ));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Where to watch
        </p>
        <p className="text-[11px] text-slate-400">Region {region}</p>
      </div>

      <div className="grid gap-3">
        {!!provider.flatrate?.length && (
          <div>
            <p className="text-[11px] text-slate-400 mb-1">Stream</p>
            <div className="flex flex-wrap gap-2">
              {renderList(provider.flatrate)}
            </div>
          </div>
        )}

        {!!provider.buy?.length && (
          <div>
            <p className="text-[11px] text-slate-400 mb-1">Buy</p>
            <div className="flex flex-wrap gap-2">
              {renderList(provider.buy)}
            </div>
          </div>
        )}

        {!!provider.rent?.length && (
          <div>
            <p className="text-[11px] text-slate-400 mb-1">Rent</p>
            <div className="flex flex-wrap gap-2">
              {renderList(provider.rent)}
            </div>
          </div>
        )}

        {!provider.flatrate?.length &&
          !provider.buy?.length &&
          !provider.rent?.length && (
            <p className="text-[11px] text-slate-400">
              No provider types for this region.
            </p>
          )}
      </div>
    </div>
  );
};

export default WatchProvidersSection;
