import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import { useFetchDetails } from "../../../hooks/useFetchDetails";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";

import DetailsHero, { type MovieCollection } from "../components/DetailsHero";
import DetailsTopCastSection from "../components/DetailsTopCastSection";
import DetailsKeywordsSection from "../components/DetailsKeywordsSection";
import DetailsWatchProvidersSection from "../components/DetailsWatchProvidersSection";
import DetailsReviewsSection from "../components/DetailsReviewsSection";
import DetailsRelatedSection from "../components/DetailsRelatedSection";
import DetailsAlternativeTitlesSection from "../components/DetailsAlternativeTitlesSection";
import DetailsNetworksSection from "../components/DetailsNetworksSection";
import DetailsSeasonsSection from "../components/DetailsSeasonsSection";
import DetailsEpisodeGroupsSection from "../components/DetailsEpisodeGroupsSection";

// Các section mới
import DetailsFactsSection from "../components/DetailsFactsSection";
import DetailsImagesSection from "../components/DetailsImagesSection";
import DetailsVideosSection from "../components/DetailsVideosSection";
import DetailsListsSection from "../components/DetailsListsSection";
import DetailsTranslationsSection from "../components/DetailsTranslationsSection";
import DetailsChangeLogSection from "../components/DetailsChangeLogSection";

import { fetchTMDBGenres } from "../store/genresSlice";

// ===== MOVIE TYPES =====
import type {
  TMDBMovieDetailsResponse,
  TMDBMovieSummary,
  TMDBMovieAccountStatesResponse,
  TMDBMovieAlternativeTitlesResponse,
  TMDBMovieChangesResponse,
  TMDBMovieCreditsResponse,
  TMDBMovieExternalIdsResponse,
  TMDBMovieImagesResponse,
  TMDBMovieKeywordsResponse,
  TMDBMovieListsResponse,
  TMDBMovieReleaseDatesResponse,
  TMDBMovieReviewsResponse,
  TMDBMovieTranslationsResponse,
  TMDBMovieVideosResponse,
  TMDBMovieWatchProvidersResponse,
  TMDBMovieKeyword,
  TMDBMovieAlternativeTitle,
  TMDBMovieReview,
  TMDBMovieVideo,
  TMDBMovieSimilarResponse,
  TMDBMovieRecommendationsResponse,
  TMDBGenre,
  TMDBProductionCompany,
  TMDBMovieReleaseDatesByCountry,
  TMDBListSummary,
} from "../database/interface/movie";

// ===== TV TYPES =====
import type {
  TMDBTvDetailsResponse,
  TMDBTvAccountStatesResponse,
  TMDBTvAggregateCreditsResponse,
  TMDBTvAlternativeTitlesResponse,
  TMDBTvChangesResponse,
  TMDBTvContentRatingsResponse,
  TMDBTvCreditsResponse,
  TMDBTvEpisodeGroupsResponse,
  TMDBTvExternalIdsResponse,
  TMDBTvImagesResponse,
  TMDBTvKeywordsResponse,
  TMDBTvListsResponse,
  TMDBTvRecommendationsResponse,
  TMDBTvReviewsResponse,
  TMDBTvScreenedTheatricallyResponse,
  TMDBTvSimilarResponse,
  TMDBTvTranslationsResponse,
  TMDBTvVideosResponse,
  TMDBTvWatchProvidersResponse,
  TMDBTvKeyword,
  TMDBTvAlternativeTitleItem,
  TMDBTvReview,
  TMDBTvVideoItem,
  TMDBTvCast,
  TMDBTvNetwork,
  TMDBTvSimilarItem,
  TMDBTvRecommendationItem,
  TMDBTvSeasonSummary as TMDBTvSeasonSummaryOfficial,
  TMDBTvEpisodeGroupNetwork,
  TMDBTvChangesItem,
  TMDBTvChangesItemValue,
  TMDBTvListSummary,
  TMDBWatchProviderRegion,
} from "../database/interface/tv";
import { selectAuth, setCurrentUser } from "../../auth/store/authSlice";
import { updateUserDirect } from "../../../api/server/User.api";
import { buildUserMediaItem } from "../../auth/feature/utils/buildUserMediaItem";
import VideoPlay from "../../../components/home/VideoPlay";

export const TMDB_IMAGE = "https://image.tmdb.org/t/p";

// =======================
// Kiểu dùng trong trang
// =======================

