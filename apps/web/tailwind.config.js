/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#101513",
        moss: "#1f7a5c",
        coral: "#e26655",
        honey: "#e6a93b",
        cloud: "#f7f3ea"
      }
    }
  },
  plugins: []
};
