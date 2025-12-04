// src/module/reviews/store/reviewSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tmdbReviewApi } from "../../../api/movie/TMDBReview.api";
import type { TMDBReviewDetails } from "../database/interface/review";

interface ReviewState {
  currentId: string | null;
  data: TMDBReviewDetails | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReviewState = {
  currentId: null,
  data: null,
  status: "idle",
  error: null,
};

export const fetchReviewById = createAsyncThunk<
  TMDBReviewDetails,
  { reviewId: string; language?: string },
  { rejectValue: string }
>("review/fetchById", async ({ reviewId, language }, { rejectWithValue }) => {
  try {
    const data = await tmdbReviewApi.getReview(reviewId, language);
    return data;
  } catch (error: unknown) {
    console.error("fetchReviewById error:", error);
    let message = "Failed to fetch review";
    if (error instanceof Error && error.message) {
      message = error.message;
    }
    return rejectWithValue(message);
  }
});

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReview(state) {
      state.currentId = null;
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchReviewById.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentId = action.meta.arg.reviewId;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error.message ?? null;
        }
      });
  },
});

export const { clearReview } = reviewSlice.actions;
export default reviewSlice.reducer;
