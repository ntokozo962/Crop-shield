/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#091B07',
        card: '#7D8E7B',
        background: '#C0CFC5',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}