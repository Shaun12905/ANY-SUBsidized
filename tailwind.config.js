/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Syne"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'body': ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        'cyber-dark': '#020408',
        'cyber-card': '#0a0f1a',
        'cyber-border': '#1a2035',
      },
      keyframes: {
        'price-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        'price-out': {
          '0%': { opacity: '1', transform: 'translateY(0px)' },
          '100%': { opacity: '0', transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0px)' },
        },
        'swap-drop': {
          '0%': { opacity: '0', transform: 'translateY(-10px)', maxHeight: '0px' },
          '100%': { opacity: '1', transform: 'translateY(0px)', maxHeight: '200px' },
        },
        'counter-tick': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      },
      animation: {
        'price-in': 'price-in 0.4s ease forwards',
        'price-out': 'price-out 0.4s ease forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-ring': 'pulse-ring 1.2s ease-out infinite',
        'modal-in': 'modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'swap-drop': 'swap-drop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'counter-tick': 'counter-tick 0.25s ease forwards',
        'scanline': 'scanline 8s linear infinite',
      },
    },
  },
  plugins: [],
}
