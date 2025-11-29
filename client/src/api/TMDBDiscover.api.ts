import axiosTMDB from "../app/axiosTMDB";
import type {
  TMDBDiscoverMovieResponse,
  TMDBDiscoverTvResponse,
} from "../types/interface/discover";

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
};
