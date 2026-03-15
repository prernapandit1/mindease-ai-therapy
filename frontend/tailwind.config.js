/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        navy: { DEFAULT: '#0f172a', light: '#1e293b', medium: '#334155' },
        mint: { DEFAULT: '#6ee7b7', light: '#a7f3d0', dark: '#059669' },
        lavender: { DEFAULT: '#c4b5fd', dark: '#7c3aed' },
      },
    },
  },
  plugins: [],
}
