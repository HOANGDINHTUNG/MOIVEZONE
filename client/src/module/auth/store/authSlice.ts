import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../database/interface/users";
import { updateUser } from "../../../api/server/User.api";

// Tên state nên viết PascalCase cho dễ đọc
export interface AuthState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
}

// Hàm đọc user từ sessionStorage một cách an toàn, có type
const loadInitialUser = (): IUser | null => {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem("currentUser");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    // ở đây có thể kiểm tra thêm structure, nhưng tạm tin là IUser
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
    // Khi đăng nhập thành công (ở LoginPage đã tìm ra IUser)
    login: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;

      try {
        sessionStorage.setItem("currentUser", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Failed to persist currentUser to sessionStorage", error);
      }
    },

    // Khi logout
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;

      try {
        sessionStorage.removeItem("currentUser");

        // Khớp với LoginPage mới: key ghi nhớ email là moviezone_remember_email
        localStorage.removeItem("moviezone_remember_email");

        // Nếu bạn dùng localStorage token (ở LoginPage), có thể xoá luôn:
        localStorage.removeItem("token");
      } catch (error) {
        console.error("Failed to clear auth storage", error);
      }
    },
  },
  extraReducers: (builder) => {
    // updateUser là một createAsyncThunk được export từ ../../api/User.api
    builder.addCase(updateUser.fulfilled, (state, action) => {
      // Nếu user hiện tại khác id thì không làm gì
      if (!state.currentUser || state.currentUser.id !== action.payload.id) {
        return;
      }

      // Merge dữ liệu mới vào currentUser
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

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
