import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: https://yesthank.github.io/esc_7/
// https://vite.dev/config/
export default defineConfig({
  base: '/esc_7/',
  plugins: [react()],
})
