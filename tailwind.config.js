/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        red: {
          50: '#fff5f5',
          100: '#ffe6e6',
          200: '#ffcccc',
          300: '#ff9999',
          400: '#ff6666',
          500: '#ff4444',
          600: '#e63e3e',
          700: '#cc3535',
          800: '#b32d2d',
          900: '#992525',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'achievement-pop': 'achievement-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'confetti-fall': 'confetti-fall 3s linear forwards',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'achievement-pop': {
          '0%': { transform: 'scale(0.5) translateY(50px)', opacity: 0 },
          '100%': { transform: 'scale(1) translateY(0)', opacity: 1 },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}