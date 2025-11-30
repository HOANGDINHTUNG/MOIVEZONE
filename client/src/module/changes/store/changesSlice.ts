// src/module/changes/store/tmdbChangesSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TMDBChangeItem, TMDBChangeMediaType, TMDBChangesResponse } from "../database/interface/changes";
import { tmdbChangesApi, type TMDBChangesParams } from "../../../api/movie/TMDBChanges.api";

interface TMDBChangesListState {
  items: TMDBChangeItem[];
  page: number;
  total_pages: number;
  total_results: number;
  loading: boolean;
  error: string | null;
}

interface TMDBChangesState {
  movie: TMDBChangesListState;
  tv: TMDBChangesListState;
  person: TMDBChangesListState;
}

const createInitialListState = (): TMDBChangesListState => ({
  items: [],
  page: 1,
  total_pages: 1,
  total_results: 0,
  loading: false,
  error: null,
});

const initialState: TMDBChangesState = {
  movie: createInitialListState(),
  tv: createInitialListState(),
  person: createInitialListState(),
};

interface FetchChangesArgs extends TMDBChangesParams {
  mediaType: TMDBChangeMediaType;
}

interface FetchChangesPayload {
  mediaType: TMDBChangeMediaType;
  data: TMDBChangesResponse;
}

export const fetchTMDBChanges = createAsyncThunk<
  FetchChangesPayload, // return type
  FetchChangesArgs, // args
  { rejectValue: string } // reject value
>("tmdbChanges/fetch", async (args, { rejectWithValue }) => {
  const { mediaType, ...params } = args;

  try {
    const data = await tmdbChangesApi.getChanges(mediaType, params);
    return { mediaType, data };
  } catch (error: unknown) {
    let message = "Failed to fetch TMDB changes";

    if (error instanceof Error) {
      message = error.message || message;
    } else if (typeof error === "string") {
      message = error || message;
    }

    return rejectWithValue(message);
  }
});

const tmdbChangesSlice = createSlice({
  name: "tmdbChanges",
  initialState,
  reducers: {
    resetTMDBChanges: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTMDBChanges.pending, (state, action) => {
        const mediaType = action.meta.arg.mediaType;
        const target = state[mediaType];
        target.loading = true;
        target.error = null;
      })
      .addCase(fetchTMDBChanges.fulfilled, (state, action) => {
        const { mediaType, data } = action.payload;
        const target = state[mediaType];

        target.loading = false;
        target.items = data.results;
        target.page = data.page;
        target.total_pages = data.total_pages;
        target.total_results = data.total_results;
      })
      .addCase(fetchTMDBChanges.rejected, (state, action) => {
        const mediaType = action.meta.arg.mediaType;
        const target = state[mediaType];

        target.loading = false;
        target.error =
          action.payload || action.error.message || "Unknown error";
      });
  },
});

export const { resetTMDBChanges } = tmdbChangesSlice.actions;
export default tmdbChangesSlice.reducer;
