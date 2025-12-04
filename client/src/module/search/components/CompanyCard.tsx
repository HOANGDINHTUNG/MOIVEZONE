import { IMAGE_BASE } from "../../../constants/constants";
import type { TMDBSearchCompanyItem } from "../database/interface/search";

interface CompanyCardProps {
  item: TMDBSearchCompanyItem;
}

export default function CompanyCard({ item }: CompanyCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-neutral-900/70 p-3 ring-1 ring-neutral-800/80 hover:ring-emerald-500/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30">
      {item.logo_path ? (
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-neutral-950/80">
          <img
            src={`${IMAGE_BASE}/w154${item.logo_path}`}
            alt={item.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800 text-xs text-neutral-400">
          No logo
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-white">{item.name}</span>
        <span className="text-[11px] text-neutral-400">
          Origin country: {item.origin_country || "N/A"}
        </span>
      </div>
    </div>
  );
}
