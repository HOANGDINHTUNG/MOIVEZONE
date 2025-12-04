import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBDiscoverMovieResponse,
  TMDBDiscoverTvResponse,
} from "../../module/discovers/database/interface/discover";
import type { AppLanguage } from "../../module/movies/store/languageSlice";
import type { TMDBMovieListsResponse } from "../../types/interface/movie";
import type { TMDBTvListsResponse } from "../../types/interface/tv";

export interface DiscoverMovieParams {
  page?: number;
  sort_by?: string; // ví dụ: "popularity.desc", "vote_average.desc"
  "vote_average.gte"?: number; // tối thiểu rating
  with_original_language?: string; // mã ngôn ngữ, ví dụ: "en", "ja"
  include_adult?: boolean;
}

export interface DiscoverTvParams {
  page?: number;
  sort_by?: string;
  "vote_average.gte"?: number;
  with_original_language?: string;
}

const defaultLanguage: AppLanguage = "vi-VN";

export const tmdbDiscoverApi = {
  getDiscoverMovies(
    params: DiscoverMovieParams = {}
  ): Promise<TMDBDiscoverMovieResponse> {
    return axiosTMDB
      .get<TMDBDiscoverMovieResponse>("/discover/movie", { params })
      .then((res) => res.data);
  },

  getDiscoverTvSeries(
    params: DiscoverTvParams = {}
  ): Promise<TMDBDiscoverTvResponse> {
    return axiosTMDB
      .get<TMDBDiscoverTvResponse>("/discover/tv", { params })
      .then((res) => res.data);
  },

  async discoverMovies(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBMovieListsResponse> {
    const res = await axiosTMDB.get<TMDBMovieListsResponse>("/discover/movie", {
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

  async discoverTvShows(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvListsResponse> {
    const res = await axiosTMDB.get<TMDBTvListsResponse>("/discover/tv", {
      params: {
        page,
        language,
        sort_by: "first_air_date.desc",
        include_null_first_air_dates: false,
      },
    });
    return res.data;
  },
};
