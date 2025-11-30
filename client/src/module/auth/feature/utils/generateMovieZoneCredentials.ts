// src/auth/utils/generateMovieZoneCredentials.ts

// Tạo chuỗi random gồm chữ thường + số
const randomString = (length: number): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }
  return result;
};

export const generateMovieZoneCredentials = () => {
  const apiKey = `mvk_${randomString(32)}`; // MovieZone API key
  const sessionId = `mvs_${randomString(40)}`; // MovieZone session
  const accountId = Date.now(); // dùng timestamp cho đơn giản

  return { apiKey, sessionId, accountId };
};
