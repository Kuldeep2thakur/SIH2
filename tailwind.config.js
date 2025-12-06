/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        ayush: {
          50: '#fef3e2',
          100: '#fde8c5',
          200: '#fbcf8b',
          300: '#f9b652',
          400: '#f79d18',
          500: '#dd8000',
          600: '#b46600',
          700: '#8b4d00',
          800: '#623300',
          900: '#3a1a00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
