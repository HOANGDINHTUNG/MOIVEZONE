import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TMDBCreditDetailsResponse } from "../database/interface/credit";
import { tmdbCreditApi } from "../../../api/movie/TMDBCredit.api";

interface TMDBCreditDetailsState {
  currentId: string | null;
  data: TMDBCreditDetailsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: TMDBCreditDetailsState = {
  currentId: null,
  data: null,
  loading: false,
  error: null,
};

export const fetchTMDBCreditDetails = createAsyncThunk<
  TMDBCreditDetailsResponse, // return type
  string, // creditId
  { rejectValue: string }
>("tmdbCredit/fetchById", async (creditId, { rejectWithValue }) => {
  try {
    const data = await tmdbCreditApi.getCreditDetails(creditId);
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch TMDB credit details";

    if (error instanceof Error) {
      message = error.message || message;
    } else if (typeof error === "string") {
      message = error || message;
    }

    return rejectWithValue(message);
  }
});

const creditDetailsSlice = createSlice({
  name: "tmdbCreditDetails",
  initialState,
  reducers: {
    clearCreditDetails: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTMDBCreditDetails.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentId = action.meta.arg;
      })
      .addCase(fetchTMDBCreditDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTMDBCreditDetails.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload || action.error.message || "Unknown error";
      });
  },
});

export const { clearCreditDetails } = creditDetailsSlice.actions;
export default creditDetailsSlice.reducer;
