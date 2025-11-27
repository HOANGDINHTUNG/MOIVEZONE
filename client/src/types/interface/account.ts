// src/module/account/interface/account.ts

/**
 * =========================
 *  Account details
 * =========================
 */

export interface TMDBAvatarGravatar {
  hash: string; // thực tế TMDB trả hash gravatar
}

export interface TMDBAvatarTMDB {
  avatar_path: string | null;
}

export interface TMDBAvatar {
  gravatar?: TMDBAvatarGravatar;
  tmdb?: TMDBAvatarTMDB;
}

export interface TMDBAccountDetails {
  id: number;
  avatar: TMDBAvatar;
  iso_639_1: string;      // ngôn ngữ ưu tiên
  iso_3166_1: string;     // quốc gia
  name: string;
  include_adult: boolean;
  username: string;
}

/**
 * =========================
 *  Common helper types
 * =========================
 */

// Response chung có phân trang
export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Response chỉ có status
export interface TMDBStatusResponse {
  status_code: number;
  status_message: string;
}

// Body dùng cho Add Favorite & Add To Watchlist
export type TMDBMediaType = "movie" | "tv";

export interface TMDBMarkMediaRequest {
  media_type: TMDBMediaType;
  media_id: number;
  // với Add Favorite:  favorite: true/false
  // với Watchlist:     watchlist: true/false
  // nên để generic:
  favorite?: boolean;
  watchlist?: boolean;
}

/**
 * =========================
 *  Movie / TV list item cơ bản
 * =========================
 */

export interface TMDBMovieListItem {
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

export interface TMDBTvListItem {
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

/**
 * =========================
 *  Favorite / Watchlist
 * =========================
 */

// Favorite Movies
export type TMDBFavoriteMoviesResponse =
  TMDBPaginatedResponse<TMDBMovieListItem>;

// Favorite TV
export type TMDBFavoriteTvResponse =
  TMDBPaginatedResponse<TMDBTvListItem>;

// Watchlist Movies
export type TMDBWatchlistMoviesResponse =
  TMDBPaginatedResponse<TMDBMovieListItem>;

// Watchlist TV
export type TMDBWatchlistTvResponse =
  TMDBPaginatedResponse<TMDBTvListItem>;

/**
 * =========================
 *  Custom Lists (user lists)
 * =========================
 */

export interface TMDBAccountListItem {
  description: string;
  favorite_count: number;
  id: number;
  item_count: number;
  iso_639_1: string;
  list_type: string;
  name: string;
  poster_path: string | null;
}

export type TMDBAccountListsResponse =
  TMDBPaginatedResponse<TMDBAccountListItem>;

/**
 * =========================
 *  Rated Movies / TV / Episodes
 * =========================
 */

export interface TMDBRatedMovieListItem extends TMDBMovieListItem {
  rating: number; // user rating
}

export type TMDBRatedMoviesResponse =
  TMDBPaginatedResponse<TMDBRatedMovieListItem>;

export interface TMDBRatedTvListItem extends TMDBTvListItem {
  rating: number; // user rating
}

export type TMDBRatedTvResponse =
  TMDBPaginatedResponse<TMDBRatedTvListItem>;

// Rated TV Episodes
export interface TMDBRatedEpisodeListItem {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  rating: number;
}

export type TMDBRatedEpisodesResponse =
  TMDBPaginatedResponse<TMDBRatedEpisodeListItem>;
