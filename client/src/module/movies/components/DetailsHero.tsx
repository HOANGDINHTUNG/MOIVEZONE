import { Link } from "react-router-dom";
import Divider from "../../../components/common/ux/Divider";
import { TMDB_IMAGE, type DetailGenre } from "../pages/DetailsPage";
// import { useMemo } from "react";
import {
  BiBookmark,
  BiBookmarkAlt,
  BiHeart,
  BiHeartCircle,
} from "react-icons/bi";
import { TMDB_BACKDROP_LARGE, TMDB_POSTER_MEDIUM } from "../../../constants/tmdbImage";

type ExternalIds = {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
};

type ProductionCompany = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country?: string;
};

export type MovieCollection = {
  id: number;
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
} | null;

export type DetailsHeroProps = {
  imageURL: string;
  posterPath: string | null;
  backdropPath: string | null;

  title: string;
  originalTitle: string;
  tagline: string;
  movieCollection: MovieCollection;
  releaseDateText: string;
  runtimeText: string;
  certification: string;
  genresText: string;

  userScore: number;
  voteCount: number;

  trailerExists: boolean;
  onOpenTrailer: () => void;

  liked: boolean;
  onToggleLike: () => void;

  inWatchlist: boolean;
  onToggleWatchlist: () => void;

  overview: string;
  directorOrCreator: string;
  writer: string;

  // genres từ chi tiết + map từ store
  currentGenres: DetailGenre[];
  activeGenreMap: Record<number, DetailGenre | undefined>;

  externalIds?: ExternalIds;
  productionCompanies: ProductionCompany[];

  resolvedMediaType: "movie" | "tv";
  logoPath?: string | null;
};

