/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: '#1a1a1a',
          panel: '#222222',
          dark: '#111111',
          border: '#444444',
          accent: '#32cd32',
          'accent-dim': '#228b22',
          cyan: '#00aaff',
          text: '#dddddd',
          muted: '#666666',
          active: '#0a2a0a',
        },
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
