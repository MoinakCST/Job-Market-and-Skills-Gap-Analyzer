import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sassEmbedded from 'sass-embedded'

export default defineConfig({
  plugins: [react()],

  css: {
    preprocessorOptions: {
      scss: {
        implementation: sassEmbedded,
      },
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})