/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#10141B",
        "background-dark": "#0B0D13",
        primary: "#E11919",
        secondary: "#F97316",
        borderDark: "#1E293B",
      },
      fontFamily: {
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
      },

      // 🔥 Thêm phần này vào chính `extend` đang dùng
      keyframes: {
        "explore-marquee-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "explore-marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "explore-marquee-left": "explore-marquee-left 26s linear infinite",
        "explore-marquee-right": "explore-marquee-right 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
