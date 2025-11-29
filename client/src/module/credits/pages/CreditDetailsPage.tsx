// src/module/credits/pages/CreditDetailsPage.tsx
import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import {
  fetchTMDBCreditDetails,
  clearCreditDetails,
} from "../store/creditDetailsSlice";

const CreditDetailsPage = () => {
  const { creditId } = useParams<{ creditId: string }>();
  const dispatch = useAppDispatch();

  const { data, loading, error } = useAppSelector(
    (state) => state.tmdbCreditDetails
  );

  const tmdbConfig = useAppSelector((state) => state.tmdbConfig.configuration);

  // Base URL cho ảnh
  const imageBaseUrl = useMemo(() => {
    const secureBase = tmdbConfig?.images.secure_base_url;
    return secureBase ? secureBase : "https://image.tmdb.org/t/p/";
  }, [tmdbConfig]);

  const buildImageUrl = (size: string, path: string | null | undefined) => {
    if (!path) return null;
    return `${imageBaseUrl}${size}${path}`;
  };

  useEffect(() => {
    if (creditId) {
      dispatch(fetchTMDBCreditDetails(creditId));
    }

    return () => {
      dispatch(clearCreditDetails());
    };
  }, [creditId, dispatch]);

  if (!creditId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-rose-600 dark:text-rose-300">
        Không có credit_id hợp lệ trong URL.
      </div>
    );
  }

  const person = data?.person;
  const media = data?.media;

  const isCast = data?.credit_type === "cast";

  // Person images
  const personImageSmall = buildImageUrl("w185", person?.profile_path);
  const personImageLarge = buildImageUrl("w342", person?.profile_path);

  // Media images
  // const mediaPosterSmall = buildImageUrl("w185", media?.poster_path);
  const mediaPosterLarge = buildImageUrl("w342", media?.poster_path);
  const mediaBackdropSmall = buildImageUrl("w300", media?.backdrop_path);

  const tmdbMediaUrl =
    media &&
    (media.media_type === "movie"
      ? `https://www.themoviedb.org/movie/${media.id}`
      : `https://www.themoviedb.org/tv/${media.id}`);

  const tmdbPersonUrl =
    person && `https://www.themoviedb.org/person/${person.id}`;

  // Episodes (raw, unknown[]): chỉ hiển thị count
  const episodesCount =
    media?.episodes && Array.isArray(media.episodes)
      ? media.episodes.length
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Credit Details
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Thông tin chi tiết về credit (cast/crew), bao gồm Person và Movie/TV
            liên quan. Tất cả field có dữ liệu từ TMDB đều được hiển thị.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs text-slate-600 dark:text-slate-400 w-60">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            credit_id: {creditId}
          </span>
          {data && (
            <>
              <span className="text-[11px]">
                {data.credit_type.toUpperCase()} · {data.department} ·{" "}
                {data.job}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Loading / Error */}
      {loading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="h-4 w-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          Đang tải credit details…
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-600/40">
          Error: {error}
        </div>
      )}

      {!loading && !data && !error && (
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Không tìm thấy dữ liệu cho credit này.
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Credit meta strip */}
          <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-50">
                    {isCast ? "Cast" : "Crew"}
                  </span>{" "}
                  · {data.department} · {data.job}
                </div>
                {media?.character && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      Character:&nbsp;
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {media.character}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                {/* Person adult */}
                {person && (
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 font-medium " +
                      (person.adult
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300")
                    }
                  >
                    Person: {person.adult ? "Adult" : "Non-adult"}
                  </span>
                )}

                {/* Media adult */}
                {media && (
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 font-medium " +
                      (media.adult
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300")
                    }
                  >
                    Media: {media.adult ? "Adult" : "Non-adult"}
                  </span>
                )}

                {/* Person type (luôn là person) */}
                {person && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Person type: {person.media_type}
                  </span>
                )}

                {/* Media type */}
                {media && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Media type: {media.media_type}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main 2-column layout */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {/* Person Card – dùng hết field TMDBCreditPerson */}
            <section className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
                Person
              </h2>
              {person ? (
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-40 w-32 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                      {personImageLarge ? (
                        <img
                          src={personImageLarge}
                          alt={person.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                          No image
                        </div>
                      )}
                    </div>
                    {personImageSmall && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        Img: w342 (profile_path)
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2 text-xs text-slate-700 dark:text-slate-200">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {person.name}
                      </div>
                      {person.original_name &&
                        person.original_name !== person.name && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Original: {person.original_name}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        Department: {person.known_for_department}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        Popularity: {person.popularity.toFixed(1)}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div>
                        Gender:{" "}
                        {person.gender === 1
                          ? "Female"
                          : person.gender === 2
                          ? "Male"
                          : "Unknown"}
                      </div>
                      <div>Person ID: {person.id}</div>
                      <div>Media type: {person.media_type}</div>
                    </div>

                    <div className="pt-2">
                      <div className="flex flex-wrap gap-2">
                        {tmdbPersonUrl && (
                          <a
                            href={tmdbPersonUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            Xem person trên TMDB
                          </a>
                        )}
                        <Link
                          to={`/person/${person.id}`}
                          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          Mở trang person trong web
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Không có thông tin person cho credit này.
                </p>
              )}
            </section>

            {/* Media Card – dùng hết field TMDBCreditMedia + seasons/episodes */}
            <section className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
                Media
              </h2>
              {media ? (
                <div className="space-y-4">
                  {/* Poster + basic info */}
                  <div className="flex flex-col gap-4 md:flex-row">
                    {/* Poster / backdrop */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-40 w-28 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                        {mediaPosterLarge ? (
                          <img
                            src={mediaPosterLarge}
                            alt={media.name}
                            className="h-full w-full object-cover"
                          />
                        ) : mediaBackdropSmall ? (
                          <img
                            src={mediaBackdropSmall}
                            alt={media.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      {(media.poster_path || media.backdrop_path) && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          Poster/backdrop từ TMDB
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2 text-xs text-slate-700 dark:text-slate-200">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                          {media.name}
                        </div>
                        {media.original_name &&
                          media.original_name !== media.name && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Original: {media.original_name}
                            </div>
                          )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* media_type */}
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {media.media_type === "movie" ? "Movie" : "TV"}
                        </span>

                        {/* original_language */}
                        {media.original_language && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            Lang: {media.original_language.toUpperCase()}
                          </span>
                        )}

                        {/* first_air_date (TV) */}
                        {media.first_air_date && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            First air: {media.first_air_date}
                          </span>
                        )}

                        {/* popularity */}
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          Popularity: {media.popularity.toFixed(1)}
                        </span>

                        {/* vote */}
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          Rating: {media.vote_average.toFixed(1)} (
                          {media.vote_count} votes)
                        </span>
                      </div>

                      {/* origin_country */}
                      {media.origin_country &&
                        media.origin_country.length > 0 && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Country: {media.origin_country.join(", ")}
                          </div>
                        )}

                      {/* genre_ids (raw IDs) */}
                      {media.genre_ids && media.genre_ids.length > 0 && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Genre IDs: {media.genre_ids.join(", ")}
                        </div>
                      )}

                      {/* ID meta */}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Media ID: {media.id}
                      </div>

                      {/* Episodes count (raw, unknown[]) */}
                      {episodesCount > 0 && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Episodes (raw count): {episodesCount}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overview */}
                  {media.overview && (
                    <div className="text-xs text-slate-700 dark:text-slate-200">
                      <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Overview
                      </h3>
                      <p className="text-[13px] leading-relaxed">
                        {media.overview}
                      </p>
                    </div>
                  )}

                  {/* Seasons – dùng hết TMDBCreditMediaSeason */}
                  {media.seasons && media.seasons.length > 0 && (
                    <div className="text-xs text-slate-700 dark:text-slate-200">
                      <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Seasons
                      </h3>
                      <div className="flex flex-col gap-2">
                        {media.seasons.map((season) => {
                          const seasonPoster = buildImageUrl(
                            "w154",
                            season.poster_path
                          );
                          return (
                            <div
                              key={season.id}
                              className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                            >
                              {seasonPoster && (
                                <div className="h-20 w-14 overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
                                  <img
                                    src={seasonPoster}
                                    alt={season.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}

                              <div className="flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <div className="text-[12px] font-semibold">
                                    Season {season.season_number}: {season.name}
                                  </div>
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                                    Episodes: {season.episode_count}
                                  </span>
                                  {season.air_date && (
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                                      Air date: {season.air_date}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  Show ID: {season.show_id} · Season ID:{" "}
                                  {season.id}
                                </div>
                                {season.overview && (
                                  <p className="text-[11px] text-slate-700 dark:text-slate-200 line-clamp-3">
                                    {season.overview}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {tmdbMediaUrl && (
                      <a
                        href={tmdbMediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        Xem media trên TMDB
                      </a>
                    )}
                    <Link
                      to={
                        media.media_type === "movie"
                          ? `/movie/${media.id}`
                          : `/tv/${media.id}`
                      }
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Mở trang media trong web
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Không có thông tin media cho credit này.
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditDetailsPage;
