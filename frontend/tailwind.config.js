/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy — the brand primary. Derived from #1e3a5f with lighter/darker stops.
        navy: {
          50:  '#f0f4f9',
          100: '#dae4f0',
          200: '#b5c9e2',
          300: '#8faed3',
          400: '#6a93c5',
          500: '#4578b6',
          600: '#2d5f99',
          700: '#1e3a5f',
          800: '#163052',
          900: '#0e2245',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
      },
    },
  },
  plugins: [],
}
