/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}", // Include all relevant file extensions
    "./public/views/**/*.html", // Include HTML files in the `public/views` directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
