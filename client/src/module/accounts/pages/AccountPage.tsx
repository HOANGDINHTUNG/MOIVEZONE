import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import {
  fetchAccountData,
  fetchAccountDetails,
  initAccountConfig,
  selectAccount,
} from "../store/accountSlice";
import type {
  TMDBMovieListItem,
  TMDBTvListItem,
  TMDBRatedMovieListItem,
  TMDBRatedTvListItem,
} from "../database/interface/account";
import type { TMDBConfig } from "../../../api/movie/TMDBAccount.api";

type AccountTab = "overview" | "favorites" | "watchlist" | "rated" | "lists";
type MediaKind = "movie" | "tv";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

interface AccountPageProps {
  apiKey: string;
  sessionId: string;
  accountId: number;
}

const AccountPage = ({ apiKey, sessionId, accountId }: AccountPageProps) => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectAccount);

  const [activeTab, setActiveTab] = useState<AccountTab>("overview");
  const [favoriteKind, setFavoriteKind] = useState<MediaKind>("movie");
  const [watchlistKind, setWatchlistKind] = useState<MediaKind>("movie");
  const [ratedKind, setRatedKind] = useState<MediaKind | "episode">("movie");

  // init config
  useEffect(() => {
    const cfg: TMDBConfig = { apiKey, sessionId, accountId };
    dispatch(initAccountConfig(cfg));
  }, [apiKey, sessionId, accountId, dispatch]);

  // fetch account + data
  useEffect(() => {
    if (!account.config) return;
    dispatch(fetchAccountDetails());
    dispatch(fetchAccountData());
  }, [account.config, dispatch]);

  const stats = useMemo(
    () => ({
      favorites:
        (account.favoriteMovies?.total_results || 0) +
        (account.favoriteTv?.total_results || 0),
      watchlist:
        (account.watchlistMovies?.total_results || 0) +
        (account.watchlistTv?.total_results || 0),
      rated:
        (account.ratedMovies?.total_results || 0) +
        (account.ratedTv?.total_results || 0) +
        (account.ratedEpisodes?.total_results || 0),
      lists: account.lists?.total_results || 0,
    }),
    [account]
  );

  const det = account.details;

  const renderAvatar = () => {
    if (!det) {
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-600 bg-linear-to-br from-emerald-400 via-rose-500 to-indigo-500 text-xl font-bold text-white md:h-20 md:w-20">
          ?
        </div>
      );
    }

    const avatarPath = det.avatar?.tmdb?.avatar_path;
    if (avatarPath) {
      return (
        <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-600 md:h-20 md:w-20">
          <img
            src={`${TMDB_IMAGE_BASE}${avatarPath}`}
            alt={det.username}
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    const initial =
      det.name?.[0] || det.username?.[0] || det.iso_3166_1?.[0] || "?";

    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-600 bg-linear-to-br from-emerald-400 via-rose-500 to-indigo-500 text-xl font-bold text-white md:h-20 md:w-20">
        {initial.toUpperCase()}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-100 sm:text-lg">
          Overview
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewStatCard
          label="Favorites"
          value={stats.favorites}
          desc="Phim & TV bạn yêu thích"
          color="from-pink-500/70 via-rose-500/40 to-purple-500/20"
        />
        <OverviewStatCard
          label="Watchlist"
          value={stats.watchlist}
          desc="Những gì bạn muốn xem"
          color="from-cyan-500/70 via-sky-500/40 to-indigo-500/20"
        />
        <OverviewStatCard
          label="Rated"
          value={stats.rated}
          desc="Số title đã đánh giá"
          color="from-emerald-500/70 via-lime-500/40 to-sky-500/20"
        />
        <OverviewStatCard
          label="Lists"
          value={stats.lists}
          desc="Danh sách tự tạo"
          color="from-amber-500/70 via-orange-500/40 to-rose-500/20"
        />
      </div>
    </div>
  );

  const renderFavorites = () => {
    const movies = account.favoriteMovies?.results || [];
    const tv = account.favoriteTv?.results || [];
    const activeList: (TMDBMovieListItem | TMDBTvListItem)[] =
      favoriteKind === "movie" ? movies : tv;

    return (
      <div className="p-4 sm:p-5 lg:p-6">
        <SectionHeader
          title="Favorites"
          pill={
            <KindToggle
              value={favoriteKind}
              onChange={(k) => setFavoriteKind(k as MediaKind)}
            />
          }
        />
        {activeList.length === 0 ? (
          <EmptyState text="Bạn chưa thêm gì vào Favorites cho loại này." />
        ) : (
          <MediaGrid
            items={activeList}
            kind={favoriteKind}
            showRatingFromItem
          />
        )}
      </div>
    );
  };

  const renderWatchlist = () => {
    const movies = account.watchlistMovies?.results || [];
    const tv = account.watchlistTv?.results || [];
    const activeList: (TMDBMovieListItem | TMDBTvListItem)[] =
      watchlistKind === "movie" ? movies : tv;

    return (
      <div className="p-4 sm:p-5 lg:p-6">
        <SectionHeader
          title="Watchlist"
          pill={
            <KindToggle
              value={watchlistKind}
              onChange={(k) => setWatchlistKind(k as MediaKind)}
            />
          }
        />
        {activeList.length === 0 ? (
          <EmptyState text="Watchlist đang trống cho loại này." />
        ) : (
          <MediaGrid
            items={activeList}
            kind={watchlistKind}
            showRatingFromItem
          />
        )}
      </div>
    );
  };

  const renderRated = () => {
    const movies = account.ratedMovies?.results || [];
    const tv = account.ratedTv?.results || [];
    const episodes = account.ratedEpisodes?.results || [];

    const activeList =
      ratedKind === "movie" ? movies : ratedKind === "tv" ? tv : episodes;

    return (
      <div className="p-4 sm:p-5 lg:p-6">
        <SectionHeader
          title="Rated"
          pill={
            <div className="inline-flex items-center rounded-full border border-slate-600/70 bg-slate-900/80 p-1 text-xs text-slate-200">
              <button
                onClick={() => setRatedKind("movie")}
                className={`rounded-full px-2.5 py-1 transition ${
                  ratedKind === "movie"
                    ? "bg-slate-800 text-emerald-300"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setRatedKind("tv")}
                className={`rounded-full px-2.5 py-1 transition ${
                  ratedKind === "tv"
                    ? "bg-slate-800 text-emerald-300"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                TV
              </button>
              <button
                onClick={() => setRatedKind("episode")}
                className={`rounded-full px-2.5 py-1 transition ${
                  ratedKind === "episode"
                    ? "bg-slate-800 text-emerald-300"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                Episodes
              </button>
            </div>
          }
        />

        {activeList.length === 0 ? (
          <EmptyState text="Chưa có đánh giá nào cho loại này." />
        ) : ratedKind === "episode" ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/90 shadow-lg shadow-slate-950/70 transition hover:-translate-y-1 hover:border-pink-500/70 hover:shadow-pink-900/40"
              >
                <div className="relative aspect-video overflow-hidden">
                  {ep.still_path ? (
                    <img
                      src={`${TMDB_IMAGE_BASE}${ep.still_path}`}
                      alt={ep.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-slate-800 via-slate-900 to-black" />
                  )}
                  <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-slate-900/95 px-2 py-0.5 text-[11px] text-slate-100 shadow-lg shadow-black/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{ep.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-2">
                  <div className="text-xs font-medium text-emerald-300/90">
                    S{ep.season_number} · E{ep.episode_number}
                  </div>
                  <div className="line-clamp-2 text-sm font-semibold text-slate-50">
                    {ep.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Air date: {ep.air_date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MediaGrid
            items={activeList as (TMDBMovieListItem | TMDBTvListItem)[]}
            kind={ratedKind as MediaKind}
            showRatingFromRatingField
          />
        )}
      </div>
    );
  };

  const renderLists = () => {
    const lists = account.lists?.results || [];
    return (
      <div className="p-4 sm:p-5 lg:p-6">
        <SectionHeader title="Lists" />
        {lists.length === 0 ? (
          <EmptyState text="Bạn chưa tạo danh sách nào trên TMDB." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {lists.map((list) => (
              <div
                key={list.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/90 shadow-lg shadow-slate-950/70 transition hover:-translate-y-1 hover:border-indigo-500/80 hover:shadow-indigo-900/40"
              >
                <div className="relative aspect-2/3 overflow-hidden">
                  {list.poster_path ? (
                    <img
                      src={`${TMDB_IMAGE_BASE}${list.poster_path}`}
                      alt={list.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-slate-800 via-slate-900 to-black" />
                  )}
                  <div className="absolute bottom-2 left-2 inline-flex rounded-full bg-slate-900/95 px-2 py-0.5 text-[11px] text-slate-100 shadow-lg shadow-black/50">
                    {list.item_count} items
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-2">
                  <h3 className="line-clamp-2 text-sm font-semibold text-slate-50">
                    {list.name}
                  </h3>
                  <p className="line-clamp-2 text-[11px] text-slate-400">
                    {list.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "favorites":
        return renderFavorites();
      case "watchlist":
        return renderWatchlist();
      case "rated":
        return renderRated();
      case "lists":
        return renderLists();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,#1e293b_0,#020617_55%,#000000_100%)] px-3 py-5 text-slate-50 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:gap-5">
        {/* HEADER */}
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800/70 bg-linear-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.85)] sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
          <div className="flex flex-1 items-start gap-4 sm:gap-5">
            {renderAvatar()}
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-50 sm:text-xl lg:text-2xl">
                  {det?.name || det?.username || "Your TMDB Account"}
                </h1>
                {det?.username && (
                  <span className="inline-flex items-center rounded-full border border-slate-600/70 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
                    @{det.username}
                  </span>
                )}
              </div>
              {det && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 sm:text-[13px]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="font-medium text-slate-100">
                      {det.iso_639_1.toUpperCase()}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span>{det.iso_3166_1}</span>
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  <span>
                    {det.include_adult
                      ? "Hiển thị nội dung 18+"
                      : "Ẩn nội dung 18+"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
            <HeaderStat
              label="Favorites"
              value={stats.favorites}
              gradient="from-pink-500/70 via-rose-500/40 to-purple-500/20"
            />
            <HeaderStat
              label="Watchlist"
              value={stats.watchlist}
              gradient="from-cyan-500/70 via-sky-500/40 to-indigo-500/20"
            />
          </div>
        </header>

        {/* MAIN CARD */}
        <main className="flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-800/80 bg-slate-950/95 px-2 pt-2 sm:px-4">
            <AccountTabButton
              id="overview"
              active={activeTab}
              setActive={setActiveTab}
              label="Overview"
            />
            <AccountTabButton
              id="favorites"
              active={activeTab}
              setActive={setActiveTab}
              label="Favorites"
              count={stats.favorites}
            />
            <AccountTabButton
              id="watchlist"
              active={activeTab}
              setActive={setActiveTab}
              label="Watchlist"
              count={stats.watchlist}
            />
            <AccountTabButton
              id="rated"
              active={activeTab}
              setActive={setActiveTab}
              label="Rated"
              count={stats.rated}
            />
            <AccountTabButton
              id="lists"
              active={activeTab}
              setActive={setActiveTab}
              label="Lists"
              count={stats.lists}
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;

/* ------------ SUB COMPONENTS ------------- */

interface TabButtonProps {
  id: AccountTab;
  active: AccountTab;
  setActive: (id: AccountTab) => void;
  label: string;
  count?: number;
}

const AccountTabButton = ({
  id,
  active,
  setActive,
  label,
  count,
}: TabButtonProps) => {
  const isActive = active === id;
  return (
    <button
      onClick={() => setActive(id)}
      className={`group relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 ${
        isActive
          ? "bg-linear-to-r from-pink-600 via-rose-600 to-indigo-500 text-slate-50 shadow-md shadow-pink-900/40"
          : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
      }`}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={`flex h-5 min-w-6 items-center justify-center rounded-full bg-slate-950/80 px-1 text-[11px] ${
            isActive ? "text-slate-50" : "text-slate-300"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

interface HeaderStatProps {
  label: string;
  value: number;
  gradient: string;
}

const HeaderStat = ({ label, value, gradient }: HeaderStatProps) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2.5 text-right shadow-md shadow-black/40 sm:px-4">
    <div
      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${gradient} opacity-30`}
    />
    <div className="relative text-[11px] font-medium uppercase tracking-wide text-slate-300">
      {label}
    </div>
    <div className="relative text-lg font-semibold text-slate-50 sm:text-xl">
      {value}
    </div>
  </div>
);

interface OverviewStatCardProps {
  label: string;
  value: number;
  desc: string;
  color: string;
}

const OverviewStatCard = ({
  label,
  value,
  desc,
  color,
}: OverviewStatCardProps) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/95 p-3.5 shadow-md shadow-black/40 sm:p-4">
    <div
      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${color} opacity-25`}
    />
    <div className="relative text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </div>
    <div className="relative mt-1 text-xl font-semibold text-slate-50">
      {value}
    </div>
    <div className="relative mt-1 text-xs text-slate-400">{desc}</div>
  </div>
);

interface SectionHeaderProps {
  title: string;
  pill?: React.ReactNode;
}

const SectionHeader = ({ title, pill }: SectionHeaderProps) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
    <h2 className="text-base font-semibold text-slate-100 sm:text-lg">
      {title}
    </h2>
    {pill}
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/70 bg-slate-950/80 text-center text-sm text-slate-400">
    {text}
  </div>
);

interface KindToggleProps {
  value: MediaKind;
  onChange: (value: MediaKind) => void;
}

const KindToggle = ({ value, onChange }: KindToggleProps) => (
  <div className="inline-flex items-center rounded-full border border-slate-600/70 bg-slate-900/80 p-1 text-xs text-slate-200">
    <button
      onClick={() => onChange("movie")}
      className={`rounded-full px-2.5 py-1 transition ${
        value === "movie"
          ? "bg-slate-800 text-emerald-300"
          : "text-slate-400 hover:text-slate-100"
      }`}
    >
      Movies
    </button>
    <button
      onClick={() => onChange("tv")}
      className={`rounded-full px-2.5 py-1 transition ${
        value === "tv"
          ? "bg-slate-800 text-emerald-300"
          : "text-slate-400 hover:text-slate-100"
      }`}
    >
      TV
    </button>
  </div>
);

type AnyMediaItem =
  | TMDBMovieListItem
  | TMDBTvListItem
  | TMDBRatedMovieListItem
  | TMDBRatedTvListItem;

interface MediaGridProps {
  items: AnyMediaItem[];
  kind: MediaKind;
  showRatingFromItem?: boolean;
  showRatingFromRatingField?: boolean;
}

const MediaGrid = ({
  items,
  kind,
  showRatingFromItem,
  showRatingFromRatingField,
}: MediaGridProps) => (
  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
    {items.map((item) => (
      <MediaCard
        key={item.id}
        kind={kind}
        item={item}
        rating={
          showRatingFromRatingField && "rating" in item
            ? item.rating
            : showRatingFromItem
            ? undefined
            : undefined
        }
      />
    ))}
  </div>
);

interface MediaCardProps {
  kind: MediaKind;
  item: TMDBMovieListItem | TMDBTvListItem;
  rating?: number;
}

const MediaCard = ({ kind, item, rating }: MediaCardProps) => {
  const title = "title" in item ? item.title : item.name;
  const date = "release_date" in item ? item.release_date : item.first_air_date;
  const poster = item.poster_path;
  const linkTo = kind === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  const score = rating ?? item.vote_average;

  return (
    <Link
      to={linkTo}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/90 shadow-lg shadow-slate-950/70 transition hover:-translate-y-1 hover:border-pink-500/80 hover:shadow-pink-900/40"
    >
      <div className="relative aspect-2/3 overflow-hidden">
        {poster ? (
          <img
            src={`${TMDB_IMAGE_BASE}${poster}`}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-slate-800 via-slate-900 to-black" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-slate-900/95 px-2 py-0.5 text-[11px] text-slate-100 shadow-lg shadow-black/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>{score.toFixed(1)}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-50">
          {title}
        </h3>
        <p className="text-[11px] text-slate-400">{date}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full border border-slate-700/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
            {kind}
          </span>
          {item.vote_count > 0 && (
            <span className="inline-flex items-center rounded-full border border-slate-800/80 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-300">
              {item.vote_count} votes
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
