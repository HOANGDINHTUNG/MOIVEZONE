import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import { selectAuth } from "../store/authSlice";
import type { IUserMediaItem } from "../database/interface/users";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

const UserLibraryPage = () => {
  const { currentUser } = useAppSelector(selectAuth);

  const favorites = useMemo(
    () =>
      [...(currentUser?.favorites || [])].sort((a, b) =>
        b.addedAt.localeCompare(a.addedAt)
      ),
    [currentUser] 
  );

  const watchlist = useMemo(
    () =>
      [...(currentUser?.watchlist || [])].sort((a, b) =>
        b.addedAt.localeCompare(a.addedAt)
      ),
    [currentUser]
  );

  const history = useMemo(
    () =>
      [...(currentUser?.history || [])].sort((a, b) =>
        b.addedAt.localeCompare(a.addedAt)
      ),
    [currentUser]
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        Bạn cần đăng nhập để xem thư viện cá nhân.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,#1e293b_0,#020617_60%,#000000_100%)] px-3 py-5 text-slate-50 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        {/* HEADER */}
        <header className="rounded-3xl border border-slate-800/70 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.9)] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-600 bg-linear-to-br from-emerald-400 via-rose-500 to-indigo-500 text-xl font-bold text-white sm:h-16 sm:w-16">
              {(currentUser.username[0] || "?").toUpperCase()}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold sm:text-2xl">
                {currentUser.username}
              </h1>
              <p className="text-sm text-slate-300">{currentUser.email}</p>
              <p className="text-xs text-slate-500">
                Tham gia từ{" "}
                {new Date(currentUser.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:w-80">
            <MiniStat
              label="Favorites"
              value={favorites.length}
              gradient="from-pink-500/60 via-rose-500/40 to-purple-500/20"
            />
            <MiniStat
              label="Watchlist"
              value={watchlist.length}
              gradient="from-cyan-500/60 via-sky-500/40 to-indigo-500/20"
            />
            <MiniStat
              label="History"
              value={history.length}
              gradient="from-emerald-500/60 via-lime-500/40 to-sky-500/20"
            />
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="space-y-5">
          <SectionBlock
            title="Favorites"
            subtitle="Những phim & series bạn yêu thích nhất"
          >
            {favorites.length === 0 ? (
              <EmptyState text="Chưa có gì trong Favorites. Hãy bấm trái tim ở trang chi tiết để thêm." />
            ) : (
              <MediaGrid items={favorites} />
            )}
          </SectionBlock>

          <SectionBlock
            title="Watchlist"
            subtitle="Danh sách những phim bạn muốn xem"
          >
            {watchlist.length === 0 ? (
              <EmptyState text="Watchlist đang trống. Thêm film bạn muốn xem sau." />
            ) : (
              <MediaGrid items={watchlist} />
            )}
          </SectionBlock>

          <SectionBlock title="History" subtitle="Gần đây bạn đã xem những gì?">
            {history.length === 0 ? (
              <EmptyState text="Bạn chưa xem gì gần đây." />
            ) : (
              <MediaGrid items={history} />
            )}
          </SectionBlock>
        </main>
      </div>
    </div>
  );
};

export default UserLibraryPage;

/* --------- Sub components --------- */

const MiniStat = ({
  label,
  value,
  gradient,
}: {
  label: string;
  value: number;
  gradient: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/90 px-3 py-2 text-right shadow-md shadow-black/40">
    <div
      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${gradient} opacity-30`}
    />
    <div className="relative text-[11px] font-medium uppercase tracking-wide text-slate-300">
      {label}
    </div>
    <div className="relative text-lg font-semibold text-slate-50">{value}</div>
  </div>
);

const SectionBlock = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-3xl border border-slate-800/80 bg-slate-950/95 shadow-[0_24px_80px_rgba(15,23,42,0.95)] p-4 sm:p-5">
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
      <div>
        <h2 className="text-base font-semibold sm:text-lg text-slate-50">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-400">{subtitle}</p>
        )}
      </div>
    </div>
    {children}
  </section>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/70 bg-slate-950/80 text-center text-sm text-slate-400">
    {text}
  </div>
);

const MediaGrid = ({ items }: { items: IUserMediaItem[] }) => (
  <div className="grid gap-3 grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    {items.map((item) => (
      <MediaCard
        key={`${item.mediaType}-${item.id}-${item.addedAt}`}
        item={item}
      />
    ))}
  </div>
);

const MediaCard = ({ item }: { item: IUserMediaItem }) => {
  const linkTo =
    item.mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <Link
      to={linkTo}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/90 shadow-lg shadow-slate-950/70 transition hover:-translate-y-1 hover:border-pink-500/80 hover:shadow-pink-900/40"
    >
      <div className="relative aspect-2/3 overflow-hidden">
        {item.posterPath ? (
          <img
            src={`${TMDB_IMAGE_BASE}${item.posterPath}`}
            alt={item.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-slate-800 via-slate-900 to-black" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-slate-900/95 px-2 py-0.5 text-[11px] text-slate-100 shadow-lg shadow-black/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>{item.voteAverage.toFixed(1)}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-2">
        <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-slate-50">
          {item.title}
        </h3>
        <p className="text-[10px] sm:text-[11px] text-slate-400">
          {item.releaseDate}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full border border-slate-700/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
            {item.mediaType}
          </span>
          {item.voteCount > 0 && (
            <span className="inline-flex items-center rounded-full border border-slate-800/80 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-300">
              {item.voteCount} votes
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
