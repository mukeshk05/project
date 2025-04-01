/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316', // orange-500
          hover: '#ea580c', // orange-600
        },
        secondary: {
          DEFAULT: '#22c55e', // green-500
          hover: '#16a34a', // green-600
        }
      }
    },
  },
  plugins: [],
};