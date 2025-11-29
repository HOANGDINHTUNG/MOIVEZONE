import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../../stores";
import {
  getMovieCertifications,
  getTvCertifications,
} from "../../../api/TMDBCertification.api";
import type { TMDBCertificationResponse } from "../database/interface/certification";

interface CertificationState {
  movie: TMDBCertificationResponse | null;
  tv: TMDBCertificationResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CertificationState = {
  movie: null,
  tv: null,
  loading: false,
  error: null,
};

export const fetchCertifications = createAsyncThunk<
  { movie: TMDBCertificationResponse; tv: TMDBCertificationResponse },
  void,
  { state: RootState }
>("certifications/fetchAll", async () => {
  const [movieRes, tvRes] = await Promise.all([
    getMovieCertifications(),
    getTvCertifications(),
  ]);

  return {
    movie: movieRes.data,
    tv: tvRes.data,
  };
});

const certificationSlice = createSlice({
  name: "certifications",
  initialState,
  reducers: {
    clearCertifications(state) {
      state.movie = null;
      state.tv = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertifications.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload.movie;
        state.tv = action.payload.tv;
      })
      .addCase(fetchCertifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch certifications";
      });
  },
});

export const { clearCertifications } = certificationSlice.actions;
export default certificationSlice.reducer;
