// src/pages/DetailsWatchProvidersSection.tsx
import Divider from "../../../components/common/ux/Divider";

type WatchProviderItem = {
  provider_id: number;
  provider_name: string;
};

type WatchProviderCountry = {
  link?: string;
  flatrate?: WatchProviderItem[];
  rent?: WatchProviderItem[];
  buy?: WatchProviderItem[];
};

type DetailsWatchProvidersSectionProps = {
  watchProviders?: Record<string, WatchProviderCountry>;
};

const DetailsWatchProvidersSection: React.FC<
  DetailsWatchProvidersSectionProps
> = ({ watchProviders }) => {
  if (!watchProviders) return null;

  const countriesToShow = ["VN", "US", "GB"];

  return (
    <>
      <Divider />
      <div className="mt-4">
        <h2 className="font-semibold mb-2 text-sm md:text-base">
          Where to watch
        </h2>
        <div className="space-y-2 text-sm">
          {countriesToShow.map((country) => {
            const opt = watchProviders[country];
            if (!opt) return null;
            return (
              <div key={country}>
                <p className="font-semibold mb-1">{country}</p>
                {opt.flatrate && (
                  <p>
                    Subscription:{" "}
                    {opt.flatrate.map((p) => p.provider_name).join(", ")}
                  </p>
                )}
                {opt.rent && (
                  <p>Rent: {opt.rent.map((p) => p.provider_name).join(", ")}</p>
                )}
                {opt.buy && (
                  <p>Buy: {opt.buy.map((p) => p.provider_name).join(", ")}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DetailsWatchProvidersSection;
