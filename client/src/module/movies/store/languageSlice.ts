import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppLanguage = "vi-VN" | "en-US";

export interface LanguageState {
  current: AppLanguage; // chỉ dùng field này
}

const getInitialLanguage = (): AppLanguage => {
  // Phòng trường hợp chạy trên server (SSR / build)
  if (typeof window === "undefined") return "vi-VN";

  const stored = localStorage.getItem("appLanguage") as AppLanguage | null;
  if (stored === "vi-VN" || stored === "en-US") return stored;

  const navigatorLang = navigator.language;
  if (navigatorLang.startsWith("vi")) return "vi-VN";
  return "en-US";
};

const initialState: LanguageState = {
  current: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<AppLanguage>) {
      state.current = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("appLanguage", action.payload);
      }
    },
    toggleLanguage(state) {
      state.current = state.current === "vi-VN" ? "en-US" : "vi-VN";
      if (typeof window !== "undefined") {
        localStorage.setItem("appLanguage", state.current);
      }
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
