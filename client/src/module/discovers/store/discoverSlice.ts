import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TMDBDiscoverMovieItem, TMDBDiscoverMovieResponse, TMDBDiscoverTvItem, TMDBDiscoverTvResponse } from "../../../types/interface/discover";
import { tmdbDiscoverApi, type DiscoverMovieParams, type DiscoverTvParams } from "../../../api/TMDBDiscover.api";

interface DiscoverListState<T> {
  items: T[];
  page: number;
  total_pages: number;
  total_results: number;
  loading: boolean;
  error: string | null;
}

const createInitialListState = <T>(): DiscoverListState<T> => ({
  items: [],
  page: 1,
  total_pages: 1,
  total_results: 0,
  loading: false,
  error: null,
});

interface TMDBDiscoverState {
  movie: DiscoverListState<TMDBDiscoverMovieItem>;
  tv: DiscoverListState<TMDBDiscoverTvItem>;
}

const initialState: TMDBDiscoverState = {
  movie: createInitialListState<TMDBDiscoverMovieItem>(),
  tv: createInitialListState<TMDBDiscoverTvItem>(),
};

// ====== THUNKS ======

export const fetchDiscoverMovies = createAsyncThunk<
  TMDBDiscoverMovieResponse, // return type
  DiscoverMovieParams, // args
  { rejectValue: string }
>("tmdbDiscover/fetchMovies", async (params, { rejectWithValue }) => {
  try {
    const data = await tmdbDiscoverApi.getDiscoverMovies(params);
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch discover movies";

    if (error instanceof Error) {
      message = error.message || message;
    } else if (typeof error === "string") {
      message = error || message;
    }

    return rejectWithValue(message);
  }
});

export const fetchDiscoverTv = createAsyncThunk<
  TMDBDiscoverTvResponse,
  DiscoverTvParams,
  { rejectValue: string }
>("tmdbDiscover/fetchTv", async (params, { rejectWithValue }) => {
  try {
    const data = await tmdbDiscoverApi.getDiscoverTvSeries(params);
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch discover tv";

    if (error instanceof Error) {
      message = error.message || message;
    } else if (typeof error === "string") {
      message = error || message;
    }

    return rejectWithValue(message);
  }
});

// ====== SLICE ======

const tmdbDiscoverSlice = createSlice({
  name: "tmdbDiscover",
  initialState,
  reducers: {
    clearDiscoverState: () => initialState,
  },
  extraReducers: (builder) => {
    // MOVIE
    builder
      .addCase(fetchDiscoverMovies.pending, (state) => {
        state.movie.loading = true;
        state.movie.error = null;
      })
      .addCase(fetchDiscoverMovies.fulfilled, (state, action) => {
        state.movie.loading = false;
        state.movie.items = action.payload.results;
        state.movie.page = action.payload.page;
        state.movie.total_pages = action.payload.total_pages;
        state.movie.total_results = action.payload.total_results;
      })
      .addCase(fetchDiscoverMovies.rejected, (state, action) => {
        state.movie.loading = false;
        state.movie.error =
          action.payload || action.error.message || "Unknown error";
      });

    // TV
    builder
      .addCase(fetchDiscoverTv.pending, (state) => {
        state.tv.loading = true;
        state.tv.error = null;
      })
      .addCase(fetchDiscoverTv.fulfilled, (state, action) => {
        state.tv.loading = false;
        state.tv.items = action.payload.results;
        state.tv.page = action.payload.page;
        state.tv.total_pages = action.payload.total_pages;
        state.tv.total_results = action.payload.total_results;
      })
      .addCase(fetchDiscoverTv.rejected, (state, action) => {
        state.tv.loading = false;
        state.tv.error =
          action.payload || action.error.message || "Unknown error";
      });
  },
});

export const { clearDiscoverState } = tmdbDiscoverSlice.actions;
export default tmdbDiscoverSlice.reducer;
