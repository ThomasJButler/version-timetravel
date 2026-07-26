import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'

const BASE = '/version-timetravel/'

/**
 * GitHub Pages honours exactly one 404.html, at the root of the artifact. A plain copy of
 * index.html would therefore boot the whole app inside any archived snapshot's iframe the
 * moment a visitor clicks one of that snapshot's dead links. So the fallback checks whether
 * it is framed before deciding what to render.
 */
function pagesFallback() {
  return {
    name: 'pages-404-fallback',
    closeBundle() {
      const shell = readFileSync('dist/index.html', 'utf8')
      const framed = shell.replace(
        '<div id="root"></div>',
        `<div id="root"></div>
    <script>
      if (window.self !== window.top) {
        var wrap = document.createElement('div');
        wrap.setAttribute('style', 'font:12px ui-monospace,monospace;text-align:center;color:#7C857D');
        var head = document.createElement('p');
        head.textContent = 'ARCHIVED PAGE NOT FOUND';
        head.setAttribute('style', 'letter-spacing:.1em;margin:0 0 8px');
        var body = document.createElement('p');
        body.textContent = 'This page was never part of the captured version.';
        body.setAttribute('style', 'color:#4c534d;margin:0');
        wrap.append(head, body);
        document.body.setAttribute('style', 'margin:0;background:#0E100E;display:grid;place-items:center;height:100vh');
        document.body.replaceChildren(wrap);
        throw new Error('framed 404: SPA boot suppressed');
      }
    </script>`,
      )
      writeFileSync('dist/404.html', framed)

      // Legacy deep links: viewer.html?version=<file>&id=&num=&date= must keep resolving.
      copyFileSync('viewer.html', 'dist/viewer.html')
    },
  }
}

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), pagesFallback()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { port: 3000 },
})
