// src/pages/DetailsHero.tsx
import { Link } from "react-router-dom";
import Divider from "../../../components/common/ux/Divider";
import type { DetailGenre } from "../pages/MoiveDetailsPage";

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

type MovieCollection = {
  id: number;
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
} | null;

type DetailsHeroProps = {
  imageURL: string;
  posterPath: string | null;
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

  overview: string;
  directorOrCreator: string;
  writer: string;

  // 🟢 genres từ chi tiết + map từ store
  currentGenres: DetailGenre[];
  activeGenreMap: Record<number, DetailGenre | undefined>;

  externalIds?: ExternalIds;
  productionCompanies: ProductionCompany[];

  resolvedMediaType: "movie" | "tv";
};

const DetailsHero: React.FC<DetailsHeroProps> = ({
  imageURL,
  posterPath,
  title,
  originalTitle,
  tagline,
  movieCollection,
  releaseDateText,
  runtimeText,
  certification,
  genresText,
  userScore,
  voteCount,
  trailerExists,
  onOpenTrailer,
  liked,
  onToggleLike,
  overview,
  directorOrCreator,
  writer,
  currentGenres,
  activeGenreMap,
  externalIds,
  productionCompanies,
  resolvedMediaType,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Poster */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <div className="w-full aspect-2/3 rounded-lg overflow-hidden bg-neutral-800">
          {posterPath ? (
            <img
              src={imageURL + posterPath}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* Main info */}
      <div className="w-full md:flex-1 space-y-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          {originalTitle && originalTitle !== title && (
            <p className="text-sm text-neutral-400">{originalTitle}</p>
          )}
        </div>

        {tagline && (
          <p className="italic text-sm text-neutral-400">“{tagline}”</p>
        )}

        {/* Collection (movie only) */}
        {movieCollection && resolvedMediaType === "movie" && (
          <Link
            to={`/collection/${movieCollection.id}`}
            className="mt-1 inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <span>Thuộc series: {movieCollection.name}</span>
            <span className="text-xs">Xem toàn bộ bộ sưu tập →</span>
          </Link>
        )}

        {/* Meta line */}
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-300">
          {releaseDateText && <p>{releaseDateText}</p>}
          {runtimeText && (
            <>
              <span>|</span>
              <p>{runtimeText}</p>
            </>
          )}
          {certification && (
            <>
              <span>|</span>
              <p>
                Rating:{" "}
                <Link
                  to="/certifications"
                  className="underline underline-offset-2 text-red-400 hover:text-red-300"
                >
                  {certification}
                </Link>
              </p>
            </>
          )}

          {genresText && (
            <>
              <span>|</span>
              <p>Genres: {genresText}</p>
            </>
          )}
        </div>

        {/* Genres chips – dùng dữ liệu từ /genre/movie|tv/list + chi tiết */}
        {currentGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs mt-1">
            {currentGenres.map((g) => {
              const mapped = activeGenreMap[g.id];
              const displayName = mapped?.name || g.name || `#${g.id}`;

              return (
                <Link
                  key={g.id}
                  to={`/discover?media=${resolvedMediaType}&genre=${g.id}`}
                  className="
                      px-2 py-1 rounded-full
                      bg-neutral-200 dark:bg-neutral-800
                      text-neutral-800 dark:text-neutral-100
                      hover:bg-red-500 hover:text-white
                      dark:hover:bg-red-500 dark:hover:text-white
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
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
          {/* USER SCORE */}
          {voteCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full bg-black/70 border-4 border-green-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {userScore}
                    <span className="text-[10px] align-super">%</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold uppercase text-neutral-200">
                  User Score
                </span>
                <span className="text-[11px] text-neutral-400">
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
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-xs text-white hover:bg-red-700 transition"
            >
              <span className="text-base">▶</span>
              <span>Play Trailer</span>
            </button>
          )}

          {/* What's your vibe */}
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900 text-xs text-white hover:bg-sky-800 transition"
          >
            <span className="text-base">😍</span>
            <span>What's your vibe?</span>
          </button>

          {/* Heart */}
          <button
            type="button"
            onClick={onToggleLike}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
            aria-label="Add to favorites"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill={liked ? "#f87171" : "none"}
              stroke={liked ? "#f87171" : "currentColor"}
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.1 4.44 12 4.55l-.1-.11A5.25 5.25 0 0 0 3.75 9.3c0 1.38.56 2.63 1.46 3.54l5.96 6.02c.23.23.54.36.86.36s.63-.13.86-.36l5.96-6.02a5.01 5.01 0 0 0 1.46-3.54A5.25 5.25 0 0 0 12.1 4.44Z"
              />
            </svg>
          </button>
        </div>

        <Divider />

        {/* Overview */}
        {overview && (
          <div>
            <h2 className="font-semibold mb-1 text-sm md:text-base">
              Overview
            </h2>
            <p className="text-sm text-neutral-200">{overview}</p>
          </div>
        )}

        {/* Crew */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-neutral-300">
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
            <div className="flex flex-wrap gap-2 text-xs mt-1">
              {externalIds.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${externalIds.imdb_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                >
                  IMDb
                </a>
              )}
              {externalIds.facebook_id && (
                <a
                  href={`https://www.facebook.com/${externalIds.facebook_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white"
                >
                  Facebook
                </a>
              )}
              {externalIds.instagram_id && (
                <a
                  href={`https://www.instagram.com/${externalIds.instagram_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                >
                  Instagram
                </a>
              )}
              {externalIds.twitter_id && (
                <a
                  href={`https://twitter.com/${externalIds.twitter_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
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
            <div className="mt-4">
              <h2 className="font-semibold mb-2 text-sm md:text-base">
                Production Companies
              </h2>
              <div className="flex flex-wrap gap-2">
                {productionCompanies.map((c) => (
                  <Link
                    key={c.id}
                    to={`/company/${c.id}`}
                    className="
                      inline-flex items-center gap-2 px-2 py-1 rounded-full
                      bg-neutral-200 dark:bg-neutral-800
                      hover:bg-neutral-300 dark:hover:bg-neutral-700
                      text-xs text-neutral-800 dark:text-neutral-100
                      border border-neutral-300 dark:border-neutral-700
                      transition-colors
                    "
                  >
                    {c.logo_path && (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-white">
                        <img
                          src={imageURL + c.logo_path}
                          alt={c.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <span>{c.name}</span>
                    {c.origin_country && (
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
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
  );
};

export default DetailsHero;
