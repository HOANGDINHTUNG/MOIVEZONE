// src/module/tv/interface/tv.ts

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
 *  TV DETAILS  (GET /tv/{series_id})
 * ===================================================================
 */

export interface TMDBTvCreator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface TMDBTvGenre {
  id: number;
  name: string;
}

export interface TMDBTvNetwork {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBTvProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBTvProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBTvSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBTvSeasonSummary {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface TMDBTvEpisodeBrief {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface TMDBTvDetails {
  adult: boolean;
  backdrop_path: string | null;
  created_by: TMDBTvCreator[];
  episode_run_time: number[];
  first_air_date: string;
  genres: TMDBTvGenre[];
  homepage: string | null;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: TMDBTvEpisodeBrief | null;
  next_episode_to_air: TMDBTvEpisodeBrief | null;
  networks: TMDBTvNetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TMDBTvProductionCompany[];
  production_countries: TMDBTvProductionCountry[];
  seasons: TMDBTvSeasonSummary[];
  spoken_languages: TMDBTvSpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

/**
 * ===================================================================
 *  ACCOUNT STATES  (/tv/{id}/account_states)
 * ===================================================================
 */

export interface TMDBTvAccountStatesRated {
  value: number;
}

export interface TMDBTvAccountStates {
  id: number;
  favorite: boolean;
  rated: TMDBTvAccountStatesRated | null;
  watchlist: boolean;
}

/**
 * ===================================================================
 *  AGGREGATE CREDITS  (/tv/{id}/aggregate_credits)
 * ===================================================================
 */

export interface TMDBTvAggregateRole {
  credit_id: string;
  character: string;
  episode_count: number;
}

export interface TMDBTvAggregateCast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  roles: TMDBTvAggregateRole[];
  total_episode_count: number;
  order: number;
}

export interface TMDBTvAggregateJob {
  credit_id: string;
  job: string;
  episode_count: number;
}

export interface TMDBTvAggregateCrew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  jobs: TMDBTvAggregateJob[];
  department: string;
  total_episode_count: number;
}

export interface TMDBTvAggregateCredits {
  cast: TMDBTvAggregateCast[];
  crew: TMDBTvAggregateCrew[];
}

/**
 * ===================================================================
 *  ALTERNATIVE TITLES  (/tv/{id}/alternative_titles)
 * ===================================================================
 */

export interface TMDBTvAlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string;
}

export interface TMDBTvAlternativeTitlesResponse {
  id: number;
  results: TMDBTvAlternativeTitle[];
}

/**
 * ===================================================================
 *  CHANGES  (/tv/{id}/changes)
 * ===================================================================
 */

export interface TMDBTvChangeValue {
  [key: string]: unknown;
}

export interface TMDBTvChangeItem {
  id: string;
  action: string;
  time: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  value?: TMDBTvChangeValue;
  original_value?: TMDBTvChangeValue;
}

export interface TMDBTvChange {
  key: string;
  items: TMDBTvChangeItem[];
}

export interface TMDBTvChangesResponse {
  changes: TMDBTvChange[];
}

/**
 * ===================================================================
 *  CONTENT RATINGS  (/tv/{id}/content_ratings)
 * ===================================================================
 */

export interface TMDBTvContentRating {
  descriptors: unknown[];
  iso_3166_1: string;
  rating: string;
  id: number;
}

export interface TMDBTvContentRatingsResponse {
  results: TMDBTvContentRating[];
  id: number;
}

/**
 * ===================================================================
 *  CREDITS  (/tv/{id}/credits)
 * ===================================================================
 */

export interface TMDBTvCast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBTvCrew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface TMDBTvCredits {
  cast: TMDBTvCast[];
  crew: TMDBTvCrew[];
  id: number;
}

/**
 * ===================================================================
 *  EPISODE GROUPS  (/tv/{id}/episode_groups)
 * ===================================================================
 */

export interface TMDBTvEpisodeGroupNetwork {
  id: number;
  name?: string;
  logo_path?: string | null;
  origin_country?: string;
}

export interface TMDBTvEpisodeGroupSummary {
  description: string;
  episode_count: number;
  group_count: number;
  id: string;
  name: string;
  network: TMDBTvEpisodeGroupNetwork | null;
  type: number;
}

export interface TMDBTvEpisodeGroupsResponse {
  results: TMDBTvEpisodeGroupSummary[];
  id: number;
}

/**
 * ===================================================================
 *  EXTERNAL IDS  (/tv/{id}/external_ids)
 * ===================================================================
 */

export interface TMDBTvExternalIds {
  id: number;
  imdb_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

/**
 * ===================================================================
 *  IMAGES  (/tv/{id}/images)
 * ===================================================================
 */

export interface TMDBTvImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBTvImagesResponse {
  id: number;
  backdrops: TMDBTvImage[];
  logos: TMDBTvImage[];
  posters: TMDBTvImage[];
}

/**
 * ===================================================================
 *  KEYWORDS  (/tv/{id}/keywords)
 * ===================================================================
 */

export interface TMDBTvKeyword {
  id: number;
  name: string;
}

export interface TMDBTvKeywordsResponse {
  id: number;
  results: TMDBTvKeyword[];
}

/**
 * ===================================================================
 *  LATEST TV  (/tv/latest)
 * ===================================================================
 */

export type TMDBTvLatestResponse = TMDBTvDetails;

/**
 * ===================================================================
 *  LISTS  (/tv/{id}/lists)
 * ===================================================================
 */

export interface TMDBTvListItem {
  description: string;
  favorite_count: number;
  id: number;
  item_count: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  poster_path: string | null;
}

export interface TMDBTvListsResponse
  extends TMDBPaginatedResponse<TMDBTvListItem> {
  id: number;
}

/**
 * ===================================================================
 *  RECOMMENDATIONS  (/tv/{id}/recommendations)
 * ===================================================================
 */

export interface TMDBTvSummary {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type?: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

export type TMDBTvRecommendationsResponse =
  TMDBPaginatedResponse<TMDBTvSummary>;

/**
 * ===================================================================
 *  REVIEWS  (/tv/{id}/reviews)
 * ===================================================================
 */

export interface TMDBTvReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface TMDBTvReviewItem {
  author: string;
  author_details: TMDBTvReviewAuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface TMDBTvReviewsResponse
  extends TMDBPaginatedResponse<TMDBTvReviewItem> {
  id: number;
}

/**
 * ===================================================================
 *  SCREENED THEATRICALLY  (/tv/{id}/screened_theatrically)
 * ===================================================================
 */

export interface TMDBTvScreenedTheatricallyItem {
  id: number;
  episode_number: number;
  season_number: number;
}

export interface TMDBTvScreenedTheatricallyResponse {
  id: number;
  results: TMDBTvScreenedTheatricallyItem[];
}

/**
 * ===================================================================
 *  SIMILAR  (/tv/{id}/similar)
 * ===================================================================
 */

export type TMDBTvSimilarResponse = TMDBPaginatedResponse<TMDBTvSummary>;

/**
 * ===================================================================
 *  TRANSLATIONS  (/tv/{id}/translations)
 * ===================================================================
 */

export interface TMDBTvTranslationData {
  [key: string]: unknown;
}

export interface TMDBTvTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TMDBTvTranslationData;
}

export interface TMDBTvTranslationsResponse {
  id: number;
  translations: TMDBTvTranslation[];
}

/**
 * ===================================================================
 *  VIDEOS  (/tv/{id}/videos)
 * ===================================================================
 */

export interface TMDBTvVideoItem {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string; // YouTube, Vimeo, ...
  size: number;
  type: string; // Trailer, Teaser, Clip, ...
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBTvVideosResponse {
  id: number;
  results: TMDBTvVideoItem[];
}

/**
 * ===================================================================
 *  WATCH PROVIDERS  (/tv/{id}/watch/providers)
 * ===================================================================
 */

export interface TMDBWatchProviderOffer {
  logo_path: string | null;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface TMDBWatchProviderCountry {
  link: string;
  flatrate?: TMDBWatchProviderOffer[];
  rent?: TMDBWatchProviderOffer[];
  buy?: TMDBWatchProviderOffer[];
}

export interface TMDBTvWatchProvidersResponse {
  id: number;
  results: Record<string, TMDBWatchProviderCountry>;
}
