// src/module/person/store/personSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tmdbPersonApi } from "../../../api/movie/TMDBPerson.api";
import type {
  TMDBLatestPersonResponse,
  TMDBPersonChangesResponse,
  TMDBPersonCombinedCredits,
  TMDBPersonDetails,
  TMDBPersonExternalIds,
  TMDBPersonImagesResponse,
  TMDBPersonMovieCredits,
  TMDBPersonTaggedImagesResponse,
  TMDBPersonTranslationsResponse,
  TMDBPersonTvCredits,
} from "../database/interface/person";

interface PersonFullData {
  details: TMDBPersonDetails;
  combinedCredits: TMDBPersonCombinedCredits;
  movieCredits: TMDBPersonMovieCredits;
  tvCredits: TMDBPersonTvCredits;
  externalIds: TMDBPersonExternalIds;
  images: TMDBPersonImagesResponse;
  taggedImages: TMDBPersonTaggedImagesResponse;
  changes: TMDBPersonChangesResponse;
  translations: TMDBPersonTranslationsResponse;
  latest: TMDBLatestPersonResponse | null;
}

interface PersonState {
  currentId: number | null;
  data: PersonFullData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PersonState = {
  currentId: null,
  data: null,
  status: "idle",
  error: null,
};

export const fetchPersonFull = createAsyncThunk<
  PersonFullData,
  { personId: number; language?: string },
  { rejectValue: string }
>(
  "person/fetchPersonFull",
  async ({ personId, language }, { rejectWithValue }) => {
    try {
      const [
        details,
        combinedCredits,
        movieCredits,
        tvCredits,
        externalIds,
        images,
        taggedImages,
        changes,
        translations,
        latest,
      ] = await Promise.all([
        tmdbPersonApi.getDetails(personId, language),
        tmdbPersonApi.getCombinedCredits(personId, language),
        tmdbPersonApi.getMovieCredits(personId, language),
        tmdbPersonApi.getTvCredits(personId, language),
        tmdbPersonApi.getExternalIds(personId),
        tmdbPersonApi.getImages(personId),
        tmdbPersonApi.getTaggedImages(personId, 1),
        tmdbPersonApi.getChanges(personId),
        tmdbPersonApi.getTranslations(personId),
        tmdbPersonApi.getLatest(language).catch(() => null), // phòng khi TMDB lỗi
      ]);

      return {
        details,
        combinedCredits,
        movieCredits,
        tvCredits,
        externalIds,
        images,
        taggedImages,
        changes,
        translations,
        latest: latest ?? null,
      };
    } catch (error: unknown) {
      console.error("fetchPersonFull error:", error);

      let message = "Failed to fetch person";
      if (error instanceof Error && error.message) {
        message = error.message;
      }

      return rejectWithValue(message);
    }
  }
);

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    clearPerson(state) {
      state.currentId = null;
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPersonFull.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentId = action.meta.arg.personId;
      })
      .addCase(fetchPersonFull.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchPersonFull.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          // rejectWithValue
          state.error = action.payload;
        } else {
          // lỗi không dùng rejectWithValue (hiếm khi)
          state.error = action.error.message ?? null;
        }
      });
  },
});

export const { clearPerson } = personSlice.actions;
export default personSlice.reducer;
