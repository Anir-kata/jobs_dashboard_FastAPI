/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{jsx,js}',
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#4285f4',
          red: '#ea4335',
          yellow: '#fbbc04',
          green: '#34a853',
        }
      }
    },
  },
  plugins: [],
}
