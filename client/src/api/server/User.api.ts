import type { IUser } from "../../module/auth/database/interface/users";

const STORAGE_KEY = "moviezone_users";

/** Đọc danh sách user từ localStorage (an toàn tuyệt đối) */
const readUsers = (): IUser[] => {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed as IUser[];
    }
    return [];
  } catch {
    return [];
  }
};

/** Ghi danh sách user vào localStorage */
const writeUsers = (users: IUser[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

/** Lấy toàn bộ user */
export const getAllUsers = async (): Promise<IUser[]> => {
  return readUsers();
};

/** Tạo user mới */
export const createUser = async (
  payload: Omit<IUser, "id" | "createdAt">
): Promise<IUser> => {
  const users = readUsers();

  const now = new Date().toISOString();

  const newUser: IUser = {
    ...payload,
    id: Date.now(), // id auto
    createdAt: now,
  };

  users.push(newUser);
  writeUsers(users);

  return newUser;
};

/** Tìm user theo email */
export const findUserByEmail = async (
  email: string
): Promise<IUser | undefined> => {
  const users = readUsers();
  return users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
};

/** Cập nhật user — cần để authSlice extraReducers hoạt động */
export const updateUser = async (payload: IUser): Promise<IUser> => {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === payload.id);

  if (index === -1) throw new Error("User not found");

  const updatedUser: IUser = {
    ...users[index],
    ...payload,
  };

  users[index] = updatedUser;
  writeUsers(users);

  return updatedUser;
};
