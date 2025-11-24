// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../module/movies/store/moviesSlice";
import languageReducer from "../module/movies/store/languageSlice";
export const store = configureStore({
  reducer: {
    moviesData: moviesReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
