import React from "react";
import type { TMDBListSummary } from "../database/interface/movie";
import type { TMDBTvListSummary } from "../database/interface/tv";

type UnifiedListItem = TMDBListSummary | TMDBTvListSummary;

interface DetailsListsSectionProps {
  lists: UnifiedListItem[];
}

const DetailsListsSection: React.FC<DetailsListsSectionProps> = ({ lists }) => {
  if (!lists.length) return null;

  return (
    <section
      aria-label="Lists"
      className="rounded-xl bg-neutral-900/60 p-4 shadow-sm"
    >
      <h2 className="mb-3 border-b border-neutral-800 pb-2 text-sm font-semibold uppercase tracking-wide text-neutral-200">
        Appears in lists
      </h2>

      <div className="-mx-3 overflow-x-auto px-3 pb-1">
        <div className="flex gap-3">
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex w-52 shrink-0 flex-col overflow-hidden rounded-lg bg-neutral-800/80"
            >
              <div className="relative h-28 w-full bg-neutral-900">
                {list.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${list.poster_path}`}
                    alt={list.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                    No image
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3">
                <h3 className="line-clamp-2 text-xs font-semibold text-neutral-100">
                  {list.name}
                </h3>
                {list.description && (
                  <p className="line-clamp-2 text-[11px] text-neutral-400">
                    {list.description}
                  </p>
                )}
                <p className="text-[10px] text-neutral-500">
                  {list.item_count} items •{" "}
                  {typeof list.favorite_count === "number"
                    ? `${list.favorite_count} favorites`
                    : null}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailsListsSection;
