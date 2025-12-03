import type { TMDBPaginatedResponse } from "./movieLists";

export interface TMDBTvSummary {
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}


// /tv/airing_today
export type TMDBTvAiringTodayResponse = TMDBPaginatedResponse<TMDBTvSummary>;

// /tv/on_the_air
export type TMDBTvOnTheAirResponse = TMDBPaginatedResponse<TMDBTvSummary>;

// /tv/popular
export type TMDBTvPopularResponse = TMDBPaginatedResponse<TMDBTvSummary>;

// /tv/top_rated
export type TMDBTvTopRatedResponse = TMDBPaginatedResponse<TMDBTvSummary>;
