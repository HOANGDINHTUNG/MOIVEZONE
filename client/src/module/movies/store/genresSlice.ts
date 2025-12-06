import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TMDBGenre } from "../database/interface/genre";
import { tmdbGenresApi } from "../../../api/movie/TMDBGenres.api";

interface GenresState {
  movieGenres: TMDBGenre[];
  tvGenres: TMDBGenre[];
  movieMap: Record<number, TMDBGenre>;
  tvMap: Record<number, TMDBGenre>;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: GenresState = {
  movieGenres: [],
  tvGenres: [],
  movieMap: {},
  tvMap: {},
  loading: false,
  loaded: false,
  error: null,
};

export const fetchTMDBGenres = createAsyncThunk<
  { movie: TMDBGenre[]; tv: TMDBGenre[] },
  void,
  { rejectValue: string }
>("tmdbGenres/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const [movieRes, tvRes] = await Promise.all([
      tmdbGenresApi.getMovieGenres(),
      tmdbGenresApi.getTvGenres(),
    ]);

    return {
      movie: movieRes.genres,
      tv: tvRes.genres,
    };
  } catch (error: unknown) {
    let message = "Failed to fetch TMDB genres";

    if (error instanceof Error) {
      message = error.message || message;
    } else if (typeof error === "string") {
      message = error || message;
    }

    return rejectWithValue(message);
  }
});

const tmdbGenresSlice = createSlice({
  name: "tmdbGenres",
  initialState,
  reducers: {
    clearGenres: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTMDBGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTMDBGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;

        state.movieGenres = action.payload.movie;
        state.tvGenres = action.payload.tv;

        // build map id -> genre object
        const movieMap: Record<number, TMDBGenre> = {};
        const tvMap: Record<number, TMDBGenre> = {};

        action.payload.movie.forEach((g) => {
          movieMap[g.id] = g;
        });
        action.payload.tv.forEach((g) => {
          tvMap[g.id] = g;
        });

        state.movieMap = movieMap;
        state.tvMap = tvMap;
      })
      .addCase(fetchTMDBGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Unknown error";
      });
  },
});

export const { clearGenres } = tmdbGenresSlice.actions;
export default tmdbGenresSlice.reducer;
