// src/module/genres/interface/genre.ts

/**
 * Một genre chung cho Movie và TV
 */
export interface TMDBGenre {
  id: number;
  name: string;
}

/**
 * Response của cả:
 * - /genre/movie/list
 * - /genre/tv/list
 */
export interface TMDBGenreListResponse {
  genres: TMDBGenre[];
}
