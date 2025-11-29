// src/module/configuration/store/configurationSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  TMDBConfigurationResponse,
  TMDBCountriesResponse,
  TMDBJobsResponse,
  TMDBLanguagesResponse,
  TMDBPrimaryTranslationsResponse,
  TMDBTimezonesResponse,
} from "../database/interface/configuration";
import { tmdbConfigApi } from "../../../api/TMDBConfiguration.api";
interface TMDBConfigurationState {
  configuration: TMDBConfigurationResponse | null;
  countries: TMDBCountriesResponse;
  jobs: TMDBJobsResponse;
  languages: TMDBLanguagesResponse;
  primaryTranslations: TMDBPrimaryTranslationsResponse;
  timezones: TMDBTimezonesResponse;
  loading: boolean;
  error: string | null;
}

const initialState: TMDBConfigurationState = {
  configuration: null,
  countries: [],
  jobs: [],
  languages: [],
  primaryTranslations: [],
  timezones: [],
  loading: false,
  error: null,
};

// Kiểu return khi fulfilled
type TMDBConfigPayload = {
  configuration: TMDBConfigurationResponse;
  countries: TMDBCountriesResponse;
  jobs: TMDBJobsResponse;
  languages: TMDBLanguagesResponse;
  primaryTranslations: TMDBPrimaryTranslationsResponse;
  timezones: TMDBTimezonesResponse;
};

export const fetchAllTMDBConfiguration = createAsyncThunk<
  TMDBConfigPayload, // Return type khi fulfilled
  void, // Tham số truyền vào (ở đây không dùng nên là void)
  { rejectValue: string } // Kiểu payload khi rejectWithValue
>("tmdbConfig/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const [
      configuration,
      countries,
      jobs,
      languages,
      primaryTranslations,
      timezones,
    ] = await Promise.all([
      tmdbConfigApi.getConfiguration(),
      tmdbConfigApi.getCountries(),
      tmdbConfigApi.getJobs(),
      tmdbConfigApi.getLanguages(),
      tmdbConfigApi.getPrimaryTranslations(),
      tmdbConfigApi.getTimezones(),
    ]);

    return {
      configuration,
      countries,
      jobs,
      languages,
      primaryTranslations,
      timezones,
    };
  } catch (error: unknown) {
    let message = "Failed to fetch TMDB config";

    if (error instanceof Error) {
      message = error.message || message;
    } else if (typeof error === "string") {
      message = error || message;
    }

    return rejectWithValue(message);
  }
});

const tmdbConfigurationSlice = createSlice({
  name: "tmdbConfig",
  initialState,
  reducers: {
    clearTMDBConfig: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTMDBConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTMDBConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configuration = action.payload.configuration;
        state.countries = action.payload.countries;
        state.jobs = action.payload.jobs;
        state.languages = action.payload.languages;
        state.primaryTranslations = action.payload.primaryTranslations;
        state.timezones = action.payload.timezones;
      })
      .addCase(fetchAllTMDBConfiguration.rejected, (state, action) => {
        state.loading = false;
        // vì đã khai báo rejectValue: string, nên action.payload là string | undefined
        state.error = action.payload || action.error.message || "Unknown error";
      });
  },
});

export const { clearTMDBConfig } = tmdbConfigurationSlice.actions;
export default tmdbConfigurationSlice.reducer;
