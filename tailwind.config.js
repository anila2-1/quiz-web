/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust if your folders differ
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 5s infinite', // 3s instead of 1s
        'bounce-fast': 'bounce 1s infinite', // faster bounce
      },
    },
  },
  plugins: [],
};
