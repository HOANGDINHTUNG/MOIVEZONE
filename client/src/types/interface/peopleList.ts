// src/module/people/interface/peopleList.ts

/**
 * ============================================================
 *  Known For (movie or tv)
 * ============================================================
 */

export interface TMDBKnownForMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  media_type: "movie";
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBKnownForTv {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  media_type: "tv";
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export type TMDBKnownForItem = TMDBKnownForMovie | TMDBKnownForTv;

/**
 * ============================================================
 *  PERSON SUMMARY
 * ============================================================
 */

export interface TMDBPersonSummary {
  adult: boolean;
  gender: number; // 0,1,2,3 theo TMDB
  id: number;
  known_for: TMDBKnownForItem[];
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string | null;
}

/**
 * ============================================================
 *  POPULAR PEOPLE RESPONSE
 * ============================================================
 */

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type TMDBPopularPeopleResponse =
  TMDBPaginatedResponse<TMDBPersonSummary>;
