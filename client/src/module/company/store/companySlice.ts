import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../../stores";

import {
  getCompanyDetails,
  getCompanyAltNames,
  getCompanyImages,
} from "../../../api/movie/TMDBCompany.api";
import type {
  TMDBCompanyAltNamesResponse,
  TMDBCompanyDetailsResponse,
  TMDBCompanyImagesResponse,
} from "../database/interface/company";

interface CompanyState {
  details: TMDBCompanyDetailsResponse | null;
  altNames: TMDBCompanyAltNamesResponse | null;
  images: TMDBCompanyImagesResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  details: null,
  altNames: null,
  images: null,
  loading: false,
  error: null,
};

export const fetchCompanyById = createAsyncThunk<
  {
    details: TMDBCompanyDetailsResponse;
    altNames: TMDBCompanyAltNamesResponse;
    images: TMDBCompanyImagesResponse;
  },
  number,
  { state: RootState }
>("company/fetchById", async (id) => {
  const [detailsRes, altNamesRes, imagesRes] = await Promise.all([
    getCompanyDetails(id),
    getCompanyAltNames(id),
    getCompanyImages(id),
  ]);

  return {
    details: detailsRes.data,
    altNames: altNamesRes.data,
    images: imagesRes.data,
  };
});

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompany(state) {
      state.details = null;
      state.altNames = null;
      state.images = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.details;
        state.altNames = action.payload.altNames;
        state.images = action.payload.images;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch company";
      });
  },
});

export const { clearCompany } = companySlice.actions;
export default companySlice.reducer;
