// Dùng chung cho rất nhiều chỗ
export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Genre đơn giản
export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
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

// Kiểu movie “summary” dùng cho list / similar / recommendations / discover …
export interface TMDBMovieSummary {
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

/**
 * ===================================================================
 *  MOVIE DETAILS  (GET /movie/{movie_id})
 * ===================================================================
 */

export interface TMDBMovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: unknown | null; // có thể là object collection, để generic
  budget: number;
  genres: TMDBGenre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;

  // append_to_response có thể thêm field khác (credits, videos, recommendations, ...)
  // nên bạn có thể mở rộng bằng intersection ở chỗ khác.
}

/**
 * ===================================================================
 *  ACCOUNT STATES (GET /movie/{id}/account_states)
 * ===================================================================
 */

export interface TMDBMovieAccountStates {
  id: number;
  favorite: boolean;
  rated: { value: number } | boolean; // TMDB đôi khi trả false nếu chưa rate
  watchlist: boolean;
}

/**
 * ===================================================================
 *  ALTERNATIVE TITLES (GET /movie/{id}/alternative_titles)
 * ===================================================================
 */

export interface TMDBMovieAlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string;
}

export interface TMDBMovieAlternativeTitlesResponse {
  id: number;
  titles: TMDBMovieAlternativeTitle[];
}

/**
 * ===================================================================
 *  MOVIE CHANGES (GET /movie/{id}/changes)
 * ===================================================================
 */

export interface TMDBMovieChangeItemValue {
  id: string;
  action: string;
  time: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  value: Record<string, unknown>;
}

export interface TMDBMovieChangeItem {
  key: string;
  items: TMDBMovieChangeItemValue[];
}

export interface TMDBMovieChangesResponse {
  changes: TMDBMovieChangeItem[];
}

/**
 * ===================================================================
 *  CREDITS (GET /movie/{id}/credits)
 * ===================================================================
 */

export interface TMDBMovieCast {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBMovieCrew {
  adult: boolean;
  gender: number | null;
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

export interface TMDBMovieCredits {
  id: number;
  cast: TMDBMovieCast[];
  crew: TMDBMovieCrew[];
}

/**
 * ===================================================================
 *  EXTERNAL IDS (GET /movie/{id}/external_ids)
 * ===================================================================
 */

export interface TMDBMovieExternalIds {
  id: number;
  imdb_id: string | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

/**
 * ===================================================================
 *  IMAGES (GET /movie/{id}/images)
 * ===================================================================
 */

export interface TMDBMediaImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBMovieImagesResponse {
  id: number;
  backdrops: TMDBMediaImage[];
  posters: TMDBMediaImage[];
  logos: TMDBMediaImage[];
}

/**
 * ===================================================================
 *  KEYWORDS (GET /movie/{id}/keywords)
 * ===================================================================
 */

export interface TMDBMovieKeyword {
  id: number;
  name: string;
}

export interface TMDBMovieKeywordsResponse {
  id: number;
  keywords: TMDBMovieKeyword[];
}

/**
 * ===================================================================
 *  LATEST (GET /movie/latest)
 * ===================================================================
 * Thực tế cấu trúc gần giống MovieDetails, nhưng nhiều field null.
 */

export type TMDBLatestMovieResponse = TMDBMovieDetails;

/**
 * ===================================================================
 *  LISTS (GET /movie/{id}/lists)
 * ===================================================================
 */

export interface TMDBListSummary {
  description: string;
  favorite_count: number;
  id: number;
  item_count: number;
  iso_639_1: string;
  list_type: string;
  name: string;
  poster_path: string | null;
}

export interface TMDBMovieListsResponse
  extends TMDBPaginatedResponse<TMDBListSummary> {
  id: number;
}

/**
 * ===================================================================
 *  RECOMMENDATIONS (GET /movie/{id}/recommendations)
 * ===================================================================
 */

export type TMDBMovieRecommendationsResponse =
  TMDBPaginatedResponse<TMDBMovieSummary>;

/**
 * ===================================================================
 *  RELEASE DATES (GET /movie/{id}/release_dates)
 * ===================================================================
 */

export interface TMDBMovieReleaseDateItem {
  certification: string;
  descriptors: string[];
  iso_639_1: string | null;
  note: string | null;
  release_date: string;
  type: number; // 1..6
}

export interface TMDBMovieReleaseDatesByCountry {
  iso_3166_1: string;
  release_dates: TMDBMovieReleaseDateItem[];
}

export interface TMDBMovieReleaseDatesResponse {
  id: number;
  results: TMDBMovieReleaseDatesByCountry[];
}

/**
 * ===================================================================
 *  REVIEWS (GET /movie/{id}/reviews)
 * ===================================================================
 */

export interface TMDBReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface TMDBMovieReview {
  author: string;
  author_details: TMDBReviewAuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface TMDBMovieReviewsResponse
  extends TMDBPaginatedResponse<TMDBMovieReview> {
  id: number;
}

/**
 * ===================================================================
 *  SIMILAR (GET /movie/{id}/similar)
 * ===================================================================
 */

export type TMDBMovieSimilarResponse = TMDBPaginatedResponse<TMDBMovieSummary>;

/**
 * ===================================================================
 *  TRANSLATIONS (GET /movie/{id}/translations)
 * ===================================================================
 */

export type TMDBMovieTranslationData = Record<string, unknown>;

export interface TMDBMovieTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TMDBMovieTranslationData;
}

export interface TMDBMovieTranslationsResponse {
  id: number;
  translations: TMDBMovieTranslation[];
}

/**
 * ===================================================================
 *  VIDEOS (GET /movie/{id}/videos)
 * ===================================================================
 */

export interface TMDBMovieVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string; // dùng build URL YouTube/Vimeo
  site: string; // "YouTube", "Vimeo"
  size: number; // 360, 480, 720, 1080...
  type: string; // "Trailer", "Teaser", ...
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBMovieVideosResponse {
  id: number;
  results: TMDBMovieVideo[];
}

/**
 * ===================================================================
 *  WATCH PROVIDERS (GET /movie/{id}/watch/providers)
 * ===================================================================
 */

export interface TMDBWatchProvider {
  logo_path: string | null;
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

// key = mã quốc gia: "US", "VN", "GB", ...
export interface TMDBMovieWatchProvidersResponse {
  id: number;
  results: Record<string, TMDBWatchProviderRegion>;
}

/**
 * ===================================================================
 *  RATING (POST/DELETE /movie/{id}/rating)
 * ===================================================================
 */

export interface TMDBMovieRatingRequest {
  value: number;
}

export interface TMDBStatusResponse {
  status_code: number;
  status_message: string;
}
