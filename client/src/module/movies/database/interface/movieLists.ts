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

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}


export interface TMDBMovieDateRange {
  maximum: string; // ví dụ: 2024-12-30
  minimum: string; // ví dụ: 2024-11-01
}

export interface TMDBNowPlayingResponse
  extends TMDBPaginatedResponse<TMDBMovieListItem> {
  dates: TMDBMovieDateRange;
}

export interface TMDBUpcomingResponse
  extends TMDBPaginatedResponse<TMDBMovieListItem> {
  dates: TMDBMovieDateRange;
}

export type TMDBPopularMoviesResponse =
  TMDBPaginatedResponse<TMDBMovieListItem>;

export type TMDBTopRatedMoviesResponse =
  TMDBPaginatedResponse<TMDBMovieListItem>;
