import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api requests to the Spring Boot backend during development.
    // This avoids CORS issues — the browser sees everything as same-origin.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
