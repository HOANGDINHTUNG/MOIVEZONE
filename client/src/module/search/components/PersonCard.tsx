import { IMAGE_BASE } from "../../../constants/constants";
import type { TMDBSearchPersonItem } from "../database/interface/search";

interface PersonCardProps {
  item: TMDBSearchPersonItem;
  onClick?: () => void;
}

export default function PersonCard({ item, onClick }: PersonCardProps) {
  const topKnownFor = item.known_for?.slice(0, 3) ?? [];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl bg-neutral-900/70 ring-1 ring-neutral-800/80 hover:ring-emerald-500/90 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden">
        {item.profile_path ? (
          <img
            src={`${IMAGE_BASE}/w342${item.profile_path}`}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-400">
            No photo
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/90 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 text-left">
        <h3 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-emerald-400">
          {item.name}
        </h3>
        <p className="text-[11px] uppercase tracking-wide text-emerald-400">
          {item.known_for_department || "Unknown department"}
        </p>
        {topKnownFor.length > 0 && (
          <p className="mt-1 line-clamp-2 text-[11px] text-neutral-400">
            Known for:{" "}
            {topKnownFor
              .map((k) => ("title" in k ? k.title : k.name))
              .join(" · ")}
          </p>
        )}
      </div>
    </button>
  );
}
