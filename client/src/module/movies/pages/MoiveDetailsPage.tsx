// src/pages/DetailsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

import { useFetchDetails } from "../../../hooks/useFetchDetails";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";

import VideoPlay from "../../../components/VideoPlay";

import type { MovieDetail, MovieSummary } from "../database/interface/movie";
import type { TvDetail, TvSummary } from "../database/interface/tv";
import type {
  MovieVideoItem,
  MovieVideosResponse,
} from "../../../types/interface/movies/videos";
import DetailsHero from "../components/DetailsHero";
import DetailsTrailerSection from "../components/DetailsTrailerSection";
import DetailsTopCastSection from "../components/DetailsTopCastSection";
import DetailsKeywordsSection from "../components/DetailsKeywordsSection";
import DetailsWatchProvidersSection from "../components/DetailsWatchProvidersSection";
import DetailsReviewsSection from "../components/DetailsReviewsSection";
import DetailsRelatedSection from "../components/DetailsRelatedSection";
import DetailsAlternativeTitlesSection from "../components/DetailsAlternativeTitlesSection";
import { fetchTMDBGenres } from "../store/genresSlice";
import DetailsNetworksSection from "../components/DetailsNetworksSection";

type MediaDetail = MovieDetail | TvDetail;
type MediaSummary = MovieSummary | TvSummary;

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

type CastItem = {
  cast_id?: number;
  credit_id?: string;
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
};

type DetailsPageProps = {
  mediaType?: "movie" | "tv";
};

export type DetailGenre = { id: number; name: string };

export type TvNetworkSummary = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};

const TMDB_IMAGE = "https://image.tmdb.org/t/p";

const MoiveDetailsPage: React.FC<DetailsPageProps> = ({ mediaType }) => {
  const { explore, id } = useParams<{ explore?: string; id: string }>();

  const imageURL = useAppSelector((state) => state.moviesData.imageURL);
  const dispatch = useAppDispatch();

  const [liked, setLiked] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const genresState = useAppSelector((state) => state.tmdbGenres);
  const activeGenreMap =
    (mediaType ?? explore) === "tv" ? genresState.tvMap : genresState.movieMap;

  // nếu chưa load genres thì gọi 1 lần
  useEffect(() => {
    if (!genresState.loaded && !genresState.loading) {
      dispatch(fetchTMDBGenres());
    }
  }, [genresState.loaded, genresState.loading, dispatch]);

  const resolvedMediaType: "movie" | "tv" =
    mediaType ?? (explore === "tv" ? "tv" : "movie");

  const endpoint = id ? `/${resolvedMediaType}/${id}` : "";

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

  const starCast = useMemo<CastItem[]>(() => {
    return (credits?.cast?.slice(0, 8) ?? []) as CastItem[];
  }, [credits]);

  // Videos
  const videos = useMemo<MovieVideoItem[]>(() => {
    if (!data) return [];
    const anyData = data;
    if (!anyData.videos || !anyData.videos.results) return [];
    const raw = (anyData.videos as MovieVideosResponse).results ?? [];
    return raw;
  }, [data]);

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

  // Similar & recommendations
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

  const movieCollection = useMemo(() => {
    if (!data || resolvedMediaType !== "movie") return null;
    const movieData = data as MovieDetail;
    return movieData.belongs_to_collection ?? null;
  }, [data, resolvedMediaType]);

  const productionCompanies = useMemo(() => {
    if (!data) return [];

    if (
      "production_companies" in data &&
      Array.isArray(data.production_companies)
    ) {
      return data.production_companies;
    }

    return [];
  }, [data]);

  const currentGenres = useMemo<DetailGenre[]>(() => {
    if (!data) return [];
    if (!("genres" in data) || !Array.isArray(data.genres)) return [];
    return data.genres as DetailGenre[];
  }, [data]);

  const tvNetworks = useMemo<TvNetworkSummary[]>(() => {
    if (!data || resolvedMediaType !== "tv") return [];

    const tvData = data as TvDetail;
    if (!Array.isArray(tvData.networks)) return [];

    return tvData.networks as TvNetworkSummary[];
  }, [data, resolvedMediaType]);

  if (loading || !data) {
    return (
      <section className="max-w-6xl mx-auto px-3 py-6">
        <p>Đang tải chi tiết...</p>
      </section>
    );
  }

  if (!id) {
    return (
      <section className="max-w-6xl mx-auto px-3 py-6">
        <p>Không tìm thấy nội dung.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-3 py-6">
      {/* Top hero */}
      <DetailsHero
        imageURL={imageURL}
        posterPath={posterPath}
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
        onOpenTrailer={() => setIsTrailerOpen(true)}
        liked={liked}
        onToggleLike={() => setLiked((prev) => !prev)}
        overview={overview}
        directorOrCreator={directorOrCreator}
        writer={writer}
        externalIds={externalIds}
        productionCompanies={productionCompanies}
        resolvedMediaType={resolvedMediaType}
        currentGenres={currentGenres}
        activeGenreMap={activeGenreMap}
      />

      {/* Trailer block + modal */}
      {trailer && (
        <>
          <DetailsTrailerSection
            trailer={{ name: trailer.name }}
            onOpenTrailer={() => setIsTrailerOpen(true)}
          />

          {isTrailerOpen && (
            <VideoPlay
              videoId={trailer.key}
              onClose={() => setIsTrailerOpen(false)}
            />
          )}
        </>
      )}

      {/* Top Cast */}
      {starCast.length > 0 && (
        <DetailsTopCastSection starCast={starCast} imageURL={imageURL} />
      )}

      {/* Networks (chỉ có cho TV show) */}
      {resolvedMediaType === "tv" && tvNetworks.length > 0 && (
        <DetailsNetworksSection networks={tvNetworks} imageURL={TMDB_IMAGE} />
      )}

      {/* Keywords */}
      <DetailsKeywordsSection keywords={keywords} />

      {/* Alternative titles */}
      <DetailsAlternativeTitlesSection alternativeTitles={alternativeTitles} />

      {/* Where to watch */}
      <DetailsWatchProvidersSection watchProviders={watchProviders} />

      {/* Reviews */}
      <DetailsReviewsSection reviews={reviews} />

      {/* Similar & Recommendations */}
      <DetailsRelatedSection
        similarList={similarList}
        recommendationList={recommendationList}
        resolvedMediaType={resolvedMediaType}
      />
    </section>
  );
};

export default MoiveDetailsPage;
