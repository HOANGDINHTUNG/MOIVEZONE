// src/types/showtime.ts
export type SeatType = "normal" | "vip" | "doi";
export type SeatStatus = "available" | "booked";

export interface Seat {
  id: string;      // "A1"
  row: string;     // "A"
  number: number;  // 1
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  date: string;        // "2025-04-30"
  startTime: string;   // "18:00"
  endTime: string;     // "19:40"
  room: string;
  basePrice: number;
  seats: Seat[];
}
