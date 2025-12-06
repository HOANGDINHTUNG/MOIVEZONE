import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { tmdbTvSeasonApi } from "../../../api/movie/TMDBTvSeason.api";
import type {
  TMDBTvSeasonChangesResponse,
  TMDBTvSeasonWatchProviders,
} from "../database/interface/tv_season";
import type { TMDBTvSeasonDetailFull } from "../../../api/movie/TMDBTvSeason.api";

export interface TvSeasonState {
  loading: boolean;
  error: string | null;
  detail: TMDBTvSeasonDetailFull | null;
  changes: TMDBTvSeasonChangesResponse | null;
  watchProviders: TMDBTvSeasonWatchProviders | null;
}

const initialState: TvSeasonState = {
  loading: false,
  error: null,
  detail: null,
  changes: null,
  watchProviders: null,
};

export const fetchTvSeason = createAsyncThunk<
  {
    detail: TMDBTvSeasonDetailFull;
    watchProviders: TMDBTvSeasonWatchProviders | null;
    changes: TMDBTvSeasonChangesResponse | null;
  },
  { seriesId: number; seasonNumber: number; language: string },
  { rejectValue: string }
>("tvSeason/fetchTvSeason", async (args, { rejectWithValue }) => {
  try {
    const detail = await tmdbTvSeasonApi.getSeasonDetailFull(args);

    let watchProviders: TMDBTvSeasonWatchProviders | null = null;
    let changes: TMDBTvSeasonChangesResponse | null = null;

    try {
      watchProviders = await tmdbTvSeasonApi.getSeasonWatchProviders({
        seriesId: args.seriesId,
        seasonNumber: args.seasonNumber,
      });
    } catch (e) {
      console.warn("getSeasonWatchProviders error:", e);
    }

    try {
      // /tv/season/{season_id}/changes
      changes = await tmdbTvSeasonApi.getSeasonChanges({
        seasonId: detail.id,
      });
    } catch (e) {
      console.warn("getSeasonChanges error:", e);
    }

    return { detail, watchProviders, changes };
  } catch (error: unknown) {
    console.error("fetchTvSeason error:", error);
    return rejectWithValue("Failed to fetch TV season");
  }
});

const tvSeasonSlice = createSlice({
  name: "tvSeason",
  initialState,
  reducers: {
    resetTvSeason(state) {
      state.detail = null;
      state.changes = null;
      state.watchProviders = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTvSeason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTvSeason.fulfilled,
        (
          state,
          action: PayloadAction<{
            detail: TMDBTvSeasonDetailFull;
            watchProviders: TMDBTvSeasonWatchProviders | null;
            changes: TMDBTvSeasonChangesResponse | null;
          }>
        ) => {
          state.loading = false;
          state.detail = action.payload.detail;
          state.watchProviders = action.payload.watchProviders;
          state.changes = action.payload.changes;
        }
      )
      .addCase(fetchTvSeason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { resetTvSeason } = tvSeasonSlice.actions;

export const selectTvSeasonState = (state: {
  tvSeason: TvSeasonState;
}): TvSeasonState => state.tvSeason;

export default tvSeasonSlice.reducer;
