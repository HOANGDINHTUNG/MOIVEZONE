// src/types/ticket.ts
export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderSummary {
  movieId: string;
  showtimeId: string;
  seatIds: string[];
  totalAmount: number;
  customer: CustomerInfo;
  createdAt: string; // ISO string
}
