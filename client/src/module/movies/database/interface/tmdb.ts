// src/module/movies/database/interface/tmdb.ts
import type { MovieSummary } from "./movie";
import type { TvSummary } from "./tv";

export type MediaType = "movie" | "tv" | "person" | string;

export interface TMDBMediaBase {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: MediaType;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

export interface TMDBListResponse<T = TMDBMediaBase> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type TMDBMovieListResponse = TMDBListResponse<MovieSummary>;
export type TMDBTvListResponse = TMDBListResponse<TvSummary>;

export interface TMDBImageConfig {
  secure_base_url: string;
  backdrop_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
}

export interface TMDBConfigurationResponse {
  images: TMDBImageConfig;
}
