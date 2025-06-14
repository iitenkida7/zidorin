import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/zidorin/' : './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8000,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
})