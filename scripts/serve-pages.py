#!/usr/bin/env python3
"""Serve dist/ the way GitHub Pages does, for local verification.

Neither `vite preview` nor `python3 -m http.server` matches Pages:

  - vite preview has appType 'spa', so it serves index.html for EVERY missing path. That
    masks exactly the 404s worth checking, and makes a broken archive look fine.
  - plain http.server returns a bare 404 with no body, so SPA deep links appear broken
    when on Pages they would work.

Pages does neither: for an unknown path it returns HTTP 404 with the body of the single
root 404.html, without redirecting, so the URL is preserved and a client router can boot.

Usage:  python3 scripts/serve-pages.py [port]
Then:   http://127.0.0.1:4500/version-timetravel/
"""

import functools
import http.server
import os
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
BASE = '/version-timetravel/'


class PagesHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Everything is mounted under the Pages base path.
        clean = path.split('?', 1)[0].split('#', 1)[0]
        if clean.startswith(BASE):
            clean = clean[len(BASE) - 1 :]
        elif clean == BASE.rstrip('/'):
            clean = '/'
        return str(DIST) + os.path.normpath(clean)

    def send_error(self, code, message=None, explain=None):
        fallback = DIST / '404.html'
        if code == 404 and fallback.exists():
            body = fallback.read_bytes()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):
        if '404' in (args[1] if len(args) > 1 else ''):
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4500
    if not DIST.exists():
        sys.exit('dist/ not found. Run `npm run build` first.')
    handler = functools.partial(PagesHandler, directory=str(DIST))
    with http.server.ThreadingHTTPServer(('127.0.0.1', port), handler) as httpd:
        print(f'Pages-like server on http://127.0.0.1:{port}{BASE}')
        httpd.serve_forever()


if __name__ == '__main__':
    main()