type MovieDetailsWithAppend = TMDBMovieDetailsResponse & {
  account_states?: TMDBMovieAccountStatesResponse;
  alternative_titles?: TMDBMovieAlternativeTitlesResponse;
  changes?: TMDBMovieChangesResponse;
  credits?: TMDBMovieCreditsResponse;
  external_ids?: TMDBMovieExternalIdsResponse;
  images?: TMDBMovieImagesResponse;
  keywords?: TMDBMovieKeywordsResponse;
  lists?: TMDBMovieListsResponse;
  release_dates?: TMDBMovieReleaseDatesResponse;
  reviews?: TMDBMovieReviewsResponse;
  translations?: TMDBMovieTranslationsResponse;
  videos?: TMDBMovieVideosResponse;
  "watch/providers"?: TMDBMovieWatchProvidersResponse;
  similar?: TMDBMovieSimilarResponse;
  recommendations?: TMDBMovieRecommendationsResponse;
};

type TvDetailsWithAppend = TMDBTvDetailsResponse & {
  account_states?: TMDBTvAccountStatesResponse;
  aggregate_credits?: TMDBTvAggregateCreditsResponse;
  alternative_titles?: TMDBTvAlternativeTitlesResponse;
  changes?: TMDBTvChangesResponse;
  content_ratings?: TMDBTvContentRatingsResponse;
  credits?: TMDBTvCreditsResponse;
  episode_groups?: TMDBTvEpisodeGroupsResponse;
  external_ids?: TMDBTvExternalIdsResponse;
  images?: TMDBTvImagesResponse;
  keywords?: TMDBTvKeywordsResponse;
  lists?: TMDBTvListsResponse;
  recommendations?: TMDBTvRecommendationsResponse;
  reviews?: TMDBTvReviewsResponse;
  screened_theatrically?: TMDBTvScreenedTheatricallyResponse;
  similar?: TMDBTvSimilarResponse;
  translations?: TMDBTvTranslationsResponse;
  videos?: TMDBTvVideosResponse;
  "watch/providers"?: TMDBTvWatchProvidersResponse;
};

type MediaDetail = MovieDetailsWithAppend | TvDetailsWithAppend;

type MediaSummary =
  | TMDBMovieSummary
  | TMDBTvSimilarItem
  | TMDBTvRecommendationItem;

type KeywordItem = TMDBMovieKeyword | TMDBTvKeyword;
type AltTitleItem = TMDBMovieAlternativeTitle | TMDBTvAlternativeTitleItem;
type ReviewItem = TMDBMovieReview | TMDBTvReview;
export type DetailVideoItem = TMDBMovieVideo | TMDBTvVideoItem;

type ExternalIds = TMDBMovieExternalIdsResponse | TMDBTvExternalIdsResponse;

type DetailsPageProps = {
  mediaType?: "movie" | "tv";
};

type TvSeasonSummary = TMDBTvSeasonSummaryOfficial;

// dùng cho Episode Groups
export type TvEpisodeGroupSummary = {
  id: string;
  name: string;
  order: number;
  episode_count: number;
  group_count: number;
  type: number;
  network?: TMDBTvEpisodeGroupNetwork | null;
};

export type DetailGenre = TMDBGenre;

export type TvNetworkSummary = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};

type UnifiedCastItem = {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id?: number;
  character: string;
  credit_id: string;
  order: number;
};

type MediaAccountStates =
  | TMDBMovieAccountStatesResponse
  | TMDBTvAccountStatesResponse;

type MediaImages = TMDBMovieImagesResponse | TMDBTvImagesResponse;

type UnifiedListItem = TMDBListSummary | TMDBTvListSummary;

type MediaTranslationSummary = {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
};

type MediaChangeSummary = {
  key: string;
  action: string;
  time: string;
};

type MediaFacts = {
  status?: string;
  originalLanguage?: string;
  spokenLanguages?: string[];
  productionCountries?: string[];
  budget?: number | null;
  revenue?: number | null;
  inProduction?: boolean;
  numberOfSeasons?: number | null;
  numberOfEpisodes?: number | null;
  lastAirDate?: string | null;
  nextEpisodeName?: string | null;
};

type TMDBTvDetailsWithNextEpisode = TMDBTvDetailsResponse & {
  next_episode_to_air?: {
    id: number;
    name: string;
    overview: string;
    air_date: string;
    episode_number: number;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  } | null;
};

