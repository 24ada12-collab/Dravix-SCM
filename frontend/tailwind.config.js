/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dravix: {
          bg: '#E8F5E9',
          light: '#A5D6A7',
          primary: '#66BB6A',
          dark: '#1B5E20',
          darkHover: '#144618',
        },
        // Semantic color mapping as required
        background: '#E8F5E9',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#66BB6A',
          dark: '#1B5E20',
          hover: '#529e56',
        },
        secondary: {
          DEFAULT: '#A5D6A7',
          light: '#C8E6C9',
        },
        brand: {
          dark: '#1B5E20',
        },
        text: {
          primary: '#1B5E20',
          secondary: '#2E7D32',
          muted: '#4A5568',
        },
        border: {
          light: '#C8E6C9',
          DEFAULT: '#A5D6A7',
          dark: '#1B5E20',
        }
      },
    },
  },
  plugins: [],
}
