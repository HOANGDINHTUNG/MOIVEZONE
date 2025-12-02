import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  TMDBNetworkDetails,
  TMDBNetworkAltName,
  TMDBNetworkLogo,
} from "../database/interface/network";
import {
  fetchNetworkAltNames,
  fetchNetworkDetails,
  fetchNetworkImages,
} from "../../../api/movie/TMDBNetwork.api";

export interface NetworkState {
  details: TMDBNetworkDetails | null;
  altNames: TMDBNetworkAltName[];
  logos: TMDBNetworkLogo[];
  loading: boolean;
  error: string | null;
}

const initialState: NetworkState = {
  details: null,
  altNames: [],
  logos: [],
  loading: false,
  error: null,
};

// ✅ thunk: load hết 3 API cùng lúc
export const fetchNetworkAll = createAsyncThunk(
  "network/fetchNetworkAll",
  async (networkId: number | string) => {
    const [details, altNamesRes, imagesRes] = await Promise.all([
      fetchNetworkDetails(networkId),
      fetchNetworkAltNames(networkId),
      fetchNetworkImages(networkId),
    ]);

    // sắp xếp logo theo vote_count
    const sortedLogos = (imagesRes.logos || [])
      .slice()
      .sort((a, b) => b.vote_count - a.vote_count);

    return {
      details,
      altNames: altNamesRes.results || [],
      logos: sortedLogos,
    };
  }
);

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    clearNetwork(state) {
      state.details = null;
      state.altNames = [];
      state.logos = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetworkAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNetworkAll.fulfilled,
        (
          state,
          action: PayloadAction<{
            details: TMDBNetworkDetails;
            altNames: TMDBNetworkAltName[];
            logos: TMDBNetworkLogo[];
          }>
        ) => {
          state.loading = false;
          state.details = action.payload.details;
          state.altNames = action.payload.altNames;
          state.logos = action.payload.logos;
        }
      )
      .addCase(fetchNetworkAll.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.error.message as string) || "Không tải được dữ liệu network.";
      });
  },
});

export const { clearNetwork } = networkSlice.actions;
export default networkSlice.reducer;
