import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../../stores";

// ====== TMDB TYPES MỚI ======
import type {
  TMDBMovieSummary,
  TMDBMovieDetailsResponse,
} from "../database/interface/movie";

import type { TMDBTvSummary } from "../database/interface/tvList";
import { tmdbMoviesApi } from "../../../api/movie/TMDBMovie.api";
import { tmdbTvApi } from "../../../api/movie/TMDBTv.api";
import type { TMDBTvDetailsResponse } from "../database/interface/tv";

// ================== STATE TYPE ==================

export interface MoviesState {
  // Config & banner
  imageURL: string;
  bannerData: TMDBMovieSummary[];

  // Movie lists (home)
  nowPlaying: TMDBMovieSummary[];
  upcoming: TMDBMovieSummary[];
  popular: TMDBMovieSummary[];
  topRated: TMDBMovieSummary[];

  // TV lists (home)
  popularTv: TMDBTvSummary[];
  onTheAirTv: TMDBTvSummary[];

  // Detail
  selectedMovie: TMDBMovieDetailsResponse | null;
  selectedTv: TMDBTvDetailsResponse | null;

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
  TMDBMovieSummary[],
  void,
  { state: RootState }
>("movies/fetchNowPlayingMovies", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbMoviesApi.getNowPlaying(1, language); // 👈 bỏ generic
  return res.results; // TMDBNowPlayingResponse.results => TMDBMovieSummary[]
});

export const fetchUpcomingMovies = createAsyncThunk<
  TMDBMovieSummary[],
  void,
  { state: RootState }
>("movies/fetchUpcomingMovies", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbMoviesApi.getUpcoming(1, language); // 👈 bỏ generic
  return res.results;
});

export const fetchPopularMovies = createAsyncThunk<
  TMDBMovieSummary[],
  void,
  { state: RootState }
>("movies/fetchPopularMovies", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbMoviesApi.getPopular(1, language); // 👈 bỏ generic
  return res.results;
});

export const fetchTopRatedMovies = createAsyncThunk<
  TMDBMovieSummary[],
  void,
  { state: RootState }
>("movies/fetchTopRatedMovies", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbMoviesApi.getTopRated(1, language); // 👈 bỏ generic
  return res.results;
});

// TV list
export const fetchPopularTvShows = createAsyncThunk<
  TMDBTvSummary[],
  void,
  { state: RootState }
>("movies/fetchPopularTvShows", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbTvApi.getPopularTv(1, language);
  // giả sử getPopularTv đã trả TMDBPaginatedResponse<TMDBTvSummary>
  return res.results as TMDBTvSummary[];
});

export const fetchOnTheAirTvShows = createAsyncThunk<
  TMDBTvSummary[],
  void,
  { state: RootState }
>("movies/fetchOnTheAirTvShows", async (_unused, { getState }) => {
  const language = getLanguage(getState());
  const res = await tmdbTvApi.getOnTheAirTv(1, language);
  return res.results as TMDBTvSummary[];
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
    setBannerData(state, action: PayloadAction<TMDBMovieSummary[]>) {
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
        state.errorList =
          action.error.message ?? "Failed to load now playing movies";
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
        state.errorList =
          action.error.message ?? "Failed to load upcoming movies";
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
        state.errorList =
          action.error.message ?? "Failed to load popular movies";
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
        state.errorList =
          action.error.message ?? "Failed to load top rated movies";
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
        state.errorList =
          action.error.message ?? "Failed to load popular tv shows";
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
        state.errorList =
          action.error.message ?? "Failed to load on-the-air tv shows";
      });

    // // ===== MOVIE DETAIL =====
    // builder
    //   .addCase(fetchMovieDetailById.pending, (state) => {
    //     state.loadingDetail = true;
    //     state.errorDetail = null;
    //     state.selectedMovie = null;
    //   })
    //   .addCase(fetchMovieDetailById.fulfilled, (state, action) => {
    //     state.loadingDetail = false;
    //     state.selectedMovie = action.payload;
    //   })
    //   .addCase(fetchMovieDetailById.rejected, (state, action) => {
    //     state.loadingDetail = false;
    //     state.errorDetail =
    //       action.error.message ?? "Failed to load movie detail";
    //   });

    // // ===== TV DETAIL =====
    // builder
    //   .addCase(fetchTvDetailById.pending, (state) => {
    //     state.loadingDetail = true;
    //     state.errorDetail = null;
    //     state.selectedTv = null;
    //   })
    //   .addCase(fetchTvDetailById.fulfilled, (state, action) => {
    //     state.loadingDetail = false;
    //     state.selectedTv = action.payload;
    //   })
    //   .addCase(fetchTvDetailById.rejected, (state, action) => {
    //     state.loadingDetail = false;
    //     state.errorDetail = action.error.message ?? "Failed to load tv detail";
    //   });
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
