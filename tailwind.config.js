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
          accent: '#c8d400',
          'accent-dim': '#8a9200',
          cyan: '#00aaff',
          text: '#dddddd',
          muted: '#666666',
          active: '#2a2a00',
        },
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
