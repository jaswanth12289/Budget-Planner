/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          text: '#ffffff',
          accent: '#A9B5DF', // Dynamic dynamic accent from current trends
        },
        light: {
          bg: '#f3f4f6',
          card: '#ffffff',
          text: '#1f2937',
          accent: '#4f46e5',
        }
      }
    },
  },
  plugins: [],
}
