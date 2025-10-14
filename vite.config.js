import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
     tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision']
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'mediapipe': ['@mediapipe/tasks-vision']
        }
      }
    }
  }
})