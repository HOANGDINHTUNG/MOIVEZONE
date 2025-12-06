// src/module/tvEpisode/store/tvEpisodeSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axiosTMDB from "../../../app/axiosTMDB";

import type {
  TMDBTvEpisodeDetails,
  TMDBTvEpisodeAccountStates,
  TMDBTvEpisodeChangesResponse,
  TMDBTvEpisodeCredits,
  TMDBTvEpisodeExternalIds,
  TMDBTvEpisodeImages,
  TMDBTvEpisodeTranslations,
  TMDBTvEpisodeVideos,
} from "../database/interface/tv_episode";
import type { RootState } from "../../../stores";

export type TMDBTvEpisodeDetailsWithAppend = TMDBTvEpisodeDetails & {
  account_states?: TMDBTvEpisodeAccountStates;
  credits?: TMDBTvEpisodeCredits;
  external_ids?: TMDBTvEpisodeExternalIds;
  images?: TMDBTvEpisodeImages;
  translations?: TMDBTvEpisodeTranslations;
  videos?: TMDBTvEpisodeVideos;
};

interface FetchTvEpisodeArgs {
  seriesId: number;
  seasonNumber: number;
  episodeNumber: number;
  language: string;
}

interface TvEpisodeState {
  loading: boolean;
  error: string | null;
  detail: TMDBTvEpisodeDetailsWithAppend | null;
  changes: TMDBTvEpisodeChangesResponse | null;
}

const initialState: TvEpisodeState = {
  loading: false,
  error: null,
  detail: null,
  changes: null,
};

// Helper parse error không dùng any
const getErrorMessage = (error: unknown): string => {
  const maybeAxios = error as AxiosError<{ status_message?: string }>;
  if (maybeAxios?.response?.data?.status_message) {
    return maybeAxios.response.data.status_message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load episode";
};

export const fetchTvEpisode = createAsyncThunk<
  {
    detail: TMDBTvEpisodeDetailsWithAppend;
    changes: TMDBTvEpisodeChangesResponse | null;
  },
  FetchTvEpisodeArgs,
  { rejectValue: string }
>(
  "tvEpisode/fetchTvEpisode",
  async (
    { seriesId, seasonNumber, episodeNumber, language },
    { rejectWithValue }
  ) => {
    try {
      // 1. Details + append_to_response
      const detailsRes = await axiosTMDB.get<TMDBTvEpisodeDetailsWithAppend>(
        `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`,
        {
          params: {
            language,
            append_to_response:
              "account_states,credits,external_ids,images,translations,videos",
          },
        }
      );

      const detail = detailsRes.data;
      let changes: TMDBTvEpisodeChangesResponse | null = null;

      // 2. Changes theo episode_id
      if (detail.id) {
        try {
          const changesRes = await axiosTMDB.get<TMDBTvEpisodeChangesResponse>(
            `/tv/episode/${detail.id}/changes`
          );
          changes = changesRes.data;
        } catch (error: unknown) {
          // Lỗi changes không làm hỏng cả trang, chỉ bỏ qua
          changes = null;
          console.error(error);
        }
      }

      return { detail, changes };
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      return rejectWithValue(message);
    }
  }
);

const tvEpisodeSlice = createSlice({
  name: "tvEpisode",
  initialState,
  reducers: {
    resetTvEpisodeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTvEpisode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTvEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.detail;
        state.changes = action.payload.changes;
      })
      .addCase(fetchTvEpisode.rejected, (state, action) => {
        state.loading = false;
        // action.payload sẽ là string | undefined vì mình đã set rejectValue: string
        state.error =
          action.payload ?? action.error.message ?? "Unknown error";
      });
  },
});

export const { resetTvEpisodeState } = tvEpisodeSlice.actions;

export const selectTvEpisodeState = (state: RootState) => state.tvEpisode;

export default tvEpisodeSlice.reducer;
