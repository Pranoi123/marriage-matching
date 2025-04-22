/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#FF4D4D',
        'custom-pink': '#FF99CC',
        'custom-white': '#FFFFFF',
        'light-pink': '#FFE6F0',
      },
    },
  },
  plugins: [],
}