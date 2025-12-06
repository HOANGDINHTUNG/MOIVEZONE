export interface TMDBTvEpisodeGroupNetwork {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBTvEpisodeGroupEpisode {
  air_date: string | null;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string | null;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  order: number;
  locked: boolean;
}

export interface TMDBTvEpisodeGroupItem {
  id: string;
  name: string;
  order: number;
  episodes: TMDBTvEpisodeGroupEpisode[];
}

export interface TMDBTvEpisodeGroupDetails {
  description: string;
  episode_count: number;
  group_count: number;
  groups: TMDBTvEpisodeGroupItem[];

  id: string;
  name: string;
  network: TMDBTvEpisodeGroupNetwork | null;
  type: number;
}
