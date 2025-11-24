// src/types/user.ts
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  totalTickets:number;
  createdAt: string;
  status: "active" | "blocked";
}
