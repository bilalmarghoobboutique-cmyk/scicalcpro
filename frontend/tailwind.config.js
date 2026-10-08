/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./age-calculator.html",
    "./profit-calculator.html",
    "./area-calculator.html",
    "./time-calculator.html",
    "./engineering-calculator.html",
    "./gold-silver-calculator.html",
    "./blog/index.html",
    "./blog/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        gold: {
          primary: '#FFD700',
          light: '#FFED4E',
          dark: '#B8860B',
          deep: '#8B6914',
        },
        silver: {
          primary: '#C0C0C0',
          light: '#E8E8E8',
          dark: '#808080',
        },
      },
      animation: {
        'gold-pulse': 'goldPulse 3s ease-in-out infinite',
        'gold-rotate': 'goldRotate 20s linear infinite',
        'gold-shine': 'goldShine 3s infinite',
      },
      keyframes: {
        goldPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.9))' },
        },
        goldRotate: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        goldShine: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(255, 215, 0, 0)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}