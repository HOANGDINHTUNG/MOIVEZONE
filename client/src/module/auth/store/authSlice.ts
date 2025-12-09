// src/module/auth/store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../database/interface/users";
import { updateUser } from "../../../api/server/User.api";
// THÊM DÒNG NÀY
import type { RootState } from "../../../stores";

export interface AuthState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
}

// Đọc user từ sessionStorage
const loadInitialUser = (): IUser | null => {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem("currentUser");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return parsed as IUser;
  } catch {
    return null;
  }
};

const initialUser = loadInitialUser();

const initialState: AuthState = {
  currentUser: initialUser,
  isAuthenticated: !!initialUser,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Khi đăng nhập thành công (ở LoginPage tìm được IUser)
    login: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;

      try {
        sessionStorage.setItem("currentUser", JSON.stringify(action.payload));
      } catch (error) {
        console.error(
          "Failed to persist currentUser to sessionStorage",
          error
        );
      }
    },

    // Cho phép set currentUser từ bất kỳ nơi nào khác (vd: sau updateUserDirect)
    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;

      try {
        if (action.payload) {
          sessionStorage.setItem(
            "currentUser",
            JSON.stringify(action.payload)
          );
        } else {
          sessionStorage.removeItem("currentUser");
        }
      } catch (error) {
        console.error(
          "Failed to persist currentUser to sessionStorage",
          error
        );
      }
    },

    // Khi logout
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;

      try {
        sessionStorage.removeItem("currentUser");
        localStorage.removeItem("moviezone_remember_email");
        localStorage.removeItem("token");
      } catch (error) {
        console.error("Failed to clear auth storage", error);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.fulfilled, (state, action) => {
      // Nếu currentUser khác id thì bỏ qua (tránh ghi nhầm user khác)
      if (!state.currentUser || state.currentUser.id !== action.payload.id) {
        return;
      }

      // Gộp dữ liệu mới từ server vào currentUser
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
      };

      try {
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify(state.currentUser)
        );
      } catch (error) {
        console.error("Failed to persist updated currentUser", error);
      }
    });
  },
});

// ⬇THÊM SELECTOR Ở ĐÂY
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
export const { login, logout, setCurrentUser } = authSlice.actions;