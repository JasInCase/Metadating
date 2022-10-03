/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,js,ts,tsx}", "./src/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {        
      animation: {
        'pulse-once': 'pulse 1s ease-in-out 1',
        'ping-once': 'ping 1s ease-in-out 0.1',
        'bounce-once': 'bounce 1s ease-in-out 0.5',
      }},
  },
  plugins: [],
}