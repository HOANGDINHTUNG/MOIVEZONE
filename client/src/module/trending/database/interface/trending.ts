export type TMDBTimeWindow = "day" | "week";

export type TrendingCategory = "all" | "movie" | "tv" | "person";

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBTrendingMovieItem {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  media_type: "movie";
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type TMDBTrendingMoviesResponse =
  TMDBPaginatedResponse<TMDBTrendingMovieItem>;

export interface TMDBTrendingTvItem {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type: "tv";
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

export type TMDBTrendingTvResponse = TMDBPaginatedResponse<TMDBTrendingTvItem>;

export interface TMDBTrendingPersonKnownForMovie {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  media_type: "movie";
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBTrendingPersonKnownForTv {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type: "tv";
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
}

export type TMDBTrendingPersonKnownFor =
  | TMDBTrendingPersonKnownForMovie
  | TMDBTrendingPersonKnownForTv;

export interface TMDBTrendingPersonItem {
  adult: boolean;
  id: number;
  name: string;
  original_name: string;
  media_type: "person";
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string | null;
  known_for: TMDBTrendingPersonKnownFor[];
}

export type TMDBTrendingPeopleResponse =
  TMDBPaginatedResponse<TMDBTrendingPersonItem>;

export type TMDBTrendingAllItem =
  | TMDBTrendingMovieItem
  | TMDBTrendingTvItem
  | TMDBTrendingPersonItem;

export type TMDBTrendingAllResponse =
  TMDBPaginatedResponse<TMDBTrendingAllItem>;
