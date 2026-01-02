/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-pink': '#FF006E',
        'neo-blue': '#3A86FF',
        'neo-yellow': '#FFBE0B',
        'neo-green': '#06FFA5',
        'neo-purple': '#8338EC',
        'neo-black': '#1A1A1A',
        'neo-white': '#FEFEFE',
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}
