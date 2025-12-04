export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBSearchCollectionItem {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
}

export type TMDBSearchCollectionResponse =
  TMDBPaginatedResponse<TMDBSearchCollectionItem>;

export interface TMDBSearchCompanyItem {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export type TMDBSearchCompanyResponse =
  TMDBPaginatedResponse<TMDBSearchCompanyItem>;

export interface TMDBSearchKeywordItem {
  id: number;
  name: string;
}

export type TMDBSearchKeywordResponse =
  TMDBPaginatedResponse<TMDBSearchKeywordItem>;

export interface TMDBSearchMovieItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type TMDBSearchMovieResponse =
  TMDBPaginatedResponse<TMDBSearchMovieItem>;

export interface TMDBSearchTvItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export type TMDBSearchTvResponse = TMDBPaginatedResponse<TMDBSearchTvItem>;

export interface TMDBSearchPersonKnownForMovie {
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

export interface TMDBSearchPersonKnownForTv {
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

export type TMDBSearchPersonKnownFor =
  | TMDBSearchPersonKnownForMovie
  | TMDBSearchPersonKnownForTv;

export interface TMDBSearchPersonItem {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  known_for: TMDBSearchPersonKnownFor[];
}

export type TMDBSearchPersonResponse =
  TMDBPaginatedResponse<TMDBSearchPersonItem>;

export interface TMDBSearchMultiMovie {
  media_type: "movie";
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBSearchMultiTv {
  media_type: "tv";
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface TMDBSearchMultiPerson {
  media_type: "person";
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string | null;
  known_for: TMDBSearchPersonKnownFor[];
}

export type TMDBSearchMultiItem =
  | TMDBSearchMultiMovie
  | TMDBSearchMultiTv
  | TMDBSearchMultiPerson;

export type TMDBSearchMultiResponse =
  TMDBPaginatedResponse<TMDBSearchMultiItem>;
