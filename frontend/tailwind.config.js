/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16a34a',
        primaryLight: '#22c55e',
        primaryDark: '#15803d',
        accent: '#4ade80',
      },
    },
  },
  plugins: [],
}
