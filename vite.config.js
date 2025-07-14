import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        viewer: path.resolve(__dirname, 'viewer.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})