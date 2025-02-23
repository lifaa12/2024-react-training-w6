import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ?
    "/2024-react-training-w6/" : "/",
  plugins: [react()],
})
