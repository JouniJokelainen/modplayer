import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is applied in dev too, so set it only for the GitHub Pages build to keep
// npm run dev serving at the root URL.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/modplayer/' : '/',
  plugins: [react()],
}))
