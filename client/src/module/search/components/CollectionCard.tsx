import { IMAGE_BASE } from "../../../constants/constants";
import type { TMDBSearchCollectionItem } from "../database/interface/search";

interface CollectionCardProps {
  item: TMDBSearchCollectionItem;
}

export default function CollectionCard({ item }: CollectionCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-neutral-900/70 ring-1 ring-neutral-800/80 hover:ring-emerald-500/90 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30">
      <div className="relative aspect-video w-full overflow-hidden">
        {item.backdrop_path || item.poster_path ? (
          <img
            src={`${IMAGE_BASE}/w780${item.backdrop_path ?? item.poster_path}`}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-400">
            No image
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/95 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 text-left">
        <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400">
          {item.name}
        </h3>
        <p className="line-clamp-3 text-xs text-neutral-300">
          {item.overview || "No overview"}
        </p>
        <div className="mt-auto flex items-center justify-between text-[11px] text-neutral-400">
          <span className="uppercase tracking-wide text-emerald-400">
            Collection
          </span>
          <span>{item.original_language?.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
