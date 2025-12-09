import type {
  TMDBAccountDetails,
  TMDBAccountListsResponse,
  TMDBFavoriteMoviesResponse,
  TMDBFavoriteTvResponse,
  TMDBMarkMediaRequest,
  TMDBRatedEpisodesResponse,
  TMDBRatedMoviesResponse,
  TMDBRatedTvResponse,
  TMDBStatusResponse,
  TMDBWatchlistMoviesResponse,
  TMDBWatchlistTvResponse,
} from "../../module/accounts/database/interface/account";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type HttpMethod = "GET" | "POST";

export interface TMDBConfig {
  apiKey: string;
  sessionId: string; // user session (NOT guest)
  accountId: number | string;
}

const buildUrl = (
  path: string,
  apiKey: string,
  params?: Record<string, string | number | boolean | undefined>
) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

async function tmdbRequest<T>(
  method: HttpMethod,
  path: string,
  config: TMDBConfig,
  params?: Record<string, string | number | boolean | undefined>,
  body?: unknown
): Promise<T> {
  const url = buildUrl(path, config.apiKey, {
    ...params,
    session_id: config.sessionId,
  });

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = (await res
      .json()
      .catch(() => ({}))) as Partial<TMDBStatusResponse>;
    const message =
      errorBody?.status_message ||
      `TMDB request failed: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// EXPORT các hàm dùng trong app

export const tmdbAccountApi = {
  getAccountDetails(config: TMDBConfig) {
    return tmdbRequest<TMDBAccountDetails>(
      "GET",
      `/account/${config.accountId}`,
      config
    );
  },

  getFavoriteMovies(config: TMDBConfig, page = 1) {
    return tmdbRequest<TMDBFavoriteMoviesResponse>(
      "GET",
      `/account/${config.accountId}/favorite/movies`,
      config,
      { page, sort_by: "created_at.desc" }
    );
  },

  getFavoriteTv(config: TMDBConfig, page = 1) {
    return tmdbRequest<TMDBFavoriteTvResponse>(
      "GET",
      `/account/${config.accountId}/favorite/tv`,
      config,
      { page, sort_by: "created_at.desc" }
    );
  },

  getWatchlistMovies(config: TMDBConfig, page = 1) {
    return tmdbRequest<TMDBWatchlistMoviesResponse>(
      "GET",
      `/account/${config.accountId}/watchlist/movies`,
      config,
      { page, sort_by: "created_at.desc" }
    );
  },

  getWatchlistTv(config: TMDBConfig, page = 1) {
    return tmdbRequest<TMDBWatchlistTvResponse>(
      "GET",
      `/account/${config.accountId}/watchlist/tv`,
      config,
      { page, sort_by: "created_at.desc" }
    );
  },

  getRatedMovies(config: TMDBConfig, page = 1) {
    return tmdbRequest<TMDBRatedMoviesResponse>(
      "GET",
      `/account/${config.accountId}/rated/movies`,
      config,
      { page, sort_by: "created_at.desc" }
    );
  },

  getRatedTv(config: TMDBConfig, page = 1) {
    return tmdbRequest<TMDBRatedTvResponse>(
      "GET",
      `/account/${config.accountId}/rated/tv`,
      config,
      { page, sort_by: "created_at.desc" }
    );
  },

  getRatedEpisodes(config: TMDBConfig, page = 1) {
    return tmdbRequest<TMDBRatedEpisodesResponse>(
      "GET",
      `/account/${config.accountId}/rated/tv/episodes`,
      config,
      { page, sort_by: "created_at.desc" }
    );
  },

  getAccountLists(config: TMDBConfig, page = 1) {
    return tmdbRequest<TMDBAccountListsResponse>(
      "GET",
      `/account/${config.accountId}/lists`,
      config,
      { page }
    );
  },

  markAsFavorite(config: TMDBConfig, body: TMDBMarkMediaRequest) {
    return tmdbRequest<TMDBStatusResponse>(
      "POST",
      `/account/${config.accountId}/favorite`,
      config,
      undefined,
      body
    );
  },

  markToWatchlist(config: TMDBConfig, body: TMDBMarkMediaRequest) {
    return tmdbRequest<TMDBStatusResponse>(
      "POST",
      `/account/${config.accountId}/watchlist`,
      config,
      undefined,
      body
    );
  },
};
