// src/module/tv/pages/TvEpisodeGroupPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";

import {
  fetchTvEpisodeGroup,
  selectTvEpisodeGroupState,
} from "../store/tvEpisodeGroupSlice";

import type {
  TMDBTvEpisodeGroupDetails,
  TMDBTvEpisodeGroupEpisode,
  TMDBTvEpisodeGroupItem,
} from "../database/interface/tv_episode_group";

const IMAGE_BASE = "https://image.tmdb.org/t/p/";
const HIRES_BASE = "https://image.tmdb.org/t/p/original/";

const typeLabelMap: Record<number, string> = {
  1: "Original air date",
  2: "Absolute",
  3: "DVD",
  4: "Digital",
  5: "Story arc",
  6: "Production",
  7: "TV",
};

const TvEpisodeGroupPage = () => {
  const { tv_episode_group_id } = useParams<{ tv_episode_group_id?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const language = useAppSelector((state) => state.language.current);
  const { loading, error, detail } = useAppSelector(selectTvEpisodeGroupState);

  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    if (!tv_episode_group_id) return;
    dispatch(
      fetchTvEpisodeGroup({
        groupId: tv_episode_group_id,
        language,
      })
    );
  }, [dispatch, tv_episode_group_id, language]);

  // 👉 Tự tính group đang active nếu user chưa chọn
  const effectiveActiveGroupId = useMemo(() => {
    if (activeGroupId) return activeGroupId;
    if (!detail?.groups?.length) return null;
    return detail.groups[0].id;
  }, [activeGroupId, detail]);

  const activeGroup: TMDBTvEpisodeGroupItem | null = useMemo(() => {
    if (!detail?.groups?.length || !effectiveActiveGroupId) return null;
    return detail.groups.find((g) => g.id === effectiveActiveGroupId) ?? null;
  }, [detail, effectiveActiveGroupId]);

  const heroStill = useMemo(() => {
    if (!detail?.groups?.length) return null;
    const firstEpisode = detail.groups[0].episodes[0];
    if (firstEpisode?.still_path) {
      return `${HIRES_BASE}${firstEpisode.still_path}`;
    }
    return null;
  }, [detail]);

  if (!tv_episode_group_id) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-linear-to-b from-[#020617] via-black to-black
          text-slate-50
        "
      >
        <p className="text-sm text-slate-300">
          Missing tv_episode_group_id in route.
        </p>
      </div>
    );
  }

  if (loading && !detail) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-linear-to-b from-[#020617] via-black to-black
          text-slate-50
        "
      >
        <p className="text-sm text-slate-300">Loading episode group…</p>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div
        className="
          flex min-h-screen items-center justify-center
          bg-linear-to-b from-[#020617] via-black to-black
          text-slate-50
        "
      >
        <div className="max-w-md space-y-3 px-4 text-center">
          <p className="text-sm text-red-300">Error: {error}</p>
          <button
            className="
              mt-2 rounded-full border border-white/25
              px-4 py-1.5 text-xs text-slate-100
              bg-white/5 hover:bg-white/10
              transition-colors
            "
            onClick={() =>
              dispatch(
                fetchTvEpisodeGroup({
                  groupId: tv_episode_group_id,
                  language,
                })
              )
            }
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  const typeLabel = typeLabelMap[detail.type] ?? `Type ${detail.type}`;

  return (
    <div
      className="
        min-h-screen
        bg-linear-to-b from-[#020617] via-black to-black
        text-slate-50
      "
    >
      <EpisodeGroupHero
        detail={detail}
        heroStill={heroStill}
        typeLabel={typeLabel}
        onBack={() => navigate(-1)}
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16">
        {loading && detail && (
          <div className="text-[11px] text-slate-400">
            Updating episode group data…
          </div>
        )}

        {error && detail && (
          <div
            className="
              rounded-xl border border-red-500/50
              bg-red-500/15 px-3 py-2 text-[11px] text-red-100
              shadow-[0_0_14px_#ef444455]
            "
          >
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1.8fr)]">
          <EpisodeGroupTabs
            detail={detail}
            activeGroupId={effectiveActiveGroupId}
            onChangeGroup={setActiveGroupId}
          />
          <EpisodeGroupEpisodesList group={activeGroup} />
        </div>
      </div>
    </div>
  );
};

export default TvEpisodeGroupPage;

/* ================== SUB COMPONENTS ================== */

interface EpisodeGroupHeroProps {
  detail: TMDBTvEpisodeGroupDetails;
  heroStill: string | null;
  typeLabel: string;
  onBack: () => void;
}

const EpisodeGroupHero = ({
  detail,
  heroStill,
  typeLabel,
  onBack,
}: EpisodeGroupHeroProps) => {
  const network = detail.network;

  return (
    <div className="relative w-full">
      {heroStill && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url(${heroStill})` }}
        />
      )}
      <div
        className="
          absolute inset-0
          bg-linear-to-b from-[#020617]/95 via-black/92 to-black
        "
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-20 pb-10 md:pb-16">
        <button
          onClick={onBack}
          className="
            mb-6 inline-flex items-center gap-2
            text-xs uppercase tracking-[0.18em]
            text-slate-300 hover:text-fuchsia-300
            transition-colors
          "
        >
          <span
            className="
              inline-flex h-7 w-7 items-center justify-center
              rounded-full border border-white/25 bg-white/5 text-[10px]
              hover:border-fuchsia-400 hover:bg-fuchsia-500/15
              transition-colors
            "
          >
            ←
          </span>
          Back
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-fuchsia-300/80">
              TV Episode Group
            </p>

            <h1
              className="
                text-2xl font-semibold leading-tight md:text-3xl
                bg-linear-to-r from-fuchsia-300 via-sky-200 to-emerald-300
                bg-clip-text text-transparent
              "
            >
              {detail.name}
            </h1>

            {detail.description && (
              <p className="max-w-2xl text-sm leading-relaxed text-slate-200/90">
                {detail.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span
                className="
                  rounded-full border border-violet-500/70
                  bg-violet-600/20 px-3 py-1 text-violet-100
                "
              >
                {typeLabel}
              </span>
              <span
                className="
                  rounded-full border border-cyan-400/70
                  bg-cyan-500/15 px-3 py-1 text-cyan-100
                "
              >
                {detail.group_count} groups
              </span>
              <span
                className="
                  rounded-full border border-emerald-400/70
                  bg-emerald-500/15 px-3 py-1 text-emerald-100
                "
              >
                {detail.episode_count} episodes
              </span>

              {network && (
                <span
                  className="
                    inline-flex items-center gap-2 rounded-full
                    border border-white/20 bg-white/5
                    px-3 py-1 text-slate-100
                  "
                >
                  {network.logo_path ? (
                    <img
                      src={`${IMAGE_BASE}w92${network.logo_path}`}
                      alt={network.name}
                      className="h-4 object-contain"
                      loading="lazy"
                    />
                  ) : null}
                  <span>{network.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Group Tabs ---------- */

interface EpisodeGroupTabsProps {
  detail: TMDBTvEpisodeGroupDetails;
  activeGroupId: string | null;
  onChangeGroup: (id: string) => void;
}

const EpisodeGroupTabs = ({
  detail,
  activeGroupId,
  onChangeGroup,
}: EpisodeGroupTabsProps) => {
  if (!detail.groups.length) {
    return (
      <div
        className="
          rounded-2xl border border-white/10
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Groups
        </p>
        <p className="text-[11px] text-slate-300">No groups.</p>
      </div>
    );
  }

  return (
    <div
      className="
        rounded-2xl border border-white/10
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-2xl
      "
    >
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
        Groups ({detail.groups.length})
      </p>
      <div
        className="
          flex max-h-[360px] flex-col gap-2 overflow-y-auto
          scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-slate-900
        "
      >
        {detail.groups
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((group) => {
            const isActive = group.id === activeGroupId;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onChangeGroup(group.id)}
                className={`
                  flex w-full items-center justify-between rounded-xl border px-3 py-2
                  text-left text-[11px] transition-transform duration-200
                  ${
                    isActive
                      ? "border-fuchsia-500/70 bg-fuchsia-500/15 text-fuchsia-100 shadow-[0_0_14px_#e879f955]"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:-translate-y-0.5"
                  }
                `}
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{group.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-300">
                    {group.episodes.length} episodes · Order {group.order}
                  </p>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};

/* ---------- Episodes in active group ---------- */

interface EpisodeGroupEpisodesListProps {
  group: TMDBTvEpisodeGroupItem | null;
}

const EpisodeGroupEpisodesList = ({ group }: EpisodeGroupEpisodesListProps) => {
  const navigate = useNavigate();

  if (!group) {
    return (
      <div
        className="
          rounded-2xl border border-white/10
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Episodes
        </p>
        <p className="text-[11px] text-slate-300">
          Select a group to view episodes.
        </p>
      </div>
    );
  }

  const episodes = group.episodes
    .slice()
    .sort((a, b) => a.order - b.order || a.episode_number - b.episode_number);

  const handleEpisodeClick = (ep: TMDBTvEpisodeGroupEpisode) => {
    // điều hướng sang trang TvEpisodePage (đã làm trước đó)
    navigate(
      `/tv/${ep.show_id}/season/${ep.season_number}/episode/${ep.episode_number}`
    );
  };

  return (
    <div
      className="
        rounded-2xl border border-white/10
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-2xl
      "
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
            {group.name}
          </p>
          <p className="text-[11px] text-slate-300">
            {episodes.length} episodes · Order {group.order}
          </p>
        </div>
      </div>

      <div
        className="
          flex max-h-[420px] flex-col gap-3 overflow-y-auto
          scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-slate-900
        "
      >
        {episodes.map((ep) => {
          const still = ep.still_path
            ? `${IMAGE_BASE}w300${ep.still_path}`
            : null;
          const code = `S${ep.season_number
            .toString()
            .padStart(2, "0")}E${ep.episode_number
            .toString()
            .padStart(2, "0")}`;

          return (
            <button
              key={ep.id}
              type="button"
              onClick={() => handleEpisodeClick(ep)}
              className="
                flex w-full gap-3 rounded-xl border border-white/10
                bg-white/5 px-2 py-2 text-left text-[11px]
                transition-transform duration-200
                hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:-translate-y-0.5
              "
            >
              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-900/80">
                {still ? (
                  <img
                    src={still}
                    alt={ep.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-cyan-200">{code}</p>
                  <p className="text-[10px] text-slate-300">
                    {ep.runtime ? `${ep.runtime} min` : "—"}
                  </p>
                </div>

                <p className="text-sm font-medium text-slate-50">
                  {ep.name || "Untitled episode"}
                </p>

                {ep.overview && (
                  <p className="line-clamp-2 text-[11px] text-slate-200/90">
                    {ep.overview}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 pt-1 text-[10px]">
                  {ep.air_date && (
                    <span
                      className="
                        rounded-full bg-slate-900/80 px-2 py-0.5
                        text-slate-200
                      "
                    >
                      {ep.air_date}
                    </span>
                  )}
                  {ep.vote_average ? (
                    <span
                      className="
                        rounded-full px-2 py-0.5 font-semibold
                        border border-amber-400/80
                        bg-linear-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25
                        text-amber-100 shadow-[0_0_10px_#fbbf2488]
                      "
                    >
                      ★ {ep.vote_average.toFixed(1)} ({ep.vote_count})
                    </span>
                  ) : null}
                  {ep.locked && (
                    <span
                      className="
                        rounded-full bg-rose-500/20 px-2 py-0.5
                        text-[10px] text-rose-200 border border-rose-400/70
                      "
                    >
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
