import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  TMDBTimeWindow,
  TMDBTrendingAllItem,
  TMDBTrendingAllResponse,
} from "../database/interface/trending";
import { tmdbTrendingApi } from "../../../api/movie/TMDBTrending.api";

// ----------- Thunk call TMDB -----------
export const fetchTrending = createAsyncThunk<
  TMDBTrendingAllResponse,
  {
    category: string;
    timeWindow: TMDBTimeWindow;
    page: number;
    language: string;
  }
>(
  "trending/fetchTrending",
  async ({ category, timeWindow, page, language }) => {
    if (category === "all") {
      return await tmdbTrendingApi.getTrendingAll(timeWindow, page, language);
    }
    if (category === "movie") {
      return await tmdbTrendingApi.getTrendingMovies(
        timeWindow,
        page,
        language
      );
    }
    if (category === "tv") {
      return await tmdbTrendingApi.getTrendingTv(timeWindow, page, language);
    }
    return await tmdbTrendingApi.getTrendingPeople(timeWindow, page, language);
  }
);

// ----------- Slice state -----------
interface TrendingState {
  category: "all" | "movie" | "tv" | "person";
  timeWindow: TMDBTimeWindow;
  page: number;

  items: TMDBTrendingAllItem[];
  totalPages: number;

  loading: boolean;
  error: string | null;
}

const initialState: TrendingState = {
  category: "all",
  timeWindow: "day",
  page: 1,
  items: [],
  totalPages: 1,

  loading: false,
  error: null,
};

// ----------- Slice -----------
const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<TrendingState["category"]>) {
      state.category = action.payload;
      state.page = 1;
    },
    setTimeWindow(state, action: PayloadAction<TMDBTimeWindow>) {
      state.timeWindow = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.totalPages = action.payload.total_pages;
      })

      .addCase(fetchTrending.rejected, (state) => {
        state.loading = false;
        state.error = "Không thể tải dữ liệu Trending.";
      });
  },
});

export const { setCategory, setTimeWindow, setPage } = trendingSlice.actions;
export default trendingSlice.reducer;
