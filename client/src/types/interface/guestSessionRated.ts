// src/module/guestSessions/interface/guestSessionRated.ts

import type { TMDBPaginatedResponse, TMDBRatedEpisodeListItem, TMDBRatedMovieListItem, TMDBRatedTvListItem } from "./account";

/**
 * =========================
 *  GUEST SESSION – RATED MOVIES
 *  GET /guest_session/{guest_session_id}/rated/movies
 * =========================
 */
export type TMDBGuestRatedMoviesResponse =
  TMDBPaginatedResponse<TMDBRatedMovieListItem>;

/**
 * =========================
 *  GUEST SESSION – RATED TV
 *  GET /guest_session/{guest_session_id}/rated/tv
 * =========================
 */
export type TMDBGuestRatedTvResponse =
  TMDBPaginatedResponse<TMDBRatedTvListItem>;

/**
 * =========================
 *  GUEST SESSION – RATED TV EPISODES
 *  GET /guest_session/{guest_session_id}/rated/tv/episodes
 * =========================
 */
export type TMDBGuestRatedEpisodesResponse =
  TMDBPaginatedResponse<TMDBRatedEpisodeListItem>;
