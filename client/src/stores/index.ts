// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../module/movies/store/moviesSlice";
import languageReducer from "../module/movies/store/languageSlice";
import collectionReducer from "../module/collections/store/collectionSlice";
export const store = configureStore({
  reducer: {
    moviesData: moviesReducer,
    language: languageReducer,
    collection: collectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
