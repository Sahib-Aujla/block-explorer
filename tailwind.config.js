/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: '#4ade80',
        avocado: {
          100: 'var(--color-avocado-100)',
          200: 'var(--color-avocado-200)',
          300: 'var(--color-avocado-300)',
          400: 'var(--color-avocado-400)',
          500: 'var(--color-avocado-500)',
          600: 'var(--color-avocado-600)',
        },
      },
    },
  },
  plugins: [],
}