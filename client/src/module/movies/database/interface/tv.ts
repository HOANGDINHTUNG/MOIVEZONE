export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBWatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface TMDBWatchProviderRegion {
  link: string;
  flatrate?: TMDBWatchProvider[];
  rent?: TMDBWatchProvider[];
  buy?: TMDBWatchProvider[];
}

export interface TMDBTvWatchProvidersResponse {
  id: number;
  results: Record<string, TMDBWatchProviderRegion>;
}

export interface TMDBMediaImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

// ======================
// TV Details: GET /tv/{series_id}
// ======================
export interface TMDBTvCreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface TMDBTvNetwork {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface TMDBTvSeasonSummary {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number; // docs hiển thị integer nhưng dùng number cho an toàn
}

export interface TMDBTvEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;

  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

export interface TMDBTvDetailsResponse {
  adult: boolean;
  backdrop_path: string;

  created_by: TMDBTvCreatedBy[];

  episode_run_time: number[];
  first_air_date: string;

  genres: TMDBGenre[];

  homepage: string;
  id: number;

  in_production: boolean;
  languages: string[];

  last_air_date: string;

  last_episode_to_air: TMDBTvEpisodeToAir;

  name: string;

  next_episode_to_air: string; // docs ghi string (thực tế hay object, nhưng bạn bảo bám docs)

  networks: TMDBTvNetwork[];

  number_of_episodes: number;
  number_of_seasons: number;

  origin_country: string[];

  original_language: string;
  original_name: string;

  overview: string;

  popularity: number;

  poster_path: string;

  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];

  seasons: TMDBTvSeasonSummary[];

  spoken_languages: TMDBSpokenLanguage[];

  status: string;
  tagline: string;
  type: string;

  vote_average: number;
  vote_count: number;
}

// Latest TV: GET /tv/latest
export type TMDBLatestTvResponse = TMDBTvDetailsResponse;

// ======================
// Account States: GET /tv/{series_id}/account_states
// ======================
export interface TMDBTvAccountStatesResponse {
  id: number;
  favorite: boolean;
  rated: { value: number };
  watchlist: boolean;
}

// ======================
// Aggregate Credits: GET /tv/{series_id}/aggregate_credits
// ======================
export interface TMDBTvAggregateCastRole {
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
  profile_path: string;

  roles: TMDBTvAggregateCastRole[];

  total_episode_count: number;
  order: number;
}

export interface TMDBTvAggregateCrewJob {
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
  profile_path: string;

  jobs: TMDBTvAggregateCrewJob[];

  department: string;
  total_episode_count: number;
}

export interface TMDBTvAggregateCreditsResponse {
  cast: TMDBTvAggregateCast[];
  crew: TMDBTvAggregateCrew[];
  id: number;
}

// ======================
// Alternative Titles: GET /tv/{series_id}/alternative_titles
// ======================
export interface TMDBTvAlternativeTitleItem {
  iso_3166_1: string;
  title: string;
  type: string;
}

export interface TMDBTvAlternativeTitlesResponse {
  id: number;
  results: TMDBTvAlternativeTitleItem[];
}

// ======================
// Changes: GET /tv/{series_id}/changes
// ======================
export interface TMDBTvChangesItemValue {
  id: string;
  action: string;
  time: string;
  iso_639_1: string;
  iso_3166_1: string;
  value: Record<string, unknown>;
  original_value?: Record<string, unknown>;
}

export interface TMDBTvChangesItem {
  key: string;
  items: TMDBTvChangesItemValue[];
}

export interface TMDBTvChangesResponse {
  changes: TMDBTvChangesItem[];
}

// ======================
// Content Ratings: GET /tv/{series_id}/content_ratings
// ======================
export interface TMDBTvContentRatingItem {
  descriptors: string[];
  iso_3166_1: string;
  rating: string;
}

export interface TMDBTvContentRatingsResponse {
  id: number;
  results: TMDBTvContentRatingItem[];
}

