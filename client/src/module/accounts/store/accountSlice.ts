// src/module/account/store/accountSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";import type {
  TMDBAccountDetails,
  TMDBAccountListsResponse,
  TMDBFavoriteMoviesResponse,
  TMDBFavoriteTvResponse,
  TMDBMarkMediaRequest,
  TMDBRatedEpisodesResponse,
  TMDBRatedMoviesResponse,
  TMDBRatedTvResponse,
  TMDBWatchlistMoviesResponse,
  TMDBWatchlistTvResponse,
  TMDBStatusResponse,
} from "../database/interface/account";
import type { RootState } from "../../../stores";
import { tmdbAccountApi, type TMDBConfig } from "../../../api/movie/TMDBAccount.api";

export interface AccountState {
  config: TMDBConfig | null;

  details: TMDBAccountDetails | null;
  loadingDetails: boolean;
  errorDetails: string | null;

  favoriteMovies?: TMDBFavoriteMoviesResponse;
  favoriteTv?: TMDBFavoriteTvResponse;
  watchlistMovies?: TMDBWatchlistMoviesResponse;
  watchlistTv?: TMDBWatchlistTvResponse;
  ratedMovies?: TMDBRatedMoviesResponse;
  ratedTv?: TMDBRatedTvResponse;
  ratedEpisodes?: TMDBRatedEpisodesResponse;
  lists?: TMDBAccountListsResponse;

  loadingData: boolean;
  errorData: string | null;

  actionLoading: boolean;
  actionError: string | null;
}

const initialState: AccountState = {
  config: null,
  details: null,
  loadingDetails: false,
  errorDetails: null,
  loadingData: false,
  errorData: null,
  actionLoading: false,
  actionError: null,
};

/* ----------------- THUNKS ----------------- */

// Khởi tạo config (apiKey, sessionId, accountId)
export const initAccountConfig = createAsyncThunk<
  TMDBConfig, // return type
  TMDBConfig // argument type
>("account/initConfig", async (config) => config);

// Lấy thông tin chi tiết account
export const fetchAccountDetails = createAsyncThunk<
  TMDBAccountDetails, // return type khi fulfilled
  void, // argument type
  { state: RootState; rejectValue: string } // thunkApi type
>("account/fetchDetails", async (_, thunkApi) => {
  const state = thunkApi.getState();
  const config = state.account.config;

  if (!config) {
    return thunkApi.rejectWithValue("Missing TMDB config");
  }

  try {
    return await tmdbAccountApi.getAccountDetails(config);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch account details";
    return thunkApi.rejectWithValue(message);
  }
});

// Lấy toàn bộ dữ liệu liên quan account (favorite, watchlist, rated, lists)
export const fetchAccountData = createAsyncThunk<
  {
    favoriteMovies: TMDBFavoriteMoviesResponse;
    favoriteTv: TMDBFavoriteTvResponse;
    watchlistMovies: TMDBWatchlistMoviesResponse;
    watchlistTv: TMDBWatchlistTvResponse;
    ratedMovies: TMDBRatedMoviesResponse;
    ratedTv: TMDBRatedTvResponse;
    ratedEpisodes: TMDBRatedEpisodesResponse;
    lists: TMDBAccountListsResponse;
  },
  void,
  { state: RootState; rejectValue: string }
