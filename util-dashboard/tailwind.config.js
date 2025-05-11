/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        normal: 'rgb(var(--color-normal))',
        warning: 'rgb(var(--color-warning))',
        critical: 'rgb(var(--color-critical))',
        fallback: 'rgb(var(--color-fallback))',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 