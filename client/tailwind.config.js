/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
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
    },
  },
  plugins: [require("tailwindcss-animate")],
};
