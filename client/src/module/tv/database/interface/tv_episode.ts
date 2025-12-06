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

export type TMDBVideoSite = "YouTube" | "Vimeo" | string;
export type TMDBVideoType =
  | "Trailer"
  | "Teaser"
  | "Clip"
  | "Featurette"
  | "Behind the Scenes"
  | "Bloopers"
  | string;

// DETAILS
export interface TMDBTvEpisodeCrew extends TMDBPersonBase {
  department: string;
  job: string;
  credit_id: string;
}

export interface TMDBTvEpisodeGuestStar extends TMDBPersonBase {
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBTvEpisodeDetails {
  air_date: string;
  crew: TMDBTvEpisodeCrew[];
  episode_number: number;
  guest_stars: TMDBTvEpisodeGuestStar[];
  name: string;
  overview: string;
  id: number;
  production_code: string;
  runtime: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;

  episode_type?: string;
  show_id?: number;
}

// ACCOUNT STATES
export type TMDBTvEpisodeRated =
  | boolean
  | {
      value: number;
    };

export interface TMDBTvEpisodeAccountStates {
  id: number;
  favorite: boolean;
  rated: TMDBTvEpisodeRated;
  watchlist: boolean;
}

// CHANGES
export interface TMDBTvEpisodeChangeItem {
  id: string;
  action: string;
  time: string;
  value: unknown;
}

export interface TMDBTvEpisodeChange {
  key: string;
  items: TMDBTvEpisodeChangeItem[];
}

export interface TMDBTvEpisodeChangesResponse {
  changes: TMDBTvEpisodeChange[];
}

// CREDITS
export interface TMDBTvEpisodeCast extends TMDBPersonBase {
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBTvEpisodeCreditsCrew extends TMDBPersonBase {
  department: string;
  job: string;
  credit_id: string;
}

export interface TMDBTvEpisodeGuestStars extends TMDBPersonBase {
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBTvEpisodeCredits {
  id: number;
  cast: TMDBTvEpisodeCast[];
  crew: TMDBTvEpisodeCreditsCrew[];
  guest_stars: TMDBTvEpisodeGuestStars[];
}

// EXTERNAL IDS
export interface TMDBTvEpisodeExternalIds {
  id: number;
  imdb_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
}

// IMAGES
export interface TMDBTvEpisodeStill {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBTvEpisodeImages {
  id: number;
  stills: TMDBTvEpisodeStill[];
}

// TRANSLATIONS
export interface TMDBTvEpisodeTranslationData {
  name: string;
  overview: string;
}

export interface TMDBTvEpisodeTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TMDBTvEpisodeTranslationData;
}

export interface TMDBTvEpisodeTranslations {
  id: number;
  translations: TMDBTvEpisodeTranslation[];
}

// VIDEOS
export interface TMDBTvEpisodeVideo {
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

export interface TMDBTvEpisodeVideos {
  id: number;
  results: TMDBTvEpisodeVideo[];
}
