// src/api/TMDB.api.ts
import { axiosTMDB } from "../../app/axiosTMDB";
import type { MovieDetail } from "../../module/movies/database/interface/movie";
import type { TvDetail } from "../../module/movies/database/interface/tv";
import type { AppLanguage } from "../../module/movies/store/languageSlice";
import type {
  TMDBMovieListResponse,
  TMDBTvListResponse,
} from "../../module/movies/database/interface/tmdb";
import type { TMDBTrendingAllResponse } from "../../module/trending/database/interface/trending";
import type { TMDBSearchMultiResponse } from "../../module/search/database/interface/search";
import type { TMDBGenreListResponse } from "../../module/movies/database/interface/genre";
import type { TMDBPaginatedResponse } from "../../types/interface/movie";
import type { TMDBReviewDetails } from "../../module/review/database/interface/review";
import type { TMDBPersonDetails } from "../../module/persons/database/interface/person";

const defaultLanguage: AppLanguage = "vi-VN";

type TMDBReviewListResponse = TMDBPaginatedResponse<TMDBReviewDetails>;

export const tmdbApi = {
  // ===== MOVIE LIST =====
  async getNowPlaying(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBMovieListResponse> {
    const res = await axiosTMDB.get<TMDBMovieListResponse>(
      "/movie/now_playing",
      {
        params: { page, language },
      }
    );
    return res.data;
  },

  async getUpcoming(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBMovieListResponse> {
    const res = await axiosTMDB.get<TMDBMovieListResponse>("/movie/upcoming", {
      params: { page, language },
    });
    return res.data;
  },

  async getPopular(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBMovieListResponse> {
    const res = await axiosTMDB.get<TMDBMovieListResponse>("/movie/popular", {
      params: { page, language },
    });
    return res.data;
  },

  async getTopRated(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBMovieListResponse> {
    const res = await axiosTMDB.get<TMDBMovieListResponse>("/movie/top_rated", {
      params: { page, language },
    });
    return res.data;
  },

  // ===== MOVIE DISCOVER – dùng cho trang All Movies (sort mới nhất) =====
  async discoverMovies(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBMovieListResponse> {
    const res = await axiosTMDB.get<TMDBMovieListResponse>("/discover/movie", {
      params: {
        page,
        language,
        sort_by: "primary_release_date.desc",
        include_adult: false,
        include_video: false,
      },
    });
    return res.data;
  },

  async getMovieDetail(
    id: number,
    language: AppLanguage = defaultLanguage
  ): Promise<MovieDetail> {
    const res = await axiosTMDB.get<MovieDetail>(`/movie/${id}`, {
      params: {
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
        language,
      },
    });
    return res.data;
  },

  async getMovieVideos(id: number, language: AppLanguage = defaultLanguage) {
    const res = await axiosTMDB.get(`/movie/${id}/videos`, {
      params: { language },
    });
    return res.data;
  },

  async getTvVideos(id: number, language: AppLanguage = defaultLanguage) {
    const res = await axiosTMDB.get(`/tv/${id}/videos`, {
      params: { language },
    });
    return res.data;
  },

  // ===== TV LIST =====

  async getPopularTv(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvListResponse> {
    const res = await axiosTMDB.get<TMDBTvListResponse>("/tv/popular", {
      params: { page, language },
    });
    return res.data;
  },

  async getOnTheAirTv(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvListResponse> {
    const res = await axiosTMDB.get<TMDBTvListResponse>("/tv/on_the_air", {
      params: { page, language },
    });
    return res.data;
  },

  // DISCOVER TV – dùng cho trang All TV Shows
  async discoverTvShows(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvListResponse> {
    const res = await axiosTMDB.get<TMDBTvListResponse>("/discover/tv", {
      params: {
        page,
        language,
        sort_by: "first_air_date.desc",
        include_null_first_air_dates: false,
      },
    });
    return res.data;
  },

  async getTvDetail(
    id: number,
    language: AppLanguage = defaultLanguage
  ): Promise<TvDetail> {
    const res = await axiosTMDB.get<TvDetail>(`/tv/${id}`, {
      params: {
        append_to_response: [
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
        ].join(","),
        language,
      },
    });
    return res.data;
  },

  async getTrendingAll(
    timeWindow: "day" | "week" = "day"
  ): Promise<TMDBTrendingAllResponse> {
    const res = await axiosTMDB.get<TMDBTrendingAllResponse>(
      `/trending/all/${timeWindow}`
    );
    return res.data;
  },

  async searchMulti(
    query: string,
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBSearchMultiResponse> {
    const res = await axiosTMDB.get<TMDBSearchMultiResponse>("/search/multi", {
      params: {
        query,
        page,
        language,
        include_adult: false,
      },
    });
    return res.data;
  },

  async getMovieGenres(
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBGenreListResponse> {
    const res = await axiosTMDB.get<TMDBGenreListResponse>(
      "/genre/movie/list",
      { params: { language } }
    );
    return res.data;
  },

  async getTvGenres(
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBGenreListResponse> {
    const res = await axiosTMDB.get<TMDBGenreListResponse>("/genre/tv/list", {
      params: { language },
    });
    return res.data;
  },

  async getMovieReviews(
    id: number,
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBReviewListResponse> {
    const res = await axiosTMDB.get<TMDBReviewListResponse>(
      `/movie/${id}/reviews`,
      { params: { page, language } }
    );
    return res.data;
  },

  async getPersonDetails(
    id: number,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBPersonDetails> {
    const res = await axiosTMDB.get<TMDBPersonDetails>(`/person/${id}`, {
      params: { language, append_to_response: "combined_credits,images" },
    });
    return res.data;
  },
};
