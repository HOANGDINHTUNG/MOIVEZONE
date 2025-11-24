// src/module/movies/store/moviesSlice.ts

import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import { tmdbApi } from "../../../api/TMDB.api";
import type {
  MovieDetail,
  MovieSummary,
} from "../database/interface/movie";
import type {
  TvDetail,
  TvSummary,
} from "../database/interface/tv";
import type { RootState } from "../../../stores";

// ================== STATE TYPE ==================

export interface MoviesState {
  // Config & banner
  imageURL: string;
  bannerData: MovieSummary[];

  // Movie lists (home)
  nowPlaying: MovieSummary[];
  upcoming: MovieSummary[];
  popular: MovieSummary[];
  topRated: MovieSummary[];

  // TV lists (home)
  popularTv: TvSummary[];
  onTheAirTv: TvSummary[];

  // Detail
  selectedMovie: MovieDetail | null;
  selectedTv: TvDetail | null;

  // Loading / error
  loadingBanner: boolean;
  loadingLists: boolean;
  loadingDetail: boolean;
  errorList: string | null;
  errorDetail: string | null;
}

// ================== INITIAL STATE ==================

const initialState: MoviesState = {
  imageURL: "",
  bannerData: [],

  nowPlaying: [],
  upcoming: [],
  popular: [],
  topRated: [],

  popularTv: [],
  onTheAirTv: [],

  selectedMovie: null,
  selectedTv: null,

  loadingBanner: false,
  loadingLists: false,
  loadingDetail: false,
  errorList: null,
  errorDetail: null,
};

// Helper lấy language trong thunk
const getLanguage = (state: RootState) => state.language.current;

// ================== ASYNC THUNKS ==================

// Movie list
export const fetchNowPlayingMovies = createAsyncThunk<
  MovieSummary[],
  void,
  { state: RootState }
>("movies/fetchNowPlayingMovies", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbApi.getNowPlaying(1, language);
  return res.results;
});

export const fetchUpcomingMovies = createAsyncThunk<
  MovieSummary[],
  void,
  { state: RootState }
>("movies/fetchUpcomingMovies", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbApi.getUpcoming(1, language);
  return res.results;
});

export const fetchPopularMovies = createAsyncThunk<
  MovieSummary[],
  void,
  { state: RootState }
>("movies/fetchPopularMovies", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbApi.getPopular(1, language);
  return res.results;
});

export const fetchTopRatedMovies = createAsyncThunk<
  MovieSummary[],
  void,
  { state: RootState }
>("movies/fetchTopRatedMovies", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbApi.getTopRated(1, language);
  return res.results;
});

// TV list
export const fetchPopularTvShows = createAsyncThunk<
  TvSummary[],
  void,
  { state: RootState }
>("movies/fetchPopularTvShows", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbApi.getPopularTv(1, language);
  return res.results;
});

export const fetchOnTheAirTvShows = createAsyncThunk<
  TvSummary[],
  void,
  { state: RootState }
>("movies/fetchOnTheAirTvShows", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbApi.getOnTheAirTv(1, language);
  return res.results;
});

// Movie detail
export const fetchMovieDetailById = createAsyncThunk<
  MovieDetail,
  number,
  { state: RootState }
>("movies/fetchMovieDetailById", async (id, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbApi.getMovieDetail(id, language);
  return res;
});

// TV detail
export const fetchTvDetailById = createAsyncThunk<
  TvDetail,
  number,
  { state: RootState }
>("movies/fetchTvDetailById", async (id, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbApi.getTvDetail(id, language);
  return res;
});

// ================== SLICE ==================

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    // Cấu hình ảnh (base URL) – App.tsx sẽ dispatch
    setImageURL(state, action: PayloadAction<string>) {
      state.imageURL = action.payload;
    },

    // Dữ liệu banner (trending movie) – App.tsx sẽ dispatch
    setBannerData(state, action: PayloadAction<MovieSummary[]>) {
      state.bannerData = action.payload;
    },

    // Xoá detail khi rời trang
    clearSelectedMovie(state) {
      state.selectedMovie = null;
      state.errorDetail = null;
    },
    clearSelectedTv(state) {
      state.selectedTv = null;
      state.errorDetail = null;
    },
  },
  extraReducers: (builder) => {
    // ===== MOVIE LIST =====
    builder
      .addCase(fetchNowPlayingMovies.pending, (state) => {
        state.loadingLists = true;
        state.errorList = null;
      })
      .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
        state.loadingLists = false;
        state.nowPlaying = action.payload;
      })
      .addCase(fetchNowPlayingMovies.rejected, (state, action) => {
        state.loadingLists = false;
        state.errorList = action.error.message ?? "Failed to load now playing movies";
      });

    builder
      .addCase(fetchUpcomingMovies.pending, (state) => {
        state.loadingLists = true;
        state.errorList = null;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.loadingLists = false;
        state.upcoming = action.payload;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.loadingLists = false;
        state.errorList = action.error.message ?? "Failed to load upcoming movies";
      });

    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loadingLists = true;
        state.errorList = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loadingLists = false;
        state.popular = action.payload;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loadingLists = false;
        state.errorList = action.error.message ?? "Failed to load popular movies";
      });

    builder
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.loadingLists = true;
        state.errorList = null;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.loadingLists = false;
        state.topRated = action.payload;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.loadingLists = false;
        state.errorList = action.error.message ?? "Failed to load top rated movies";
      });

    // ===== TV LIST =====
    builder
      .addCase(fetchPopularTvShows.pending, (state) => {
        state.loadingLists = true;
        state.errorList = null;
      })
      .addCase(fetchPopularTvShows.fulfilled, (state, action) => {
        state.loadingLists = false;
        state.popularTv = action.payload;
      })
      .addCase(fetchPopularTvShows.rejected, (state, action) => {
        state.loadingLists = false;
        state.errorList = action.error.message ?? "Failed to load popular tv shows";
      });

    builder
      .addCase(fetchOnTheAirTvShows.pending, (state) => {
        state.loadingLists = true;
        state.errorList = null;
      })
      .addCase(fetchOnTheAirTvShows.fulfilled, (state, action) => {
        state.loadingLists = false;
        state.onTheAirTv = action.payload;
      })
      .addCase(fetchOnTheAirTvShows.rejected, (state, action) => {
        state.loadingLists = false;
        state.errorList = action.error.message ?? "Failed to load on-the-air tv shows";
      });

    // ===== MOVIE DETAIL =====
    builder
      .addCase(fetchMovieDetailById.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
        state.selectedMovie = null;
      })
      .addCase(fetchMovieDetailById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetailById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.errorDetail = action.error.message ?? "Failed to load movie detail";
      });

    // ===== TV DETAIL =====
    builder
      .addCase(fetchTvDetailById.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
        state.selectedTv = null;
      })
      .addCase(fetchTvDetailById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedTv = action.payload;
      })
      .addCase(fetchTvDetailById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.errorDetail = action.error.message ?? "Failed to load tv detail";
      });
  },
});

// ================== EXPORT ==================

export const {
  setImageURL,
  setBannerData,
  clearSelectedMovie,
  clearSelectedTv,
} = moviesSlice.actions;

export default moviesSlice.reducer;
