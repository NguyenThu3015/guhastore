// Nằm trong: guhastore-ui/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Đảm bảo đường dẫn này là chính xác
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}