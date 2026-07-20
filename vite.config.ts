import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is applied in dev too, so set it only for the GitHub Pages build to keep
// npm run dev serving at the root URL. Keyed on mode rather than command so
// vite preview (command 'serve', mode 'production') also serves under the base.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/modplayer/' : '/',
  plugins: [react()],
}))
