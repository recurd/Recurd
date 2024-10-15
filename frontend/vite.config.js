import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "src",
  server: {
    port: 8080
  },
  envDir: "../" // since source file is under /src, .env would need to ne in /src, but we put it in /frontend for symmetricity
})