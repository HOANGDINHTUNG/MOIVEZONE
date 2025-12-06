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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <p className="text-sm text-slate-300">
          Missing tv_episode_group_id in route.
        </p>
      </div>
    );
  }

  if (loading && !detail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <p className="text-sm text-slate-300">Loading episode group…</p>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <div className="max-w-md space-y-3 px-4 text-center">
          <p className="text-sm text-red-300">Error: {error}</p>
          <button
            className="mt-2 rounded-full border border-slate-600 px-4 py-1.5 text-xs text-slate-100 hover:bg-slate-800"
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
    <div className="min-h-screen bg-slate-950 text-slate-50">
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
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
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
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroStill})` }}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/85 via-slate-950/90 to-slate-950" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-20 pb-10 md:pb-16">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300 hover:text-white"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-[10px]">
            ←
          </span>
          Back
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3 max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">
              TV Episode Group
            </p>

            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              {detail.name}
            </h1>

            {detail.description && (
              <p className="max-w-2xl text-sm text-slate-200/90 leading-relaxed">
                {detail.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-200">
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                {typeLabel}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                {detail.group_count} groups
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                {detail.episode_count} episodes
              </span>
              {network && (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
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
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Groups
        </p>
        <p className="text-[11px] text-slate-400">No groups.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
        Groups ({detail.groups.length})
      </p>
      <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
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
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[11px] transition-colors ${
                  isActive
                    ? "border-sky-500/60 bg-sky-500/10 text-sky-100"
                    : "border-slate-800 bg-slate-900/80 text-slate-200 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{group.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
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
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Episodes
        </p>
        <p className="text-[11px] text-slate-400">
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
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {group.name}
          </p>
          <p className="text-[11px] text-slate-500">
            {episodes.length} episodes · Order {group.order}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
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
              className="flex w-full gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-2 py-2 text-left text-[11px] transition-colors hover:border-sky-500/60 hover:bg-slate-900"
            >
              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                {still ? (
                  <img
                    src={still}
                    alt={ep.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-100">{code}</p>
                  <p className="text-[10px] text-slate-400">
                    {ep.runtime ? `${ep.runtime} min` : "—"}
                  </p>
                </div>

                <p className="text-sm font-medium text-slate-50">
                  {ep.name || "Untitled episode"}
                </p>

                {ep.overview && (
                  <p className="line-clamp-2 text-[11px] text-slate-300">
                    {ep.overview}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 pt-1 text-[10px] text-slate-300">
                  {ep.air_date && (
                    <span className="rounded-full bg-slate-950/80 px-2 py-0.5">
                      {ep.air_date}
                    </span>
                  )}
                  {ep.vote_average ? (
                    <span className="rounded-full bg-emerald-500/80 px-2 py-0.5 font-semibold text-slate-950">
                      ★ {ep.vote_average.toFixed(1)} ({ep.vote_count})
                    </span>
                  ) : null}
                  {ep.locked && (
                    <span className="rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] text-slate-300">
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