// ======================
// Credits (latest season): GET /tv/{series_id}/credits
// ======================
export interface TMDBTvCast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;

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
  profile_path: string;

  credit_id: string;
  department: string;
  job: string;
}

export interface TMDBTvCreditsResponse {
  id: number;
  cast: TMDBTvCast[];
  crew: TMDBTvCrew[];
}

// ======================
// Episode Groups: GET /tv/{series_id}/episode_groups
// ======================
export interface TMDBTvEpisodeGroupNetwork {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface TMDBTvEpisodeGroupItem {
  description: string;
  episode_count: number;
  group_count: number;
  id: string;
  name: string;
  network: TMDBTvEpisodeGroupNetwork;
  type: number;
  order: number;
}

export interface TMDBTvEpisodeGroupsResponse {
  id: number;
  results: TMDBTvEpisodeGroupItem[];
}

// ======================
// External IDs: GET /tv/{series_id}/external_ids
// ======================
export interface TMDBTvExternalIdsResponse {
  id: number;
  imdb_id: string;
  freebase_mid: string;
  freebase_id: string;
  tvdb_id: number;
  tvrage_id: number;
  wikidata_id: string;
  facebook_id: string;
  instagram_id: string;
  twitter_id: string;
}

// ======================
// Images: GET /tv/{series_id}/images
// ======================
export interface TMDBTvImagesResponse {
  id: number;
  backdrops: TMDBMediaImage[];
  logos: TMDBMediaImage[];
  posters: TMDBMediaImage[];
}

// ======================
// Keywords: GET /tv/{series_id}/keywords
// ======================
export interface TMDBTvKeyword {
  id: number;
  name: string;
}

export interface TMDBTvKeywordsResponse {
  id: number;
  results: TMDBTvKeyword[];
}

// ======================
// Lists: GET /tv/{series_id}/lists
// ======================
export interface TMDBTvListSummary {
  description: string;
  favorite_count: number;
  id: number;
  item_count: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  poster_path: string;
}

export interface TMDBTvListsResponse
  extends TMDBPaginatedResponse<TMDBTvListSummary> {
  id: number;
}

// ======================
// Recommendations: GET /tv/{series_id}/recommendations
// (docs: results item có media_type)
// ======================
export interface TMDBTvRecommendationItem {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

export type TMDBTvRecommendationsResponse =
  TMDBPaginatedResponse<TMDBTvRecommendationItem>;

// ======================
// Reviews: GET /tv/{series_id}/reviews
// ======================
export interface TMDBTvReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string;
  rating: number;
}

export interface TMDBTvReview {
  author: string;
  author_details: TMDBTvReviewAuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface TMDBTvReviewsResponse
  extends TMDBPaginatedResponse<TMDBTvReview> {
  id: number;
}

// ======================
// Screened Theatrically: GET /tv/{series_id}/screened_theatrically
// ======================
export interface TMDBTvScreenedTheatricallyItem {
  id: number;
  episode_number: number;
  season_number: number;
}

export interface TMDBTvScreenedTheatricallyResponse {
  id: number;
  results: TMDBTvScreenedTheatricallyItem[];
}

// ======================
// Similar: GET /tv/{series_id}/similar
// ======================
export interface TMDBTvSimilarItem {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number; // docs hiển thị integer nhưng dùng number cho an toàn
  vote_count: number;
}

export type TMDBTvSimilarResponse = TMDBPaginatedResponse<TMDBTvSimilarItem>;

// ======================
// Translations: GET /tv/{series_id}/translations
// ======================
export interface TMDBTvTranslationData {
  name: string;
  overview: string;
  homepage: string;
  tagline: string;
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

// ======================
// Videos: GET /tv/{series_id}/videos
// ======================
export interface TMDBTvVideoItem {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBTvVideosResponse {
  id: number;
  results: TMDBTvVideoItem[];
}
