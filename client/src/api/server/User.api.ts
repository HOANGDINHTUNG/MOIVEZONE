// src/api/server/User.api.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreateUserPayload, IUser } from "../../module/auth/database/interface/users";
import { axiosInstance } from "../../utils/axiosIntance";

/**
 * Lấy toàn bộ user từ API ảo (JSON Server, Render,...)
 * GET /users
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  const response = await axiosInstance.get<IUser[]>("users");
  return response.data;
};

/**
 * Tạo user mới trên API ảo
 * POST /users
 * - Backend sẽ lưu vào db.json (nếu là JSON Server) hoặc DB của bạn
 */
export async function createUser(payload: CreateUserPayload): Promise<IUser> {
  const now = new Date().toISOString();

  // JSON server thường tự tăng id, nhưng nếu bạn tự kiểm soát id thì có thể chỉnh thêm
  const userToCreate: Omit<IUser, "id"> = {
    email: payload.email,
    username: payload.username,
    password: payload.password,
    apiKey: payload.apiKey ?? "",
    sessionId: payload.sessionId ?? "",
    accountId: payload.accountId ?? 0,
    favorites: [],
    watchlist: [],
    history: [],
    createdAt: now,
  };

  const res = await axiosInstance.post<IUser>("/users", userToCreate);
  return res.data;
}
/**
 * Tìm user theo email (dùng cho các logic như check trùng email, login,…)
 * -> gọi getAllUsers rồi filter phía client
 */
export const findUserByEmail = async (
  email: string
): Promise<IUser | undefined> => {
  const users = await getAllUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
};

/**
 * Hàm core cập nhật user trực tiếp lên API ảo
 * PATCH /users/:id
 */
const updateUserCore = async (
  payload: Partial<IUser> & { id: number }
): Promise<IUser> => {
  const { id, ...rest } = payload;

  const response = await axiosInstance.patch<IUser>(`users/${id}`, rest);
  return response.data;
};

/**
 * Thunk updateUser dành cho Redux:
 * - authSlice đang import { updateUser } từ file này
 * - và dùng updateUser.fulfilled trong extraReducers
 */
export const updateUser = createAsyncThunk<
  IUser,
  Partial<IUser> & { id: number }
>("users/updateUser", async (payload) => {
  const updated = await updateUserCore(payload);
  return updated;
});

/**
 * Nếu sau này muốn gọi cập nhật user trực tiếp trong component,
 * không cần thông qua Redux, dùng hàm này
 */
export const updateUserDirect = updateUserCore;
