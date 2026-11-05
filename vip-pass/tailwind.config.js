/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        d2p: {
          obsidian: '#050B08',
          night: '#0A1510',
          emerald: '#0F3828',
          emeraldLight: '#10B981',
          gold: '#D4AF37',
          goldBright: '#F5C542',
          goldDeep: '#9A7418',
        }
      },
      fontFamily: {
        display: ['Syne', 'Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
