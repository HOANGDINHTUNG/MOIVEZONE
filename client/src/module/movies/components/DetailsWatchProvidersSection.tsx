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
      <section className="mt-4">
        <h2 className="font-semibold mb-2 text-sm md:text-base">
          Where to watch
        </h2>

        <div className="space-y-3 text-xs md:text-sm">
          {countriesToShow.map((country) => {
            const opt = watchProviders[country];
            if (!opt) return null;

            const hasAny =
              (opt.flatrate && opt.flatrate.length > 0) ||
              (opt.rent && opt.rent.length > 0) ||
              (opt.buy && opt.buy.length > 0);

            return (
              <div
                key={country}
                className="
                  rounded-xl border border-neutral-800/70 bg-neutral-900/70
                  px-3 py-2.5 md:px-4 md:py-3
                "
              >
                {/* Header country + link TMDB nếu có */}
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wide text-neutral-200">
                    {country === "VN"
                      ? "Việt Nam (VN)"
                      : country === "US"
                      ? "United States (US)"
                      : country === "GB"
                      ? "United Kingdom (GB)"
                      : country}
                  </p>

                  {opt.link && (
                    <a
                      href={opt.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] md:text-xs text-sky-400 hover:text-sky-300 underline underline-offset-2"
                    >
                      View on TMDB ↗
                    </a>
                  )}
                </div>

                {!hasAny ? (
                  <p className="text-[11px] text-neutral-400">
                    Chưa có thông tin nhà cung cấp cho quốc gia này.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {/* Subscription / flatrate */}
                    {opt.flatrate && opt.flatrate.length > 0 && (
                      <ProviderRow
                        label="Subscription"
                        items={opt.flatrate}
                        colorClass="bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                      />
                    )}

                    {/* Rent */}
                    {opt.rent && opt.rent.length > 0 && (
                      <ProviderRow
                        label="Rent"
                        items={opt.rent}
                        colorClass="bg-amber-500/15 text-amber-300 border-amber-500/40"
                      />
                    )}

                    {/* Buy */}
                    {opt.buy && opt.buy.length > 0 && (
                      <ProviderRow
                        label="Buy"
                        items={opt.buy}
                        colorClass="bg-sky-500/15 text-sky-300 border-sky-500/40"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default DetailsWatchProvidersSection;

/* ------- SUB COMPONENT: ProviderRow (responsive) ------- */

interface ProviderRowProps {
  label: string;
  items: WatchProviderItem[];
  colorClass: string;
}

const ProviderRow = ({ label, items, colorClass }: ProviderRowProps) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] md:text-xs font-semibold text-neutral-300">
        {label}:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((p) => (
          <span
            key={p.provider_id}
            className={`
              inline-flex items-center rounded-full border px-2 py-0.5
              text-[10px] md:text-[11px] font-medium
              ${colorClass}
            `}
          >
            {p.provider_name}
          </span>
        ))}
      </div>
    </div>
  );
};
