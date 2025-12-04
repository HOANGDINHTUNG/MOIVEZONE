import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../../stores";
import {
  getCollectionDetails,
  getCollectionImages,
  getCollectionTranslations,
} from "../../../api/movie/TMDBCollection.api";
import type {
  TMDBCollectionDetailsResponse,
  TMDBCollectionImagesResponse,
  TMDBCollectionTranslationsResponse,
} from "../database/interface/collection";

interface CollectionState {
  current: TMDBCollectionDetailsResponse | null;
  images: TMDBCollectionImagesResponse | null;
  translations: TMDBCollectionTranslationsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CollectionState = {
  current: null,
  images: null,
  translations: null,
  loading: false,
  error: null,
};

// thunk: fetch chi tiết + ảnh + translations theo language hiện tại
export const fetchCollectionById = createAsyncThunk<
  {
    details: TMDBCollectionDetailsResponse;
    images: TMDBCollectionImagesResponse;
    translations: TMDBCollectionTranslationsResponse;
  },
  number,
  { state: RootState }
>("collection/fetchById", async (id, { getState }) => {
  const state = getState();
  const language = state.language.current || "en";

  const [detailsRes, imagesRes, translationsRes] = await Promise.all([
    getCollectionDetails(id, language),
    getCollectionImages(id, language),
    getCollectionTranslations(id),
  ]);

  return {
    details: detailsRes.data,
    images: imagesRes.data,
    translations: translationsRes.data,
  };
});

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    clearCollection(state) {
      state.current = null;
      state.images = null;
      state.translations = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.details;
        state.images = action.payload.images;
        state.translations = action.payload.translations;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch collection";
      });
  },
});

export const { clearCollection } = collectionSlice.actions;
export default collectionSlice.reducer;
