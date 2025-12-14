import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TvEpisodeGroupSummary } from "../pages/DetailsPage";

const TMDB_IMAGE = "https://image.tmdb.org/t/p";

const typeLabelMap: Record<number, string> = {
  1: "Original air date",
  2: "Absolute",
  3: "DVD",
  4: "Digital",
  5: "Story arc",
  6: "Production",
  7: "TV",
};

interface DetailsEpisodeGroupsSectionProps {
  episodeGroups: TvEpisodeGroupSummary[];
}

const DetailsEpisodeGroupsSection = ({
  episodeGroups,
}: DetailsEpisodeGroupsSectionProps) => {
  const navigate = useNavigate();

  const sortedGroups = useMemo(
    () =>
      episodeGroups
        .slice()
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [episodeGroups]
  );

  const totalEpisodes = useMemo(
    () => sortedGroups.reduce((sum, g) => sum + g.episode_count, 0),
    [sortedGroups]
  );

  if (!sortedGroups.length) return null;

  const handleOpenGroup = (id: string) => navigate(`/tv/episode_group/${id}`);

  const firstGroup = sortedGroups[0];

  return (
    <section
      className="
        mt-6 rounded-2xl border 
        border-amber-500/40 bg-black/60 text-amber-100
        p-4 backdrop-blur md:p-5

        dark:border-amber-600/60 dark:bg-black/80
      "
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-400/80">
            Episode Groups
          </p>
          <p className="text-[11px] text-amber-300/60">
            {sortedGroups.length} groups • {totalEpisodes} episodes
          </p>
        </div>

        {/* Desktop button */}
        <button
          type="button"
          onClick={() => handleOpenGroup(firstGroup.id)}
          className="
            hidden rounded-full border border-amber-500/60 
            bg-black/40 px-3 py-1 text-[11px] font-medium text-amber-300 
            hover:bg-amber-600/20 md:inline-flex

            dark:border-amber-600 dark:hover:bg-amber-500/30
          "
        >
          View episode groups
        </button>
      </div>

      {/* List */}
      <div
        className="
          flex max-h-72 flex-col gap-2 overflow-y-auto 
          scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-black
        "
      >
        {sortedGroups.map((g) => {
          const typeLabel = typeLabelMap[g.type] ?? `Type ${g.type}`;
          const hasNetwork = !!g.network;

          return (
            <button
              key={g.id}
              type="button"
              onClick={() => handleOpenGroup(g.id)}
              className="
                flex w-full items-center justify-between gap-3 rounded-xl 
                border border-red-700/40 bg-black/50 px-3 py-2 
                text-left text-[11px] transition-colors

                hover:border-amber-500 hover:bg-black/70
              "
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-amber-200">
                  {g.name}
                </p>

                <p className="mt-0.5 text-[10px] text-amber-300/70">
                  {typeLabel} • {g.group_count} groups • {g.episode_count} eps
                </p>

                {hasNetwork && (
                  <div className="mt-1 flex items-center gap-2">
                    {g.network?.logo_path && (
                      <img
                        src={`${TMDB_IMAGE}/w92${g.network.logo_path}`}
                        alt={g.network.name}
                        className="h-4 w-auto rounded bg-black/40 object-contain"
                        loading="lazy"
                      />
                    )}
                    <span className="text-[10px] text-amber-200/80">
                      {g.network?.name}
                    </span>
                  </div>
                )}
              </div>

              <span className="shrink-0 text-[10px] text-red-500">
                Order {g.order}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile button */}
      <button
        type="button"
        onClick={() => handleOpenGroup(firstGroup.id)}
        className="
          mt-3 inline-flex w-full items-center justify-center rounded-full 
          border border-amber-500/70 bg-amber-600/20 
          px-3 py-1.5 text-[11px] font-medium text-amber-200 
          hover:bg-amber-500/30 md:hidden

          dark:border-amber-600
        "
      >
        View episode groups
      </button>
    </section>
  );
};

export default DetailsEpisodeGroupsSection;
