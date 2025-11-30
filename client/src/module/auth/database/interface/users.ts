// src/utils/interface/Users.ts

export interface IUser {
  id: number;
  email: string;
  username: string;
  password: string;

  // Các trường phục vụ MovieZone Account
  apiKey: string;
  sessionId: string;
  accountId: number;

  createdAt: string;
}