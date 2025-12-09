import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  IUser,
  CreateUserPayload,
} from "../../module/auth/database/interface/users";
import { axiosInstance } from "../../utils/axiosIntance";

export const getAllUsers = async (): Promise<IUser[]> => {
  const response = await axiosInstance.get<IUser[]>("users");
  return response.data;
};

export const createUser = async (
  payload: CreateUserPayload
): Promise<IUser> => {
  const now = new Date().toISOString();

  const body: Omit<IUser, "id"> = {
    email: payload.email,
    username: payload.username,
    password: payload.password,

    apiKey: payload.apiKey ?? "",
    sessionId: payload.sessionId ?? "",
    accountId: payload.accountId ?? 0,

    // App data
    favorites: [],
    watchlist: [],
    history: [],

    createdAt: now,
  };

  const response = await axiosInstance.post<IUser>("users", body);
  return response.data;
};

export const findUserByEmail = async (
  email: string
): Promise<IUser | undefined> => {
  const users = await getAllUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
};

const updateUserCore = async (
  payload: Partial<IUser> & { id: number }
): Promise<IUser> => {
  const { id, ...rest } = payload;
  const response = await axiosInstance.patch<IUser>(`users/${id}`, rest);
  return response.data;
};

export const updateUser = createAsyncThunk<
  IUser,
  Partial<IUser> & { id: number }
>("users/updateUser", async (payload) => {
  const updated = await updateUserCore(payload);
  return updated;
});

export const updateUserDirect = updateUserCore;
