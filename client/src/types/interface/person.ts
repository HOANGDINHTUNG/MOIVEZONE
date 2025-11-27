// src/module/people/interface/person.ts

/**
 * ===================================================================
 *  COMMON
 * ===================================================================
 */

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * ===================================================================
 *  PERSON DETAILS  (GET /person/{person_id})
 * ===================================================================
 */

export interface TMDBPersonDetails {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number; // 0..3
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  known_for_department: string;
  name: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;

  // append_to_response có thể thêm trường khác (movie_credits, images, ...)
}

/**
 * ===================================================================
 *  PERSON CHANGES  (GET /person/{id}/changes)
 * ===================================================================
 */

export interface TMDBPersonChangeItemValue {
  id: string;
  action: string;
  time: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  value: string;
}

export interface TMDBPersonChangeItem {
  key: string;
  items: TMDBPersonChangeItemValue[];
}

export interface TMDBPersonChangesResponse {
  changes: TMDBPersonChangeItem[];
}

/**
 * ===================================================================
 *  COMBINED CREDITS  (GET /person/{id}/combined_credits)
 * ===================================================================
 * cast + crew gồm cả movie và tv, phân biệt bằng media_type
 */

export interface TMDBPersonCreditBase {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  media_type: "movie" | "tv";
}

export interface TMDBPersonMovieCredit extends TMDBPersonCreditBase {
  media_type: "movie";
  original_title: string;
  release_date: string;
  title: string;
  video: boolean;
}

export interface TMDBPersonTvCredit extends TMDBPersonCreditBase {
  media_type: "tv";
  original_name: string;
  first_air_date: string;
  name: string;
}

/**
 * Media cho combined credits có thể là movie hoặc tv
 */
export type TMDBPersonCreditMedia =
  | TMDBPersonMovieCredit
  | TMDBPersonTvCredit;

/**
 * Phần field chung cho cast (dùng cho cả movie/tv)
 */
interface TMDBPersonCastCommon {
  character: string;
  credit_id: string;
  order?: number;
}

/**
 * Cast combined = union:
 *  - Movie credit + field cast
 *  - TV credit + field cast
 */
export type TMDBPersonCastCombined =
  | (TMDBPersonMovieCredit & TMDBPersonCastCommon)
  | (TMDBPersonTvCredit & TMDBPersonCastCommon);

/**
 * Phần field chung cho crew (dùng cho cả movie/tv)
 */
interface TMDBPersonCrewCommon {
  credit_id: string;
  department: string;
  job: string;
}

/**
 * Crew combined = union:
 *  - Movie credit + field crew
 *  - TV credit + field crew
 */
export type TMDBPersonCrewCombined =
  | (TMDBPersonMovieCredit & TMDBPersonCrewCommon)
  | (TMDBPersonTvCredit & TMDBPersonCrewCommon);

/**
 * Response combined_credits
 */
export interface TMDBPersonCombinedCredits {
  cast: TMDBPersonCastCombined[];
  crew: TMDBPersonCrewCombined[];
}

/**
 * ===================================================================
 *  EXTERNAL IDS  (GET /person/{id}/external_ids)
 * ===================================================================
 */

export interface TMDBPersonExternalIds {
  id: number;
  freebase_mid: string | null;
  freebase_id: string | null;
  imdb_id: string | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  tiktok_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
}

/**
 * ===================================================================
 *  IMAGES  (GET /person/{id}/images)
 * ===================================================================
 */

export interface TMDBPersonImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBPersonImagesResponse {
  id: number;
  profiles: TMDBPersonImage[];
}

/**
 * ===================================================================
 *  LATEST PERSON  (GET /person/latest)
 * ===================================================================
 */

export type TMDBLatestPersonResponse = TMDBPersonDetails;

/**
 * ===================================================================
 *  MOVIE CREDITS  (GET /person/{id}/movie_credits)
 * ===================================================================
 */

export interface TMDBPersonMovieCastCredit extends TMDBPersonMovieCredit {
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBPersonMovieCrewCredit extends TMDBPersonMovieCredit {
  credit_id: string;
  department: string;
  job: string;
}

export interface TMDBPersonMovieCredits {
  cast: TMDBPersonMovieCastCredit[];
  crew: TMDBPersonMovieCrewCredit[];
}

/**
 * ===================================================================
 *  TV CREDITS  (GET /person/{id}/tv_credits)
 * ===================================================================
 */

export interface TMDBPersonTvCastCredit extends TMDBPersonTvCredit {
  origin_country: string[];
  character: string;
  credit_id: string;
  episode_count: number;
}

export interface TMDBPersonTvCrewCredit extends TMDBPersonTvCredit {
  origin_country: string[];
  credit_id: string;
  department: string;
  episode_count: number;
  job: string;
}

export interface TMDBPersonTvCredits {
  cast: TMDBPersonTvCastCredit[];
  crew: TMDBPersonTvCrewCredit[];
}

/**
 * ===================================================================
 *  TAGGED IMAGES (deprecated)  (GET /person/{id}/tagged_images)
 * ===================================================================
 */

export interface TMDBPersonTaggedImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  id: string;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
  image_type: string;
  media: {
    media_type: string;
    [key: string]: unknown;
  };
}

export interface TMDBPersonTaggedImagesResponse
  extends TMDBPaginatedResponse<TMDBPersonTaggedImage> {
  id: number;
}

/**
 * ===================================================================
 *  TRANSLATIONS  (GET /person/{id}/translations)
 * ===================================================================
 */

export type TMDBPersonTranslationData = Record<string, unknown>;

export interface TMDBPersonTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TMDBPersonTranslationData;
}

export interface TMDBPersonTranslationsResponse {
  id: number;
  translations: TMDBPersonTranslation[];
}
