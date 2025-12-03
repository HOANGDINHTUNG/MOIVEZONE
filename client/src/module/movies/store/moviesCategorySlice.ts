// src/module/movies/store/moviesCategorySlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { TMDBMovieListItem } from "../../accounts/database/interface/account";
import { tmdbMoviesApi } from "../../../api/movie/TMDBMovie.api";

interface MoviesCategoryState {
  nowPlaying: TMDBMovieListItem[];
  popular: TMDBMovieListItem[];
  topRated: TMDBMovieListItem[];
  upcoming: TMDBMovieListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesCategoryState = {
  nowPlaying: [],
  popular: [],
  topRated: [],
  upcoming: [],
  loading: false,
  error: null,
};

export const fetchMoviesCategories = createAsyncThunk(
  "movies/fetchCategories",
  async () => {
    const [nowPlaying, popular, topRated, upcoming] = await Promise.all([
      tmdbMoviesApi.getNowPlaying(),
      tmdbMoviesApi.getPopular(),
      tmdbMoviesApi.getTopRated(),
      tmdbMoviesApi.getUpcoming(),
    ]);

    return {
      nowPlaying: nowPlaying.results,
      popular: popular.results,
      topRated: topRated.results,
      upcoming: upcoming.results,
    };
  }
);

const moviesCategorySlice = createSlice({
  name: "moviesCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMoviesCategories.fulfilled,
        (
          state,
          action: PayloadAction<{
            nowPlaying: TMDBMovieListItem[];
            popular: TMDBMovieListItem[];
            topRated: TMDBMovieListItem[];
            upcoming: TMDBMovieListItem[];
          }>
        ) => {
          state.loading = false;
          state.nowPlaying = action.payload.nowPlaying;
          state.popular = action.payload.popular;
          state.topRated = action.payload.topRated;
          state.upcoming = action.payload.upcoming;
        }
      )
      .addCase(fetchMoviesCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default moviesCategorySlice.reducer;
