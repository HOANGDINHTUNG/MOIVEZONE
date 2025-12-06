export type TMDBGender = 0 | 1 | 2 | 3;

export interface TMDBPersonBase {
  adult: boolean;
  gender: TMDBGender;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

export interface TMDBTvSeasonEpisodeCrew extends TMDBPersonBase {
  department: string;
  job: string;
  credit_id: string;
}

export interface TMDBTvSeasonEpisodeGuestStar extends TMDBPersonBase {
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBTvSeasonEpisode {
  air_date: string;
  episode_number: number;
  episode_type: string;
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
  crew: TMDBTvSeasonEpisodeCrew[];
  guest_stars: TMDBTvSeasonEpisodeGuestStar[];
}

// Network của season (ít gặp nhưng TMDB có trả)
export interface TMDBNetwork {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

// Season detail
export interface TMDBTvSeasonDetail {
  _id: string;
  air_date: string | null;
  episodes: TMDBTvSeasonEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
  networks?: TMDBNetwork[]; // docs có field này, cho optional
}

// ==== 2) /tv/{series_id}/season/{season_number}/account_states ====

/**
 * Trên TMDB, `rated` có thể là `false` nếu chưa rating,
 * hoặc object { value: number } nếu đã rating.
 */
export type TMDBTvSeasonEpisodeRated =
  | boolean
  | {
      value: number;
    };

export interface TMDBTvSeasonAccountStateResult {
  id: number;
  episode_number: number;
  rated: TMDBTvSeasonEpisodeRated;
}

export interface TMDBTvSeasonAccountStates {
  id: number;
  results: TMDBTvSeasonAccountStateResult[];
}

// ==== 3) /tv/{series_id}/season/{season_number}/aggregate_credits ====

export interface TMDBTvSeasonAggregateCastRole {
  credit_id: string;
  character: string;
  episode_count: number;
}

export interface TMDBTvSeasonAggregateCast extends TMDBPersonBase {
  roles: TMDBTvSeasonAggregateCastRole[];
  total_episode_count: number;
  order: number;
}

export interface TMDBTvSeasonAggregateCrewJob {
  credit_id: string;
  job: string;
  episode_count: number;
}

export interface TMDBTvSeasonAggregateCrew extends TMDBPersonBase {
  jobs: TMDBTvSeasonAggregateCrewJob[];
  department: string;
  total_episode_count: number;
}

export interface TMDBTvSeasonAggregateCredits {
  id: number;
  cast: TMDBTvSeasonAggregateCast[];
  crew: TMDBTvSeasonAggregateCrew[];
}

// ==== 4) /tv/season/{season_id}/changes ====

export interface TMDBTvSeasonChangeValue {
  // docs ghi rõ 2 key này, còn lại TMDB có thể có thêm field khác
  episode_id?: number;
  episode_number?: number;
  // fallback cho các key thay đổi khác (name, overview, v.v.)
  [key: string]: unknown;
}

export interface TMDBTvSeasonChangeItem {
  id: string;
  action: string;
  time: string;
  value: TMDBTvSeasonChangeValue;
}

export interface TMDBTvSeasonChange {
  key: string;
  items: TMDBTvSeasonChangeItem[];
}

export interface TMDBTvSeasonChangesResponse {
  changes: TMDBTvSeasonChange[];
}

// ==== 5) /tv/{series_id}/season/{season_number}/credits ====

export interface TMDBTvSeasonCast extends TMDBPersonBase {
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBTvSeasonCrew extends TMDBPersonBase {
  credit_id: string;
  department: string;
  job: string;
}

export interface TMDBTvSeasonCredits {
  id: number;
  cast: TMDBTvSeasonCast[];
  crew: TMDBTvSeasonCrew[];
}

// ==== 6) /tv/{series_id}/season/{season_number}/external_ids ====

export interface TMDBTvSeasonExternalIds {
  id: number;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: string | null;
  wikidata_id: string | null;
}

// ==== 7) /tv/{series_id}/season/{season_number}/images ====

export interface TMDBTvSeasonPoster {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBTvSeasonImages {
  id: number;
  posters: TMDBTvSeasonPoster[];
}

// ==== 8) /tv/{series_id}/season/{season_number}/translations ====

export interface TMDBTvSeasonTranslationData {
  name: string;
  overview: string;
}

export interface TMDBTvSeasonTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TMDBTvSeasonTranslationData;
}

export interface TMDBTvSeasonTranslations {
  id: number;
  translations: TMDBTvSeasonTranslation[];
}

// ==== 9) /tv/{series_id}/season/{season_number}/videos ====

export type TMDBVideoSite = "YouTube" | "Vimeo" | string;
export type TMDBVideoType =
  | "Trailer"
  | "Teaser"
  | "Clip"
  | "Featurette"
  | "Behind the Scenes"
  | "Bloopers"
  | string;

export interface TMDBTvSeasonVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: TMDBVideoSite;
  size: number;
  type: TMDBVideoType;
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBTvSeasonVideos {
  id: number;
  results: TMDBTvSeasonVideo[];
}

// ==== 10) /tv/{series_id}/season/{season_number}/watch/providers ====

export interface TMDBWatchProviderItem {
  logo_path: string | null;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

/**
 * Thực tế TMDB trả `flatrate`, `buy`, `rent`...
 * Docs bạn dán chỉ có `flatrate`, nên để 3 kiểu đều optional cho chắc.
 */
export interface TMDBTvSeasonWatchProviderCountry {
  link: string;
  flatrate?: TMDBWatchProviderItem[];
  buy?: TMDBWatchProviderItem[];
  rent?: TMDBWatchProviderItem[];
}

export interface TMDBTvSeasonWatchProviders {
  id: number;
  // key là mã country: "US", "VN", "JP", ...
  results: Record<string, TMDBTvSeasonWatchProviderCountry>;
}
