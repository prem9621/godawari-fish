/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#0066cc',
        aqua: '#00d4ff',
      },
    },
  },
  plugins: [],
}
