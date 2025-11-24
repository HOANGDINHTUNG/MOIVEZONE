// src/pages/DetailsPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

import { useFetchDetails } from "../../../hooks/useFetchDetails";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";

import HorizontalScollCard from "../../../components/HorizontalScollCard";
import VideoPlay from "../../../components/VideoPlay";
import Divider from "../../../components/common/ux/Divider";

import type { MovieDetail, MovieSummary } from "../database/interface/movie";
import type { TvDetail, TvSummary } from "../database/interface/tv";
import type {
  MovieVideoItem,
  MovieVideosResponse,
} from "../../../types/interface/movies/videos";

type MediaDetail = MovieDetail | TvDetail;
type MediaSummary = MovieSummary | TvSummary;

// Bổ sung kiểu cho các field append_to_response mà interface gốc chưa có
type DetailWithLists = MediaDetail & {
  similar?: { results: MediaSummary[] };
  recommendations?: { results: MediaSummary[] };
};

type KeywordItem = { id: number; name: string };

type AltTitleItem = { iso_3166_1: string; title: string };

type WatchProviderItem = {
  provider_id: number;
  provider_name: string;
};

type WatchProviderCountry = {
  link?: string;
  flatrate?: WatchProviderItem[];
  rent?: WatchProviderItem[];
  buy?: WatchProviderItem[];
};

type ReviewItem = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details?: { rating?: number | null };
};

type ExternalIds = {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
};

type DetailsPageProps = {
  // Khi dùng route movie/:id, tv/:id thì truyền prop này.
  // Nếu không truyền (route kiểu explore/:explore/:id) thì fallback sang param explore.
  mediaType?: "movie" | "tv";
};

