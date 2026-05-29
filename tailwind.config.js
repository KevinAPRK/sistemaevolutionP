/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        golden: '#dbac43',
        darkGray: '#414242',
        lightGray: '#c9c8c6',
      }
    },
  },
  plugins: [],
}