>("account/fetchAllData", async (_, thunkApi) => {
  const state = thunkApi.getState();
  const config = state.account.config;

  if (!config) {
    return thunkApi.rejectWithValue("Missing TMDB config");
  }

  try {
    const [
      favoriteMovies,
      favoriteTv,
      watchlistMovies,
      watchlistTv,
      ratedMovies,
      ratedTv,
      ratedEpisodes,
      lists,
    ] = await Promise.all([
      tmdbAccountApi.getFavoriteMovies(config),
      tmdbAccountApi.getFavoriteTv(config),
      tmdbAccountApi.getWatchlistMovies(config),
      tmdbAccountApi.getWatchlistTv(config),
      tmdbAccountApi.getRatedMovies(config),
      tmdbAccountApi.getRatedTv(config),
      tmdbAccountApi.getRatedEpisodes(config),
      tmdbAccountApi.getAccountLists(config),
    ]);

    return {
      favoriteMovies,
      favoriteTv,
      watchlistMovies,
      watchlistTv,
      ratedMovies,
      ratedTv,
      ratedEpisodes,
      lists,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch account data";
    return thunkApi.rejectWithValue(message);
  }
});

// Thêm / bỏ Favorite
export const toggleFavorite = createAsyncThunk<
  TMDBStatusResponse, // return TMDB status response
  TMDBMarkMediaRequest, // body gửi lên
  { state: RootState; rejectValue: string }
>("account/toggleFavorite", async (body, thunkApi) => {
  const state = thunkApi.getState();
  const config = state.account.config;

  if (!config) {
    return thunkApi.rejectWithValue("Missing TMDB config");
  }

  try {
    const res = await tmdbAccountApi.markAsFavorite(config, body);

    // (Optional) Nếu muốn: sau này có thể dispatch fetchAccountData() để sync lại store
    // await thunkApi.dispatch(fetchAccountData());

    return res;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle favorite";
    return thunkApi.rejectWithValue(message);
  }
});

// Thêm / bỏ Watchlist
export const toggleWatchlist = createAsyncThunk<
  TMDBStatusResponse,
  TMDBMarkMediaRequest,
  { state: RootState; rejectValue: string }
>("account/toggleWatchlist", async (body, thunkApi) => {
  const state = thunkApi.getState();
  const config = state.account.config;

  if (!config) {
    return thunkApi.rejectWithValue("Missing TMDB config");
  }

  try {
    const res = await tmdbAccountApi.markToWatchlist(config, body);

    // (Optional) như trên, nếu muốn refresh store thì dispatch thêm thunk khác
    // await thunkApi.dispatch(fetchAccountData());

    return res;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle watchlist";
    return thunkApi.rejectWithValue(message);
  }
});

/* ----------------- SLICE ----------------- */

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // init config
      .addCase(initAccountConfig.fulfilled, (state, action) => {
        state.config = action.payload;
      })

      // account details
      .addCase(fetchAccountDetails.pending, (state) => {
        state.loadingDetails = true;
        state.errorDetails = null;
      })
      .addCase(
        fetchAccountDetails.fulfilled,
        (state, action: PayloadAction<TMDBAccountDetails>) => {
          state.loadingDetails = false;
          state.details = action.payload;
        }
      )
      .addCase(fetchAccountDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.errorDetails =
          action.payload ?? action.error.message ?? "Unknown error";
      })

      // all data
      .addCase(fetchAccountData.pending, (state) => {
        state.loadingData = true;
        state.errorData = null;
      })
      .addCase(
        fetchAccountData.fulfilled,
        (
          state,
          action: PayloadAction<{
            favoriteMovies: TMDBFavoriteMoviesResponse;
            favoriteTv: TMDBFavoriteTvResponse;
            watchlistMovies: TMDBWatchlistMoviesResponse;
            watchlistTv: TMDBWatchlistTvResponse;
            ratedMovies: TMDBRatedMoviesResponse;
            ratedTv: TMDBRatedTvResponse;
            ratedEpisodes: TMDBRatedEpisodesResponse;
            lists: TMDBAccountListsResponse;
          }>
        ) => {
          state.loadingData = false;
          state.favoriteMovies = action.payload.favoriteMovies;
          state.favoriteTv = action.payload.favoriteTv;
          state.watchlistMovies = action.payload.watchlistMovies;
          state.watchlistTv = action.payload.watchlistTv;
          state.ratedMovies = action.payload.ratedMovies;
          state.ratedTv = action.payload.ratedTv;
          state.ratedEpisodes = action.payload.ratedEpisodes;
          state.lists = action.payload.lists;
        }
      )
      .addCase(fetchAccountData.rejected, (state, action) => {
        state.loadingData = false;
        state.errorData =
          action.payload ?? action.error.message ?? "Unknown error";
      })

      // toggle favorite
      .addCase(toggleFavorite.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(toggleFavorite.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload ?? action.error.message ?? "Unknown error";
      })

      // toggle watchlist
      .addCase(toggleWatchlist.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(toggleWatchlist.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(toggleWatchlist.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload ?? action.error.message ?? "Unknown error";
      });
  },
});

export const { clearAccountState } = accountSlice.actions;

// Selector typed RootState đầy đủ
export const selectAccount = (state: RootState) => state.account;

export default accountSlice.reducer;
