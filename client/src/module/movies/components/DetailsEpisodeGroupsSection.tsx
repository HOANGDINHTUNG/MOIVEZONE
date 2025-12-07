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

  const handleOpenGroup = (id: string) => {
    navigate(`/tv/episode_group/${id}`);
  };

  const firstGroup = sortedGroups[0];

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Episode Groups
          </p>
          <p className="text-[11px] text-slate-500">
            {sortedGroups.length} groups • {totalEpisodes} episodes
          </p>
        </div>

        {/* Nút "View episode groups" – desktop */}
        <button
          type="button"
          onClick={() => handleOpenGroup(firstGroup.id)}
          className="hidden rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-100 hover:bg-sky-500/20 md:inline-flex"
        >
          View episode groups
        </button>
      </div>

      {/* Danh sách group */}
      <div className="flex max-h-72 flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {sortedGroups.map((g) => {
          const typeLabel = typeLabelMap[g.type] ?? `Type ${g.type}`;
          const hasNetwork = !!g.network;

          return (
            <button
              key={g.id}
              type="button"
              onClick={() => handleOpenGroup(g.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-left text-[11px] transition-colors hover:border-sky-500/60 hover:bg-slate-900"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-50">
                  {g.name}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {typeLabel} • {g.group_count} groups • {g.episode_count} eps
                </p>

                {hasNetwork && (
                  <div className="mt-1 flex items-center gap-2">
                    {g.network?.logo_path && (
                      <img
                        src={`${TMDB_IMAGE}/w92${g.network.logo_path}`}
                        alt={g.network.name}
                        className="h-4 w-auto rounded bg-slate-800 object-contain"
                        loading="lazy"
                      />
                    )}
                    <span className="text-[10px] text-slate-300">
                      {g.network?.name}
                    </span>
                  </div>
                )}
              </div>

              <span className="shrink-0 text-[10px] text-slate-500">
                Order {g.order}
              </span>
            </button>
          );
        })}
      </div>

      {/* Nút view ở mobile */}
      <button
        type="button"
        onClick={() => handleOpenGroup(firstGroup.id)}
        className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1.5 text-[11px] font-medium text-sky-100 hover:bg-sky-500/20 md:hidden"
      >
        View episode groups
      </button>
    </section>
  );
};

export default DetailsEpisodeGroupsSection;
