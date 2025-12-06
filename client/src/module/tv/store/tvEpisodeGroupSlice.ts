import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axiosTMDB from "../../../app/axiosTMDB";
import type { RootState } from "../../../stores";

import type { TMDBTvEpisodeGroupDetails } from "../database/interface/tv_episode_group";

interface FetchTvEpisodeGroupArgs {
  groupId: string;
  language: string;
}

interface TvEpisodeGroupState {
  loading: boolean;
  error: string | null;
  detail: TMDBTvEpisodeGroupDetails | null;
}

const initialState: TvEpisodeGroupState = {
  loading: false,
  error: null,
  detail: null,
};

const getErrorMessage = (error: unknown): string => {
  const maybeAxios = error as AxiosError<{ status_message?: string }>;
  if (maybeAxios?.response?.data?.status_message) {
    return maybeAxios.response.data.status_message;
  }
  if (error instanceof Error) return error.message;
  return "Failed to load episode group";
};

export const fetchTvEpisodeGroup = createAsyncThunk<
  TMDBTvEpisodeGroupDetails,
  FetchTvEpisodeGroupArgs,
  { rejectValue: string }
>(
  "tvEpisodeGroup/fetchTvEpisodeGroup",
  async ({ groupId, language }, { rejectWithValue }) => {
    try {
      const res = await axiosTMDB.get<TMDBTvEpisodeGroupDetails>(
        `/tv/episode_group/${groupId}`,
        {
          params: {
            language,
          },
        }
      );
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const tvEpisodeGroupSlice = createSlice({
  name: "tvEpisodeGroup",
  initialState,
  reducers: {
    resetTvEpisodeGroupState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTvEpisodeGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTvEpisodeGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchTvEpisodeGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Unknown error";
      });
  },
});

export const { resetTvEpisodeGroupState } = tvEpisodeGroupSlice.actions;

export const selectTvEpisodeGroupState = (state: RootState) =>
  state.tvEpisodeGroup;

export default tvEpisodeGroupSlice.reducer;
