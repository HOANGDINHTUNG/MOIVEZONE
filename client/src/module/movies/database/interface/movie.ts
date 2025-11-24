// src/module/movies/database/interface/movie.ts

// ==== Core types gốc của Movie ====

export interface Genre {
  id: number;
  name: string;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

import type { AccountStates } from "../../../../types/interface/movies/account_states";
// ==== Import các module chi tiết theo từng endpoint ====

import type {
  AlternativeTitles,
} from "../../../../types/interface/movies/alternative_titles";
import type {
  MovieChanges,
} from "../../../../types/interface/movies/changes";
import type {
  MovieCreditsResponse,
} from "../../../../types/interface/movies/credits";
import type {
  ExternalIDs,
} from "../../../../types/interface/movies/external_ids";
import type {
  MovieImages,
} from "../../../../types/interface/movies/images";
import type {
  MovieKeywords,
} from "../../../../types/interface/movies/keywords";
import type {
  MovieListsResponse,
} from "../../../../types/interface/movies/list";
import type {
  WatchProvidersResponse,
} from "../../../../types/interface/movies/providers";
import type {
  MovieReleaseDatesResponse,
} from "../../../../types/interface/movies/release_dates";
import type {
  MovieReviewsResponse,
} from "../../../../types/interface/movies/reviews";
import type {
  MovieTranslationsResponse,
} from "../../../../types/interface/movies/translations";
import type {
  MovieVideosResponse,
} from "../../../../types/interface/movies/videos";

// ==== MovieDetail: dữ liệu chi tiết của một phim ====

export interface MovieDetail {
  // Phần core
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: BelongsToCollection | null;

  budget: number;
  genres: Genre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;

  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];

  release_date: string;
  revenue: number;
  runtime: number | null;

  spoken_languages: SpokenLanguage[];

  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;

  // ==== Phần “append_to_response” – các endpoint con ====
  // Tất cả đều optional vì chỉ có nếu bạn append_to_response khi call API

  /** /movie/{id}/account_states */
  account_states?: AccountStates;

  /** /movie/{id}/alternative_titles */
  alternative_titles?: AlternativeTitles;

  /** /movie/{id}/changes */
  changes?: MovieChanges;

  /** /movie/{id}/credits */
  credits?: MovieCreditsResponse;

  /** /movie/{id}/external_ids */
  external_ids?: ExternalIDs;

  /** /movie/{id}/images */
  images?: MovieImages;

  /** /movie/{id}/keywords */
  keywords?: MovieKeywords;

  /** /movie/{id}/lists */
  lists?: MovieListsResponse;

  /** /movie/{id}/watch/providers */
  "watch/providers"?: WatchProvidersResponse;

  /** /movie/{id}/release_dates */
  release_dates?: MovieReleaseDatesResponse;

  /** /movie/{id}/reviews */
  reviews?: MovieReviewsResponse;

  /** /movie/{id}/translations */
  translations?: MovieTranslationsResponse;

  /** /movie/{id}/videos */
  videos?: MovieVideosResponse;
}

// ==== Dạng “list item” dùng cho các API list: now_playing, popular,... ====
// Đây là kiểu tóm lược (summary) của Movie, dùng cho list + card

export interface MovieSummary {
  id: number;
  title: string;
  original_title: string;
  overview: string | null;

  poster_path: string | null;
  backdrop_path: string | null;

  release_date: string;
  original_language: string;

  popularity: number;
  vote_average: number;
  vote_count: number;

  adult: boolean;
  video: boolean;

  genre_ids: number[];
}