const MoiveDetailsPage: React.FC<DetailsPageProps> = ({ mediaType }) => {
  // Hỗ trợ cả 2 kiểu:
  // - /movie/:id  hoặc /tv/:id  (id param)
  // - /explore/:explore/:id    (explore + id param cũ)
  const { explore, id } = useParams<{ explore?: string; id: string }>();

  // Lấy đúng imageURL, không lấy nguyên slice
  const imageURL = useAppSelector((state) => state.moviesData.imageURL);

  // Toggle "yêu thích" cho trái tim
  const [liked, setLiked] = useState(false);

  // Xác định loại media:
  // - Ưu tiên prop mediaType (route mới movie/:id, tv/:id)
  // - Nếu không có prop thì fallback từ explore param (route cũ explore/:explore/:id)
  const resolvedMediaType: "movie" | "tv" =
    mediaType ?? (explore === "tv" ? "tv" : "movie");

  // Chuẩn bị endpoint: nếu không có id -> endpoint rỗng (hook sẽ không fetch)
  const endpoint = id ? `/${resolvedMediaType}/${id}` : "";

  // HOOK LUÔN ĐƯỢC GỌI, không conditional
  const { data, loading } = useFetchDetails<MediaDetail>(endpoint, {
    append_to_response: [
      "account_states",
      "alternative_titles",
      "changes",
      "credits",
      "external_ids",
      "images",
      "keywords",
      "lists",
      "release_dates",
      "reviews",
      "translations",
      "videos",
      "watch/providers",
      "similar",
      "recommendations",
    ].join(","),
  });

  const title = useMemo(() => {
    if (!data) return "";
    if ("title" in data) return data.title;
    if ("name" in data) return data.name;
    return "";
  }, [data]);

  const originalTitle = useMemo(() => {
    if (!data) return "";
    if ("original_title" in data) return data.original_title;
    if ("original_name" in data) return data.original_name;
    return "";
  }, [data]);

  const overview = data?.overview ?? "";

  const posterPath = data?.poster_path ?? data?.backdrop_path ?? null;

  const releaseDate = useMemo(() => {
    if (!data) return "";
    if ("release_date" in data && data.release_date) return data.release_date;
    if ("first_air_date" in data && data.first_air_date)
      return data.first_air_date;
    return "";
  }, [data]);

  const releaseDateText = useMemo(() => {
    if (!releaseDate) return "";
    return moment(releaseDate).format("MMMM Do YYYY");
  }, [releaseDate]);

  const genresText = useMemo(() => {
    if (!data) return "";
    const genres = "genres" in data ? data.genres : [];
    if (!genres?.length) return "";
    return genres.map((g) => g.name).join(", ");
  }, [data]);

  const runtimeText = useMemo(() => {
    if (!data) return "";
    if ("runtime" in data && data.runtime) {
      const hours = Math.floor(data.runtime / 60);
      const mins = data.runtime % 60;
      return `${hours}h ${mins}m`;
    }

    if ("episode_run_time" in data && data.episode_run_time?.length) {
      const m = data.episode_run_time[0];
      return `${m}m / episode`;
    }
    return "";
  }, [data]);

  const rating = data?.vote_average ?? 0;
  const voteCount = data?.vote_count ?? 0;
  const userScore = Math.round(rating * 10);

  const tagline = data?.tagline ?? "";

  const credits = data?.credits;

  const directorOrCreator = useMemo(() => {
    if (!data) return "";
    if (resolvedMediaType === "movie") {
      const crew = credits?.crew ?? [];
      const directors = crew.filter((c) => c.job === "Director");
      if (!directors.length) return "";
      return directors.map((d) => d.name).join(", ");
    } else {
      const tvData = data as TvDetail;
      const createdBy = tvData.created_by ?? [];
      if (!createdBy.length) return "";
      return createdBy.map((c) => c.name).join(", ");
    }
  }, [credits, data, resolvedMediaType]);

  const writer = useMemo(() => {
    const crew = credits?.crew ?? [];
    const writers = crew.filter(
      (c) => c.job === "Writer" || c.job === "Screenplay"
    );
    if (!writers.length) return "";
    return writers.map((w) => w.name).join(", ");
  }, [credits]);

  const starCast = useMemo(() => {
    return credits?.cast?.slice(0, 8) ?? [];
  }, [credits]);

  // ===== VIDEO: lấy list video + chọn trailer đúng kiểu =====
  const videos = useMemo<MovieVideoItem[]>(() => {
    if (!data) return [];
    const anyData = data;
    if (!anyData.videos || !anyData.videos.results) return [];
    const raw = (anyData.videos as MovieVideosResponse).results ?? [];
    return raw;
  }, [data]);

  // Chọn trailer ưu tiên: Official Trailer (YouTube) > Trailer (YouTube) > Teaser (YouTube) > bất kỳ YouTube
  const trailer = useMemo<MovieVideoItem | null>(() => {
    if (!videos.length) return null;

    const officialTrailer = videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official === true
    );
    if (officialTrailer) return officialTrailer;

    const anyTrailer = videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );
    if (anyTrailer) return anyTrailer;

    const teaser = videos.find(
      (v) => v.site === "YouTube" && v.type === "Teaser"
    );
    if (teaser) return teaser;

    const anyYoutube = videos.find((v) => v.site === "YouTube");
    return anyYoutube ?? null;
  }, [videos]);

  // ==== SIMILAR & RECOMMENDATIONS – SAFE ====
  const detailWithLists = (data ?? undefined) as DetailWithLists | undefined;

  const similarList = detailWithLists?.similar?.results ?? [];

  const recommendationList = detailWithLists?.recommendations?.results ?? [];

  const certification = useMemo(() => {
    if (!data || resolvedMediaType !== "movie") return "";
    const movieData = data as MovieDetail;
    const results = movieData.release_dates?.results ?? [];
    if (!results.length) return "";
    const preferred =
      results.find((r) => r.iso_3166_1 === "US") ||
      results.find((r) => r.iso_3166_1 === "VN") ||
      results[0];

    const rel = preferred.release_dates.find((r) => r.certification);
    return rel?.certification ?? "";
  }, [data, resolvedMediaType]);

  const keywords = useMemo<KeywordItem[]>(() => {
    if (!data?.keywords) return [];
    const raw = (data.keywords as { keywords?: KeywordItem[] }).keywords ?? [];
    return raw;
  }, [data]);

  const alternativeTitles = useMemo<AltTitleItem[]>(() => {
    if (!data?.alternative_titles) return [];
    const raw =
      (
        data.alternative_titles as {
          titles?: AltTitleItem[];
        }
      ).titles ?? [];
    return raw;
  }, [data]);

  const watchProviders = useMemo<
    Record<string, WatchProviderCountry> | undefined
  >(() => {
    if (!data?.["watch/providers"]) return undefined;
    return data["watch/providers"].results as Record<
      string,
      WatchProviderCountry
    >;
  }, [data]);

  const reviews = useMemo<ReviewItem[]>(() => {
    if (!data?.reviews) return [];
    const raw = (data.reviews as { results?: ReviewItem[] }).results ?? [];
    return raw;
  }, [data]);

  const externalIds = useMemo<ExternalIds | undefined>(() => {
    if (!data?.external_ids) return undefined;
    return data.external_ids as ExternalIds;
  }, [data]);

  if (loading || !data) {
    return (
      <section className="max-w-6xl mx-auto px-3 py-6">
        <p>Đang tải chi tiết...</p>
      </section>
    );
  }

  // Nếu không có id thì coi như route lỗi
  if (!id) {
    return (
      <section className="max-w-6xl mx-auto px-3 py-6">
        <p>Không tìm thấy nội dung.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-3 py-6">
      {/* Top info */}
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
                <p>Rating: {certification}</p>
              </>
            )}
            {genresText && (
              <>
                <span>|</span>
                <p>{genresText}</p>
              </>
            )}
          </div>

          {/* User Score + vibe + heart */}
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

            {/* PLAY TRAILER BUTTON – chỉ hiện nếu có trailer */}
            {trailer && (
              <a
                href="#trailer"
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-xs text-white hover:bg-red-700 transition"
              >
                <span className="text-base">▶</span>
                <span>Play Trailer</span>
              </a>
            )}

            {/* WHAT'S YOUR VIBE */}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900 text-xs text-white hover:bg-sky-800 transition"
            >
              <span className="text-base">😍</span>
              <span>What's your vibe?</span>
            </button>

            {/* HEART TOGGLE */}
            <button
              type="button"
              onClick={() => setLiked((prev) => !prev)}
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

          {overview && (
            <div>
              <h2 className="font-semibold mb-1 text-sm md:text-base">
                Overview
              </h2>
              <p className="text-sm text-neutral-200">{overview}</p>
            </div>
          )}

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
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <>
          <Divider />
          <div className="mt-4">
            <h2 className="font-semibold mb-1 text-sm md:text-base">Trailer</h2>
            <p className="text-xs text-neutral-400 mb-2">{trailer.name}</p>
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
              <VideoPlay videoId={trailer.key} />
            </div>
          </div>
        </>
      )}

      {/* Cast */}
      {starCast.length > 0 && (
        <>
          <Divider />
          <div className="mt-4">
            <h2 className="font-semibold mb-2 text-sm md:text-base">
              Top Cast
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {starCast.map((cast) => (
                <div
                  key={cast.cast_id ?? `${cast.credit_id}-${cast.id}`}
                  className="w-24 shrink-0"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-800 mb-1">
                    {cast.profile_path ? (
                      <img
                        src={imageURL + cast.profile_path}
                        alt={cast.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold line-clamp-2">
                    {cast.name}
                  </p>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {cast.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Keywords */}
      {keywords.length > 0 && (
        <>
          <Divider />
          <div className="mt-4">
            <h2 className="font-semibold mb-2 text-sm md:text-base">
              Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span
                  key={k.id}
                  className="px-2 py-1 text-xs rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
                >
                  {k.name}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Alternative titles */}
      {alternativeTitles.length > 0 && (
        <>
          <Divider />
          <div className="mt-4 text-sm">
            <h2 className="font-semibold mb-2 text-sm md:text-base">
              Also known as
            </h2>
            <div className="flex flex-wrap gap-2">
              {alternativeTitles.slice(0, 8).map((t) => (
                <span
                  key={`${t.iso_3166_1}-${t.title}`}
                  className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800"
                >
                  <span className="font-semibold">{t.iso_3166_1}</span>
                  {": "}
                  {t.title}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Where to watch */}
      {watchProviders && (
        <>
          <Divider />
          <div className="mt-4">
            <h2 className="font-semibold mb-2 text-sm md:text-base">
              Where to watch
            </h2>
            <div className="space-y-2 text-sm">
              {["VN", "US", "GB"].map((country) => {
                const opt = watchProviders[country];
                if (!opt) return null;
                return (
                  <div key={country}>
                    <p className="font-semibold mb-1">{country}</p>
                    {opt.flatrate && (
                      <p>
                        Subscription:{" "}
                        {opt.flatrate.map((p) => p.provider_name).join(", ")}
                      </p>
                    )}
                    {opt.rent && (
                      <p>
                        Rent: {opt.rent.map((p) => p.provider_name).join(", ")}
                      </p>
                    )}
                    {opt.buy && (
                      <p>
                        Buy: {opt.buy.map((p) => p.provider_name).join(", ")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <>
          <Divider />
          <div className="mt-4">
            <h2 className="font-semibold mb-2 text-sm md:text-base">Reviews</h2>
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="p-3 rounded bg-neutral-100 dark:bg-neutral-800 text-sm"
                >
                  <p className="font-semibold">
                    {review.author}{" "}
                    {review.author_details?.rating != null &&
                      `– ${review.author_details.rating}/10`}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {moment(review.created_at).format("YYYY-MM-DD")}
                  </p>
                  <p className="mt-1 line-clamp-4">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Similar */}
      {similarList && similarList.length > 0 && (
        <>
          <Divider />
          <div className="mt-4">
            <HorizontalScollCard
              heading={
                resolvedMediaType === "movie"
                  ? "Similar Movies"
                  : "Similar TV Shows"
              }
              data={similarList}
              media_type={resolvedMediaType}
            />
          </div>
        </>
      )}

      {/* Recommendations */}
      {recommendationList && recommendationList.length > 0 && (
        <>
          <Divider />
          <div className="mt-4 mb-4">
            <HorizontalScollCard
              heading={
                resolvedMediaType === "movie"
                  ? "Recommended Movies"
                  : "Recommended TV Shows"
              }
              data={recommendationList}
              media_type={resolvedMediaType}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default MoiveDetailsPage;
