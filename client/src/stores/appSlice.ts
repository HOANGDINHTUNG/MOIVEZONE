import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  pageLoading: boolean;
}

const initialState: AppState = {
  pageLoading: true, // mặc định: đang loading
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPageLoading(state, action: PayloadAction<boolean>) {
      state.pageLoading = action.payload;
    },
  },
});

export const { setPageLoading } = appSlice.actions;
export default appSlice.reducer;