const DetailsHero: React.FC<DetailsHeroProps> = ({
  imageURL,
  posterPath,
  backdropPath,
  title,
  originalTitle,
  tagline,
  movieCollection,
  releaseDateText,
  runtimeText,
  certification,
  userScore,
  voteCount,
  trailerExists,
  onOpenTrailer,
  liked,
  onToggleLike,
  inWatchlist,
  onToggleWatchlist,
  overview,
  directorOrCreator,
  writer,
  currentGenres,
  activeGenreMap,
  externalIds,
  productionCompanies,
  resolvedMediaType,
  logoPath,
}) => {
  // const hiResBase = useMemo(() => {
  //   const fallback = "https://image.tmdb.org/t/p/original/";

  //   if (!imageURL) return fallback;

  //   if (imageURL.includes("image.tmdb.org")) {
  //     let base = imageURL.trim();

  //     if (base.includes("/original")) {
  //       return base.endsWith("/") ? base : base + "/";
  //     }

  //     base = base.replace(/\/w\d+\/?/, "/original/");

  //     if (!base.endsWith("/")) base += "/";

  //     return base;
  //   }

  //   return imageURL.endsWith("/") ? imageURL : imageURL + "/";
  // }, [imageURL]);

  const hiResBaseBackdrop = TMDB_BACKDROP_LARGE + "/";
  const hiResBasePoster = TMDB_POSTER_MEDIUM + "/";

  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-neutral-900">
      {/* BACKDROP background */}
      {backdropPath && (
        <div className="absolute inset-0">
          <img
            src={hiResBaseBackdrop + backdropPath}
            alt={title}
            className="h-full w-full object-cover object-center md:object-top"
          />
          {/* overlay sáng hơn */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/40 to-black/40" />
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-5 px-3 py-5 sm:px-4 sm:py-6 md:flex-row md:gap-6 md:px-6 md:py-8 lg:px-10 lg:py-10">
        {/* Poster */}
        <div className="w-full max-w-[260px] self-center sm:self-auto sm:max-w-none md:w-1/3 lg:w-1/4 flex flex-col">
          <div className="w-full rounded-xl bg-neutral-900/80 shadow-[0_20px_45px_rgba(0,0,0,0.75)] ring-1 ring-white/5 overflow-hidden aspect-2/3">
            {posterPath ? (
              <img
                src={hiResBasePoster + posterPath}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                No Image
              </div>
            )}
          </div>

          {logoPath ? (
            <div className="mt-4">
              <img
                src={`${TMDB_IMAGE}/w500${logoPath}`}
                alt={title}
                className="max-h-24 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              />
            </div>
          ) : null}
        </div>

        {/* Main info */}
        <div className="mt-4 w-full space-y-4 text-neutral-50 md:mt-0 md:flex-1">
          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug drop-shadow-lg">
              {title}
            </h1>
            {originalTitle && originalTitle !== title && (
              <p className="mt-1 text-xs md:text-sm text-neutral-300">
                {originalTitle}
              </p>
            )}
          </div>

          {/* Tagline */}
          {tagline && (
            <p className="italic text-xs md:text-sm text-neutral-300">
              “{tagline}”
            </p>
          )}

          {/* Collection (movie only) */}
          {movieCollection && resolvedMediaType === "movie" && (
            <Link
              to={`/collection/${movieCollection.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-red-600/50 px-3 py-1 text-xs md:text-sm text-red-300 ring-1 ring-red-500/40 hover:bg-red-600/25 hover:text-red-200 transition"
            >
              <span>Thuộc series: {movieCollection.name}</span>
              <span className="text-[11px] uppercase tracking-wide">
                Xem toàn bộ →
              </span>
            </Link>
          )}

          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-200/90">
            {releaseDateText && (
              <span className="rounded-full bg-black/40 px-3 py-1">
                {releaseDateText}
              </span>
            )}
            {runtimeText && (
              <span className="rounded-full bg-black/40 px-3 py-1">
                {runtimeText}
              </span>
            )}
            {certification && (
              <span className="rounded-full bg-black/40 px-3 py-1">
                Rating:{" "}
                <Link
                  to="/certifications"
                  className="underline underline-offset-2 text-red-300 hover:text-red-200"
                >
                  {certification}
                </Link>
              </span>
            )}
          </div>

          {/* Genres chips */}
          {currentGenres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] sm:gap-2 md:text-xs">
              {currentGenres.map((g) => {
                const mapped = activeGenreMap[g.id];
                const displayName = mapped?.name || g.name || `#${g.id}`;

                return (
                  <Link
                    key={g.id}
                    to={`/discover?media=${resolvedMediaType}&genre=${g.id}`}
                    className="
                      px-2 py-1 rounded-full
                      bg-white/10 backdrop-blur
                      text-neutral-50
                      hover:bg-red-500 hover:text-white
                      transition-colors
                    "
                  >
                    {displayName}
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Score + actions */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            {/* USER SCORE */}
            {voteCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 rounded-full bg-black/70 border-4 border-emerald-500/90 shadow-[0_0_0_4px_rgba(0,0,0,0.7)] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {userScore}
                      <span className="text-[10px] align-super">%</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-semibold uppercase text-neutral-200 tracking-wide">
                    User Score
                  </span>
                  <span className="text-[11px] text-neutral-300">
                    From {voteCount.toLocaleString()} ratings
                  </span>
                </div>
              </div>
            )}

            {/* Play trailer */}
            {trailerExists && (
              <button
                type="button"
                onClick={onOpenTrailer}
                className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold text-white shadow-lg shadow-red-900/50 hover:bg-red-500 hover:shadow-red-700/70 transition"
              >
                <span className="text-base">▶</span>
                <span>Play Trailer</span>
              </button>
            )}

            {/* What's your vibe */}
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-sky-900/80 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs text-sky-50 hover:bg-sky-700 transition border border-sky-500/40"
            >
              <span className="text-base">😍</span>
              <span>What's your vibe?</span>
            </button>

            <button
              type="button"
              onClick={onToggleWatchlist}
              className={`
                flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full transition
                border 
                ${
                  inWatchlist
                    ? "bg-amber-400 text-black border-amber-600 shadow-lg shadow-amber-800/40 hover:bg-amber-300"
                    : "bg-black/50 text-amber-200 border-amber-500/40 hover:bg-amber-700/40"
                }
              `}
            >
              {inWatchlist ? (
                <BiBookmarkAlt size={20} /> // ICON ACTIVE
              ) : (
                <BiBookmark size={20} /> // ICON NORMAL
              )}
            </button>
            {/* Heart */}
            <button
              type="button"
              onClick={onToggleLike}
              className={`
                flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full transition
                border 
                ${
                  liked
                    ? "bg-red-500 text-white border-red-600 shadow-lg shadow-red-800/40 hover:bg-red-400"
                    : "bg-black/60 text-red-300 border-white/10 hover:bg-black/80"
                }
              `}
            >
              {liked ? (
                <BiHeartCircle size={20} /> // ICON ACTIVE
              ) : (
                <BiHeart size={20} /> // ICON NORMAL
              )}
            </button>
          </div>

          <Divider />

          {/* Overview */}
          {overview && (
            <div>
              <h2 className="font-semibold mb-1 text-sm md:text-base">
                Overview
              </h2>
              <p className="text-sm md:text-[15px] leading-relaxed text-neutral-100/90">
                {overview}
              </p>
            </div>
          )}

          {/* Crew */}
          <div className="grid grid-cols-1 gap-1.5 text-xs text-neutral-200 sm:grid-cols-2 md:text-sm">
            {directorOrCreator && (
              <p>
                <span className="font-semibold">
                  {resolvedMediaType === "movie" ? "Director" : "Created by"}:
                </span>{" "}
                {directorOrCreator}
              </p>
            )}
            {writer && (
              <p>
                <span className="font-semibold">Writer:</span> {writer}
              </p>
            )}
          </div>

          {/* External links */}
          {externalIds && (
            <>
              <Divider />
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                {externalIds.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${externalIds.imdb_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full border border-yellow-500/80 text-yellow-300 hover:bg-yellow-500 hover:text-black transition bg-black/40"
                  >
                    IMDb
                  </a>
                )}
                {externalIds.facebook_id && (
                  <a
                    href={`https://www.facebook.com/${externalIds.facebook_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full border border-blue-600/80 text-blue-300 hover:bg-blue-600 hover:text-white transition bg-black/40"
                  >
                    Facebook
                  </a>
                )}
                {externalIds.instagram_id && (
                  <a
                    href={`https://www.instagram.com/${externalIds.instagram_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full border border-pink-500/80 text-pink-300 hover:bg-pink-500 hover:text-white transition bg-black/40"
                  >
                    Instagram
                  </a>
                )}
                {externalIds.twitter_id && (
                  <a
                    href={`https://twitter.com/${externalIds.twitter_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full border border-sky-500/80 text-sky-300 hover:bg-sky-500 hover:text-white transition bg-black/40"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </>
          )}

          {/* Production Companies */}
          {productionCompanies.length > 0 && (
            <>
              <Divider />
              <div className="mt-2">
                <h2 className="font-semibold mb-2 text-sm md:text-base">
                  Production Companies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {productionCompanies.map((c) => (
                    <Link
                      key={c.id}
                      to={`/company/${c.id}`}
                      className="
                        inline-flex items-center gap-2 rounded-full border border-white/10
                        bg-black/50 px-2.5 py-1 text-[11px] text-neutral-100 transition-colors
                        hover:bg-black/70 sm:text-xs
                      "
                    >
                      {c.logo_path && (
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white">
                          <img
                            src={imageURL + c.logo_path}
                            alt={c.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                      <span>{c.name}</span>
                      {c.origin_country && (
                        <span className="text-[10px] text-neutral-400">
                          ({c.origin_country})
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsHero;