const DetailsPage: FC<DetailsPageProps> = ({ mediaType }) => {
  const { explore, id } = useParams<{ explore?: string; id: string }>();

  const imageURL = useAppSelector((state) => state.moviesData.imageURL);
  const genresState = useAppSelector((state) => state.tmdbGenres);
  const { currentUser } = useAppSelector(selectAuth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);

  const activeGenreMap =
    (mediaType ?? explore) === "tv" ? genresState.tvMap : genresState.movieMap;

  // load genres nếu chưa có
  useEffect(() => {
    if (!genresState.loaded && !genresState.loading) {
      dispatch(fetchTMDBGenres());
    }
  }, [genresState.loaded, genresState.loading, dispatch]);

  const resolvedMediaType: "movie" | "tv" =
    mediaType ?? (explore === "tv" ? "tv" : "movie");

  const endpoint = id ? `/${resolvedMediaType}/${id}` : "";

  // append_to_response tùy loại
  const appendParts: string[] = [
    "account_states",
    "alternative_titles",
    "changes",
    "credits",
    "external_ids",
    "images",
    "keywords",
    "lists",
    "reviews",
    "translations",
    "videos",
    "watch/providers",
    "similar",
    "recommendations",
  ];

  if (resolvedMediaType === "movie") {
    appendParts.push("release_dates");
  }

  if (resolvedMediaType === "tv") {
    appendParts.push("episode_groups", "content_ratings");
  }

  const { data, loading } = useFetchDetails<MediaDetail>(endpoint, {
    append_to_response: appendParts.join(","),
  });

  useEffect(() => {
    if (!currentUser || !data) return;

    const list = currentUser.history || [];

    // Nếu phần tử đầu tiên đã là film hiện tại → khỏi update nữa
    if (
      list.length > 0 &&
      list[0].id === data.id &&
      list[0].mediaType === resolvedMediaType
    ) {
      return;
    }

    const newItem = buildUserMediaItem(resolvedMediaType, data);

    // Bỏ bản cũ của film này trong history
    const rest = list.filter(
      (item) => !(item.id === data.id && item.mediaType === resolvedMediaType)
    );

    // Đưa lên đầu, giới hạn lịch sử (vd: 50 item)
    const MAX_HISTORY = 50;
    const nextHistory = [newItem, ...rest].slice(0, MAX_HISTORY);

    (async () => {
      try {
        const updatedUser = await updateUserDirect({
          id: currentUser.id,
          history: nextHistory,
        });

        dispatch(setCurrentUser(updatedUser));
      } catch (error) {
        console.error("Failed to update history", error);
      }
    })();
  }, [currentUser, data, resolvedMediaType, dispatch]);

  const isMovie = useCallback(
    (d: MediaDetail): d is MovieDetailsWithAppend =>
      "title" in d && "release_date" in d,
    []
  );

  const isTv = useCallback(
    (d: MediaDetail): d is TvDetailsWithAppend =>
      "name" in d && "first_air_date" in d,
    []
  );

  // ========== Các field cơ bản ==========
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
  const posterPath = data?.poster_path ?? null;
  const backdropPath = data?.backdrop_path ?? null;

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
    return genres.map((g: TMDBGenre) => g.name).join(", ");
  }, [data]);

  const runtimeText = useMemo(() => {
    if (!data) return "";

    if (isMovie(data) && data.runtime) {
      const hours = Math.floor(data.runtime / 60);
      const mins = data.runtime % 60;
      return `${hours}h ${mins}m`;
    }

    if (isTv(data) && data.episode_run_time?.length) {
      const m = data.episode_run_time[0];
      return `${m}m / episode`;
    }
    return "";
  }, [data, isMovie, isTv]);

  const rating = data?.vote_average ?? 0;
  const voteCount = data?.vote_count ?? 0;
  const userScore = Math.round(rating * 10);
  const tagline = data?.tagline ?? "";

  // ========== Credits / Director / Writer ==========
  const credits = data && "credits" in data ? data.credits : undefined;

  const directorOrCreator = useMemo(() => {
    if (!data) return "";

    if (isMovie(data)) {
      const mCredits = data.credits as TMDBMovieCreditsResponse | undefined;
      const crew = mCredits?.crew ?? [];
      const directors = crew.filter((c) => c.job === "Director");
      if (!directors.length) return "";
      return directors.map((d) => d.name).join(", ");
    }

    if (isTv(data)) {
      const createdBy = data.created_by ?? [];
      if (!createdBy.length) return "";
      return createdBy.map((c) => c.name).join(", ");
    }

    return "";
  }, [data, isMovie, isTv]);

  const writer = useMemo(() => {
    if (!data) return "";
    const anyCredits = credits as
      | TMDBMovieCreditsResponse
      | TMDBTvCreditsResponse
      | undefined;
    const crew = anyCredits?.crew ?? [];
    const writers = crew.filter(
      (c) => c.job === "Writer" || c.job === "Screenplay"
    );
    if (!writers.length) return "";
    return writers.map((w) => w.name).join(", ");
  }, [credits, data]);

  const starCast = useMemo<UnifiedCastItem[]>(() => {
    if (!data) return [];

    if (isMovie(data)) {
      const mCredits = data.credits as TMDBMovieCreditsResponse | undefined;
      const cast = mCredits?.cast ?? [];
      return cast.map((c) => ({
        adult: c.adult,
        gender: c.gender ?? null,
        id: c.id,
        known_for_department: c.known_for_department,
        name: c.name,
        original_name: c.original_name,
        popularity: c.popularity,
        profile_path: c.profile_path ?? null,
        cast_id: c.cast_id,
        character: c.character,
        credit_id: c.credit_id,
        order: c.order,
      }));
    }

    if (isTv(data)) {
      const tvCredits = data.credits as TMDBTvCreditsResponse | undefined;
      const cast = tvCredits?.cast ?? [];
      return cast.map((c: TMDBTvCast) => ({
        adult: c.adult,
        gender: c.gender ?? null,
        id: c.id,
        known_for_department: c.known_for_department,
        name: c.name,
        original_name: c.original_name,
        popularity: c.popularity,
        profile_path: c.profile_path ?? null,
        cast_id: undefined,
        character: c.character,
        credit_id: c.credit_id,
        order: c.order,
      }));
    }

    return [];
  }, [data, isMovie, isTv]);

  // ========== Videos ==========
  const videos = useMemo<DetailVideoItem[]>(() => {
    if (!data) return [];

    if (isMovie(data)) {
      const v = data.videos as TMDBMovieVideosResponse | undefined;
      return v?.results ?? [];
    }

    if (isTv(data)) {
      const v = data.videos as TMDBTvVideosResponse | undefined;
      return v?.results ?? [];
    }

    return [];
  }, [data, isMovie, isTv]);

  const trailer = useMemo<DetailVideoItem | null>(() => {
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

  const extraVideos = useMemo<DetailVideoItem[]>(() => {
    if (!videos.length) return [];
    if (!trailer) return videos;
    return videos.filter((v) => v.id !== trailer.id);
  }, [videos, trailer]);

  // ========== Similar & Recommendations ==========
  const similarList: MediaSummary[] = useMemo(() => {
    if (!data) return [];

    if (isMovie(data)) {
      const s = data.similar as TMDBMovieSimilarResponse | undefined;
      return (s?.results ?? []) as MediaSummary[];
    }

    if (isTv(data)) {
      const s = data.similar as TMDBTvSimilarResponse | undefined;
      return (s?.results ?? []) as MediaSummary[];
    }

    return [];
  }, [data, isMovie, isTv]);

  const recommendationList: MediaSummary[] = useMemo(() => {
    if (!data) return [];

    if (isMovie(data)) {
      const r = data.recommendations as
        | TMDBMovieRecommendationsResponse
        | undefined;
      return (r?.results ?? []) as MediaSummary[];
    }

    if (isTv(data)) {
      const r = data.recommendations as
        | TMDBTvRecommendationsResponse
        | undefined;
      return (r?.results ?? []) as MediaSummary[];
    }

    return [];
  }, [data, isMovie, isTv]);

  // ========== Certification / Content rating ==========
  const certification = useMemo(() => {
    if (!data) return "";

    // Movie: release_dates
    if (isMovie(data)) {
      const movieData = data as MovieDetailsWithAppend;
      const rd = movieData.release_dates as
        | TMDBMovieReleaseDatesResponse
        | undefined;
      const results = rd?.results ?? [];
      if (!results.length) return "";

      const preferred: TMDBMovieReleaseDatesByCountry | undefined =
        results.find((r) => r.iso_3166_1 === "US") ||
        results.find((r) => r.iso_3166_1 === "VN") ||
        results[0];

      if (!preferred) return "";
      const rel = preferred.release_dates.find((r) => r.certification);
      return rel?.certification ?? "";
    }

    // TV: content_ratings
    if (isTv(data)) {
      const tvData = data as TvDetailsWithAppend;
      const cr = tvData.content_ratings as
        | TMDBTvContentRatingsResponse
        | undefined;
      const results = cr?.results ?? [];
      if (!results.length) return "";

      const preferred =
        results.find((r) => r.iso_3166_1 === "US") ||
        results.find((r) => r.iso_3166_1 === "VN") ||
        results[0];

      return preferred?.rating ?? "";
    }

    return "";
  }, [data, isMovie, isTv]);

  // ========== Keywords ==========
  const keywords = useMemo<KeywordItem[]>(() => {
    if (!data) return [];

    if (isMovie(data)) {
      const k = data.keywords as TMDBMovieKeywordsResponse | undefined;
      return (k?.keywords ?? []) as KeywordItem[];
    }

    if (isTv(data)) {
      const k = data.keywords as TMDBTvKeywordsResponse | undefined;
      return (k?.results ?? []) as KeywordItem[];
    }

    return [];
  }, [data, isMovie, isTv]);

  // ========== Alternative titles ==========
  const alternativeTitles = useMemo<AltTitleItem[]>(() => {
    if (!data) return [];

    if (isMovie(data)) {
      const alt = data.alternative_titles as
        | TMDBMovieAlternativeTitlesResponse
        | undefined;
      return (alt?.titles ?? []) as AltTitleItem[];
    }

    if (isTv(data)) {
      const alt = data.alternative_titles as
        | TMDBTvAlternativeTitlesResponse
        | undefined;
      return (alt?.results ?? []) as AltTitleItem[];
    }

    return [];
  }, [data, isMovie, isTv]);

  // ========== Watch providers ==========
  const watchProviders = useMemo<
    Record<string, TMDBWatchProviderRegion> | undefined
  >(() => {
    if (!data) return undefined;

    if (isMovie(data)) {
      const wp = data["watch/providers"] as
        | TMDBMovieWatchProvidersResponse
        | undefined;
      return wp?.results;
    }

    if (isTv(data)) {
      const wp = data["watch/providers"] as
        | TMDBTvWatchProvidersResponse
        | undefined;
      return wp?.results;
    }

    return undefined;
  }, [data, isMovie, isTv]);

  // ========== Reviews ==========
  const reviews = useMemo<ReviewItem[]>(() => {
    if (!data) return [];

    if (isMovie(data)) {
      const r = data.reviews as TMDBMovieReviewsResponse | undefined;
      return (r?.results ?? []) as ReviewItem[];
    }

    if (isTv(data)) {
      const r = data.reviews as TMDBTvReviewsResponse | undefined;
      return (r?.results ?? []) as ReviewItem[];
    }

    return [];
  }, [data, isMovie, isTv]);

  // ========== External IDs ==========
  const externalIds = useMemo<ExternalIds | undefined>(() => {
    if (!data) return undefined;

    if (isMovie(data)) {
      return data.external_ids as TMDBMovieExternalIdsResponse | undefined;
    }

    if (isTv(data)) {
      return data.external_ids as TMDBTvExternalIdsResponse | undefined;
    }

    return undefined;
  }, [data, isMovie, isTv]);

  // ========== Collection (Movie) ==========
  const movieCollection = useMemo<MovieCollection>(() => {
    if (!data || resolvedMediaType !== "movie") return null;

    const movieData = data as MovieDetailsWithAppend;

    const raw = movieData.belongs_to_collection as unknown as {
      id: number;
      name: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
    } | null;

    return raw ?? null;
  }, [data, resolvedMediaType]);

  // ========== Production companies & genres ==========
  const productionCompanies = useMemo<TMDBProductionCompany[]>(() => {
    if (!data) return [];
    if (
      "production_companies" in data &&
      Array.isArray(data.production_companies)
    ) {
      return data.production_companies as TMDBProductionCompany[];
    }
    return [];
  }, [data]);

  const currentGenres = useMemo<DetailGenre[]>(() => {
    if (!data) return [];
    if (!("genres" in data) || !Array.isArray(data.genres)) return [];
    return data.genres as DetailGenre[];
  }, [data]);

  // ========== TV Networks ==========
  const tvNetworks = useMemo<TvNetworkSummary[]>(() => {
    if (!data || !isTv(data)) return [];

    const tvData = data as TvDetailsWithAppend;
    if (!Array.isArray(tvData.networks)) return [];

    return tvData.networks.map((n: TMDBTvNetwork) => ({
      id: n.id,
      name: n.name,
      logo_path: n.logo_path,
      origin_country: n.origin_country,
    }));
  }, [data, isTv]);

  // ========== TV Seasons ==========
  const tvSeasons = useMemo<TvSeasonSummary[]>(() => {
    if (!data || !isTv(data)) return [];
    const tvData = data as TvDetailsWithAppend;
    return tvData.seasons ?? [];
  }, [data, isTv]);

  // ========== Episode Groups ==========
  const tvEpisodeGroups = useMemo<TvEpisodeGroupSummary[]>(() => {
    if (!data || !isTv(data)) return [];

    const tvData = data as TvDetailsWithAppend;
    const eg = tvData.episode_groups as TMDBTvEpisodeGroupsResponse | undefined;

    if (!eg?.results?.length) return [];

    return eg.results.map((g) => ({
      id: g.id,
      name: g.name,
      order: g.order,
      episode_count: g.episode_count,
      group_count: g.group_count,
      type: g.type,
      network: g.network ?? null,
    }));
  }, [data, isTv]);

  // ========== Account states ==========
  const accountStates = useMemo<MediaAccountStates | undefined>(() => {
    if (!data) return undefined;

    if (isMovie(data)) {
      return data.account_states as TMDBMovieAccountStatesResponse | undefined;
    }

    if (isTv(data)) {
      return data.account_states as TMDBTvAccountStatesResponse | undefined;
    }

    return undefined;
  }, [data, isMovie, isTv]);

  // ========== Images ==========
  const mediaImages = useMemo<MediaImages | undefined>(() => {
    if (!data) return undefined;

    if (isMovie(data)) {
      return data.images as TMDBMovieImagesResponse | undefined;
    }

    if (isTv(data)) {
      return data.images as TMDBTvImagesResponse | undefined;
    }

    return undefined;
  }, [data, isMovie, isTv]);

  // ========== Lists ==========
  const mediaLists = useMemo<
    TMDBMovieListsResponse | TMDBTvListsResponse | undefined
  >(() => {
    if (!data) return undefined;

    if (isMovie(data)) {
      return data.lists as TMDBMovieListsResponse | undefined;
    }

    if (isTv(data)) {
      return data.lists as TMDBTvListsResponse | undefined;
    }

    return undefined;
  }, [data, isMovie, isTv]);

  const mediaListItems = useMemo<UnifiedListItem[]>(() => {
    return mediaLists?.results ?? [];
  }, [mediaLists]);

  // ========== Translations ==========
  const translations = useMemo<MediaTranslationSummary[]>(() => {
    if (!data) return [];

    if (isMovie(data)) {
      const t = data.translations as TMDBMovieTranslationsResponse | undefined;
      return (
        t?.translations.map((tr) => ({
          iso_3166_1: tr.iso_3166_1,
          iso_639_1: tr.iso_639_1,
          name: tr.name,
          english_name: tr.english_name,
        })) ?? []
      );
    }

    if (isTv(data)) {
      const t = data.translations as TMDBTvTranslationsResponse | undefined;
      return (
        t?.translations.map((tr) => ({
          iso_3166_1: tr.iso_3166_1,
          iso_639_1: tr.iso_639_1,
          name: tr.name,
          english_name: tr.english_name,
        })) ?? []
      );
    }

    return [];
  }, [data, isMovie, isTv]);

  // ========== Change log ==========
  const changeLog = useMemo<MediaChangeSummary[]>(() => {
    if (!data) return [];

    const maxItems = 10;

    if (isMovie(data)) {
      const ch = data.changes as TMDBMovieChangesResponse | undefined;
      const raw = ch?.changes ?? [];
      const flat: MediaChangeSummary[] = [];

      raw.forEach((c) => {
        c.items.forEach((item) => {
          flat.push({
            key: c.key,
            action: item.action,
            time: item.time,
          });
        });
      });

      return flat.sort((a, b) => (a.time < b.time ? 1 : -1)).slice(0, maxItems);
    }

    if (isTv(data)) {
      const ch = data.changes as TMDBTvChangesResponse | undefined;
      const raw = ch?.changes ?? [];
      const flat: MediaChangeSummary[] = [];

      raw.forEach((c: TMDBTvChangesItem) => {
        c.items.forEach((item: TMDBTvChangesItemValue) => {
          flat.push({
            key: c.key,
            action: item.action,
            time: item.time,
          });
        });
      });

      return flat.sort((a, b) => (a.time < b.time ? 1 : -1)).slice(0, maxItems);
    }

    return [];
  }, [data, isMovie, isTv]);

  // ========== Facts ==========
  const facts = useMemo<MediaFacts | null>(() => {
    if (!data) return null;

    if (isMovie(data)) {
      const movie = data as TMDBMovieDetailsResponse;
      return {
        status: movie.status,
        originalLanguage: movie.original_language,
        spokenLanguages: movie.spoken_languages?.map((l) => l.english_name),
        productionCountries: movie.production_countries?.map((c) => c.name),
        budget: movie.budget,
        revenue: movie.revenue,
        inProduction: undefined,
        numberOfSeasons: null,
        numberOfEpisodes: null,
        lastAirDate: null,
        nextEpisodeName: null,
      };
    }

    if (isTv(data)) {
      const tv = data as TMDBTvDetailsWithNextEpisode;

      return {
        status: tv.status,
        originalLanguage: tv.original_language,
        spokenLanguages: tv.spoken_languages?.map((l) => l.english_name),
        productionCountries: tv.production_countries?.map((c) => c.name),
        budget: null,
        revenue: null,
        inProduction: tv.in_production,
        numberOfSeasons: tv.number_of_seasons,
        numberOfEpisodes: tv.number_of_episodes,
        lastAirDate: tv.last_air_date,
        // ⭐ chuẩn: chỉ lấy name (string), không truyền object
        nextEpisodeName: tv.next_episode_to_air?.name ?? null,
      };
    }

    return null;
  }, [data, isMovie, isTv]);

  const homepage = useMemo(() => {
    if (!data) return "";
    return data.homepage || "";
  }, [data]);

  const liked = useMemo(() => {
    if (!currentUser || !data) return false;

    return (currentUser.favorites || []).some(
      (item) => item.id === data.id && item.mediaType === resolvedMediaType
    );
  }, [currentUser, data, resolvedMediaType]);

  const inWatchlist = useMemo(() => {
    if (!currentUser || !data) return false;
    const list = currentUser.watchlist || [];
    return list.some(
      (item) => item.id === data.id && item.mediaType === resolvedMediaType
    );
  }, [currentUser, data, resolvedMediaType]);

  const handleToggleWatchlist = useCallback(async () => {
    if (!currentUser || !data) {
      console.log("Bạn cần đăng nhập trước để dùng Watchlist");
      return;
    }

    const list = currentUser.watchlist || [];
    const exists = list.some(
      (item) => item.id === data.id && item.mediaType === resolvedMediaType
    );

    let nextWatchlist;
    if (exists) {
      // Đang nằm trong watchlist → bỏ ra
      nextWatchlist = list.filter(
        (item) => !(item.id === data.id && item.mediaType === resolvedMediaType)
      );
    } else {
      // Chưa có → thêm
      const newItem = buildUserMediaItem(resolvedMediaType, data);
      nextWatchlist = [...list, newItem];
    }

    try {
      const updatedUser = await updateUserDirect({
        id: currentUser.id,
        watchlist: nextWatchlist,
      });

      dispatch(setCurrentUser(updatedUser));
    } catch (error) {
      console.error("Failed to toggle watchlist", error);
    }
  }, [currentUser, data, resolvedMediaType, dispatch]);

  const handleToggleFavorite = useCallback(async () => {
    if (!currentUser || !data) {
      // TODO: bật toast "Bạn cần đăng nhập"
      console.log("Bạn cần đăng nhập trước");
      return;
    }

    const list = currentUser.favorites || [];

    const exists = list.some(
      (item) => item.id === data.id && item.mediaType === resolvedMediaType
    );

    let nextFavorites;

    if (exists) {
      // Đã có → xoá khỏi favorites
      nextFavorites = list.filter(
        (item) => !(item.id === data.id && item.mediaType === resolvedMediaType)
      );
    } else {
      // Chưa có → thêm mới
      const newItem = buildUserMediaItem(resolvedMediaType, data);
      nextFavorites = [...list, newItem];
    }

    try {
      // Cập nhật lên JSON server
      const updatedUser = await updateUserDirect({
        id: currentUser.id,
        favorites: nextFavorites,
      });

      // Cập nhật lại Redux
      dispatch(setCurrentUser(updatedUser));
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  }, [currentUser, data, resolvedMediaType, dispatch]);

  // chọn 1 logo đẹp nhất cho Hero
  const heroLogoPath = useMemo(() => {
    if (!mediaImages) return null;

    // giống cách bạn làm ở DetailsImagesSection
    const logos = mediaImages.logos ?? [];
    if (!logos.length) return null;

    // ưu tiên ngôn ngữ gốc của phim, rồi "en", cuối cùng là bất kỳ logo nào
    let preferredLang = "en";
    if (data && "original_language" in data && data.original_language) {
      preferredLang = data.original_language;
    }

    const byOriginalLang = logos.find((img) => img.iso_639_1 === preferredLang);
    const byEnglish = logos.find((img) => img.iso_639_1 === "en");

    const chosen = byOriginalLang || byEnglish || logos[0];

    return chosen.file_path || null;
  }, [mediaImages, data]);

  // ========== Loading / Error ==========
  if (loading || !data) {
    return (
      <section className="mx-auto max-w-6xl px-3 py-6">
        <p>Đang tải chi tiết...</p>
      </section>
    );
  }

  if (!id) {
    return (
      <section className="mx-auto max-w-6xl px-3 py-6">
        <p>Không tìm thấy nội dung.</p>
      </section>
    );
  }

  // ========== Render ==========
  return (
    <section className="w-full">
      {/* HERO */}
      <DetailsHero
        imageURL={imageURL}
        posterPath={posterPath}
        backdropPath={backdropPath}
        title={title}
        originalTitle={originalTitle}
        tagline={tagline}
        movieCollection={movieCollection}
        releaseDateText={releaseDateText}
        runtimeText={runtimeText}
        certification={certification}
        genresText={genresText}
        userScore={userScore}
        voteCount={voteCount}
        trailerExists={!!trailer}
        onOpenTrailer={() => {
          if (!trailer) return;
          setActiveVideoKey(trailer.key);
          setIsTrailerOpen(true);
        }}
        liked={liked}
        onToggleLike={handleToggleFavorite}
        inWatchlist={inWatchlist}
        onToggleWatchlist={handleToggleWatchlist}
        overview={overview}
        directorOrCreator={directorOrCreator}
        writer={writer}
        externalIds={externalIds}
        productionCompanies={productionCompanies}
        resolvedMediaType={resolvedMediaType}
        currentGenres={currentGenres}
        activeGenreMap={activeGenreMap}
        logoPath={heroLogoPath}
      />

      {/* MODAL VIDEO */}
      {isTrailerOpen && activeVideoKey && (
        <VideoPlay
          videoId={activeVideoKey}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}

      <div className="max-w-6xl mx-auto px-3 py-6">
        {/* Top Cast */}
        {starCast.length > 0 && (
          <DetailsTopCastSection starCast={starCast} imageURL={imageURL} />
        )}

        {/* Seasons (TV only) */}
        {resolvedMediaType === "tv" && tvSeasons.length > 0 && (
          <DetailsSeasonsSection
            seasons={tvSeasons}
            onSelectSeason={(seasonNumber) => {
              if (!id) return;
              navigate(`/tv/${id}/season/${seasonNumber}`);
            }}
          />
        )}

        {/* Episode Groups (TV only) */}
        {resolvedMediaType === "tv" && tvEpisodeGroups.length > 0 && (
          <DetailsEpisodeGroupsSection episodeGroups={tvEpisodeGroups} />
        )}

        {/* Videos */}
        {(trailer || extraVideos.length > 0) && (
          <DetailsVideosSection
            mainTrailer={trailer}
            extraVideos={extraVideos}
            onPlay={(video) => {
              setActiveVideoKey(video.key);
              setIsTrailerOpen(true);
            }}
          />
        )}

        {/* Images gallery */}
        {mediaImages && (
          <DetailsImagesSection
            images={mediaImages}
            imageBaseUrl={TMDB_IMAGE}
          />
        )}

        {/* Similar & Recommendations */}
        <DetailsRelatedSection
          similarList={similarList}
          recommendationList={recommendationList}
          resolvedMediaType={resolvedMediaType}
        />

        {/* Reviews */}
        <DetailsReviewsSection reviews={reviews} />

        {/* Facts */}
        {facts && (
          <DetailsFactsSection
            facts={facts}
            ageRating={certification}
            homepage={homepage}
            resolvedMediaType={resolvedMediaType}
            accountStates={accountStates}
          />
        )}

        {/* Networks (TV only) */}
        {resolvedMediaType === "tv" && tvNetworks.length > 0 && (
          <DetailsNetworksSection networks={tvNetworks} imageURL={TMDB_IMAGE} />
        )}

        {/* Watch providers */}
        <DetailsWatchProvidersSection watchProviders={watchProviders} />

        {/* Keywords */}
        <DetailsKeywordsSection keywords={keywords} />

        {/* Alternative titles */}
        <DetailsAlternativeTitlesSection
          alternativeTitles={alternativeTitles}
        />

        {/* Lists */}
        {mediaListItems.length > 0 && (
          <DetailsListsSection lists={mediaListItems} />
        )}

        {/* Translations */}
        {translations.length > 0 && (
          <DetailsTranslationsSection translations={translations} />
        )}

        {/* Change log */}
        {changeLog.length > 0 && (
          <DetailsChangeLogSection changeLog={changeLog} />
        )}
      </div>
    </section>
  );
};

export default DetailsPage;
