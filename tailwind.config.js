/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFE4E1',
        'pastel-blue': '#E6F3FF',
        'pastel-yellow': '#FFFACD',
        'pastel-purple': '#F0E6FF',
        'pastel-green': '#E6FFE6',
      },
      fontFamily: {
        'cute': ['"M PLUS Rounded 1c"', 'sans-serif'],
      },
      animation: {
        'sparkle': 'sparkle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}