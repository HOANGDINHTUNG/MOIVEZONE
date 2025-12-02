// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../module/movies/store/moviesSlice";
import languageReducer from "../module/movies/store/languageSlice";
import collectionReducer from "../module/collections/store/collectionSlice";
import companyReducer from "../module/company/store/companySlice";
import certificationsReducer from "../module/certifications/store/certificationSlice";
import tmdbConfigurationReducer from "../module/configuration/store/configurationSlice";
import tmdbChangesReducer from "../module/changes/store/changesSlice";
import creditDetailsReducer from "../module/credits/store/creditDetailsSlice";
import tmdbDiscoverReducer from "../module/discovers/store/discoverSlice";
import tmdbGenresReducer from "../module/movies/store/genresSlice";
import accountReducer from "../module/accounts/store/accountSlice";
import authReducer from "../module/auth/store/authSlice"
export const store = configureStore({
  reducer: {
    moviesData: moviesReducer,
    language: languageReducer,
    collection: collectionReducer,
    company: companyReducer,
    certifications: certificationsReducer,
    tmdbConfig: tmdbConfigurationReducer,
    tmdbChanges: tmdbChangesReducer,
    tmdbCreditDetails: creditDetailsReducer,
    tmdbDiscover: tmdbDiscoverReducer,
    tmdbGenres: tmdbGenresReducer,
    account: accountReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
