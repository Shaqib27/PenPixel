/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",          // Scans all .html files in the root directory
    "./views/**/*.ejs",   // Scans all .ejs files in the 'views' directory and its subdirectories
    "./public/**/*.html", // Example: Scans .html files in a 'public' directory
    "./src/**/*.js",    // Example: If you use Tailwind classes in your JavaScript
    // Add any other paths to your HTML or template files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}