// src/module/search/store/searchSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  tmdbSearchApi,
  type SearchCategory,
} from "../../../api/movie/TMDBSearch.api";
import type {
  TMDBSearchCollectionItem,
  TMDBSearchCompanyItem,
  TMDBSearchKeywordItem,
  TMDBSearchMovieItem,
  TMDBSearchMultiItem,
  TMDBSearchPersonItem,
  TMDBSearchTvItem,
  TMDBSearchCollectionResponse,
  TMDBSearchCompanyResponse,
  TMDBSearchKeywordResponse,
  TMDBSearchMovieResponse,
  TMDBSearchMultiResponse,
  TMDBSearchPersonResponse,
  TMDBSearchTvResponse,
} from "../database/interface/search";
import type { RootState } from "../../../stores";

export interface SearchState {
  query: string;
  activeCategory: SearchCategory;
  page: number;

  loading: boolean;
  error: string | null;

  movieResults: TMDBSearchMovieItem[];
  tvResults: TMDBSearchTvItem[];
  personResults: TMDBSearchPersonItem[];
  collectionResults: TMDBSearchCollectionItem[];
  companyResults: TMDBSearchCompanyItem[];
  keywordResults: TMDBSearchKeywordItem[];
  multiResults: TMDBSearchMultiItem[];

  totalPagesByCategory: Partial<Record<SearchCategory, number>>;
  totalResultsByCategory: Partial<Record<SearchCategory, number>>;
}

const initialState: SearchState = {
  query: "",
  activeCategory: "multi",
  page: 1,
  loading: false,
  error: null,
  movieResults: [],
  tvResults: [],
  personResults: [],
  collectionResults: [],
  companyResults: [],
  keywordResults: [],
  multiResults: [],
  totalPagesByCategory: {},
  totalResultsByCategory: {},
};

interface FetchSearchArgs {
  query?: string;
  category?: SearchCategory;
  page?: number;
  language?: string;
  include_adult?: boolean;
}

/**
 * Kiểu payload trả về của fetchSearch theo từng category
 */
type SearchThunkResult =
  | ({ category: "movie" } & TMDBSearchMovieResponse)
  | ({ category: "tv" } & TMDBSearchTvResponse)
  | ({ category: "person" } & TMDBSearchPersonResponse)
  | ({ category: "collection" } & TMDBSearchCollectionResponse)
  | ({ category: "company" } & TMDBSearchCompanyResponse)
  | ({ category: "keyword" } & TMDBSearchKeywordResponse)
  | ({ category: "multi" } & TMDBSearchMultiResponse);

// thunk dùng chung, switch endpoint theo category
export const fetchSearch = createAsyncThunk<
  SearchThunkResult,
  FetchSearchArgs,
  { state: RootState }
>("search/fetchSearch", async (args, { getState }) => {
  const state = getState();
  const current = state.search;

  const query = args.query ?? current.query;
  const category = args.category ?? current.activeCategory;
  const page = args.page ?? 1;

  const language = args.language ?? "en-US";
  const include_adult = args.include_adult ?? false;

  const baseParams = { query, page, language, include_adult };

  switch (category) {
    case "movie":
      return {
        category,
        ...(await tmdbSearchApi.searchMovie(baseParams)),
      };
    case "tv":
      return {
        category,
        ...(await tmdbSearchApi.searchTv(baseParams)),
      };
    case "person":
      return {
        category,
        ...(await tmdbSearchApi.searchPerson(baseParams)),
      };
    case "collection":
      return {
        category,
        ...(await tmdbSearchApi.searchCollection(baseParams)),
      };
    case "company":
      return {
        category,
        ...(await tmdbSearchApi.searchCompany(baseParams)),
      };
    case "keyword":
      return {
        category,
        ...(await tmdbSearchApi.searchKeyword(baseParams)),
      };
    case "multi":
    default:
      return {
        category: "multi" as const,
        ...(await tmdbSearchApi.searchMulti(baseParams)),
      };
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setActiveCategory(state, action: PayloadAction<SearchCategory>) {
      state.activeCategory = action.payload;
      state.page = 1;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.page = 1;
    },
    resetResults(state) {
      state.movieResults = [];
      state.tvResults = [];
      state.personResults = [];
      state.collectionResults = [];
      state.companyResults = [];
      state.keywordResults = [];
      state.multiResults = [];
      state.totalPagesByCategory = {};
      state.totalResultsByCategory = {};
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      // ❌ không dùng PayloadAction<any> nữa
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false;
        const { category, results, total_pages, total_results, page } =
          action.payload;

        state.page = page ?? 1;
        state.totalPagesByCategory[category] = total_pages;
        state.totalResultsByCategory[category] = total_results;

        switch (category) {
          case "movie":
            state.movieResults = results;
            break;
          case "tv":
            state.tvResults = results;
            break;
          case "person":
            state.personResults = results;
            break;
          case "collection":
            state.collectionResults = results;
            break;
          case "company":
            state.companyResults = results;
            break;
          case "keyword":
            state.keywordResults = results;
            break;
          case "multi":
          default:
            state.multiResults = results;
            break;
        }
      });
  },
});

export const { setActiveCategory, setQuery, resetResults } =
  searchSlice.actions;
export default searchSlice.reducer;

// selectors
export const selectSearchState = (state: RootState) => state.search;
