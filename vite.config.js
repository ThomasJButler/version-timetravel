import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // Important: Set base to your repo name for GitHub Pages
  base: '/version-timetravel/',
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