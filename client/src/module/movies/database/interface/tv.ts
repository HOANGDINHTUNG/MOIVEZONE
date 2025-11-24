// src/module/movies/database/interface/tv.ts

// ==== Core type cho TV show ====

export interface TvGenre {
  id: number;
  name: string;
}

export interface TvProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TvProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TvSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number | null;
  profile_path: string | null;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TvSeason {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

// ==== Import lại các type chi tiết đã có cho movie – TMDB dùng chung cấu trúc ====

import type { AccountStates } from "../../../../types/interface/movies/account_states";
import type { AlternativeTitles } from "../../../../types/interface/movies/alternative_titles";
import type { MovieChanges as TvChanges } from "../../../../types/interface/movies/changes";
import type { MovieCreditsResponse as TvCreditsResponse } from "../../../../types/interface/movies/credits";
import type { ExternalIDs } from "../../../../types/interface/movies/external_ids";
import type { MovieImages as TvImages } from "../../../../types/interface/movies/images";
import type { MovieKeywords as TvKeywords } from "../../../../types/interface/movies/keywords";
import type { MovieListsResponse as TvListsResponse } from "../../../../types/interface/movies/list";
import type { WatchProvidersResponse as TvWatchProvidersResponse } from "../../../../types/interface/movies/providers";
import type { MovieReviewsResponse as TvReviewsResponse } from "../../../../types/interface/movies/reviews";
import type { MovieTranslationsResponse as TvTranslationsResponse } from "../../../../types/interface/movies/translations";
import type { MovieVideosResponse as TvVideosResponse } from "../../../../types/interface/movies/videos";

// ==== Dạng list item của TV show (tương đương MovieSummary) ====

export interface TvSummary {
  id: number;
  name: string;
  original_name: string;
  overview: string | null;

  poster_path: string | null;
  backdrop_path: string | null;

  first_air_date: string;
  origin_country: string[];
  original_language: string;

  popularity: number;
  vote_average: number;
  vote_count: number;

  genre_ids: number[];
}

// ==== Chi tiết TV show ====

export interface TvDetail {
  adult: boolean;
  backdrop_path: string | null;
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: TvGenre[];
  homepage: string | null;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string | null;

  last_episode_to_air: {
    air_date: string | null;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string | null;
    runtime: number | null;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  } | null;

  name: string;
  next_episode_to_air: null | {
    air_date: string | null;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string | null;
    runtime: number | null;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  };

  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string | null;
  popularity: number;

  poster_path: string | null;
  production_companies: TvProductionCompany[];
  production_countries: TvProductionCountry[];

  spoken_languages: TvSpokenLanguage[];

  status: string;
  tagline: string | null;
  type: string;
  vote_average: number;
  vote_count: number;

  // ==== Append to response giống movie ====
  account_states?: AccountStates;
  alternative_titles?: AlternativeTitles;
  changes?: TvChanges;
  credits?: TvCreditsResponse;
  external_ids?: ExternalIDs;
  images?: TvImages;
  keywords?: TvKeywords;
  lists?: TvListsResponse;
  "watch/providers"?: TvWatchProvidersResponse;
  reviews?: TvReviewsResponse;
  translations?: TvTranslationsResponse;
  videos?: TvVideosResponse;
}
