import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'frontend/app'),
      '@entities': resolve(__dirname, 'frontend/entities'),
      '@features': resolve(__dirname, 'frontend/features'),
      '@pages': resolve(__dirname, 'frontend/pages'),
      '@shared': resolve(__dirname, 'frontend/shared'),
      '@widgets': resolve(__dirname, 'frontend/widgets'),
    },
  },
  plugins: [react()],
})