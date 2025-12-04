import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { TMDBTvSummary } from "../database/interface/tvList";
import { tmdbTvApi } from "../../../api/movie/TMDBTv.api";

interface TvCategoryState {
  airingToday: TMDBTvSummary[];
  onTheAir: TMDBTvSummary[];
  popular: TMDBTvSummary[];
  topRated: TMDBTvSummary[];
  loading: boolean;
  error: string | null;
}

const initialState: TvCategoryState = {
  airingToday: [],
  onTheAir: [],
  popular: [],
  topRated: [],
  loading: false,
  error: null,
};

export const fetchTvCategories = createAsyncThunk(
  "tv/fetchCategories",
  async () => {
    const [airingToday, onTheAir, popular, topRated] = await Promise.all([
      tmdbTvApi.getAiringToday(),
      tmdbTvApi.getOnTheAirTv(),
      tmdbTvApi.getPopularTv(),
      tmdbTvApi.getTopRated(),
    ]);

    return {
      airingToday: airingToday.results,
      onTheAir: onTheAir.results,
      popular: popular.results,
      topRated: topRated.results,
    };
  }
);

const tvCategorySlice = createSlice({
  name: "tvCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTvCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTvCategories.fulfilled,
        (
          state,
          action: PayloadAction<{
            airingToday: TMDBTvSummary[];
            onTheAir: TMDBTvSummary[];
            popular: TMDBTvSummary[];
            topRated: TMDBTvSummary[];
          }>
        ) => {
          state.loading = false;
          state.airingToday = action.payload.airingToday;
          state.onTheAir = action.payload.onTheAir;
          state.popular = action.payload.popular;
          state.topRated = action.payload.topRated;
        }
      )
      .addCase(fetchTvCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default tvCategorySlice.reducer;
