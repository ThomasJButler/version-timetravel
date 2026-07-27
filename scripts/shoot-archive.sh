#!/usr/bin/env bash
#
# Capture a vendored archive at the exact sizes the plate expects.
#
#   python3 scripts/serve-pages.py &          # must be running
#   ./scripts/shoot-archive.sh v3.5
#
# Writes public/shots/<id>-desktop.jpg (1440x900) and <id>-mobile.jpg (390x845).
#
# Preferred over cropping a supplied full-page capture: those start at arbitrary offsets, so
# a fixed crop slices them mid-sentence. Shooting the archive frames every version
# identically, which is what makes the contact sheet read as one strip rather than ten
# different croppings. Only works for a version that is actually vendored; screenshots-only
# versions keep their supplied captures, cropped with prepare-shots.sh.
#
# Uses headless Chrome and sips, both already on the machine. Deliberately no npm
# dependency: adding Playwright here would make every Pages deploy download browsers.

set -euo pipefail

if [ $# -lt 1 ]; then
  sed -n '3,16p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
fi

ID="$1"
BASE="${BASE:-http://127.0.0.1:4500/version-timetravel/}"
URL="${BASE}archive/${ID}/index.html"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME" >&2; exit 1; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/shots"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

curl -sf -o /dev/null "$URL" || { echo "not served: $URL (is serve-pages.py running?)" >&2; exit 1; }

shoot() {
  local name="$1" w="$2" h="$3" target="$4"
  # virtual-time-budget fast-forwards the clock so lazy route chunks and entrance
  # animations settle before the frame is taken.
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=2 \
    --window-size="${w},${h}" \
    --virtual-time-budget=8000 \
    --screenshot="$TMP/$name.png" \
    "$URL" >/dev/null 2>&1

  [ -s "$TMP/$name.png" ] || { echo "capture failed: $name" >&2; exit 1; }
  # Shot at 2x for sharpness, then resampled down: the desktop plate renders around 1000px
  # wide and the mobile thumb around 132px, so the full 2x frame is far more than either
  # needs and would put megabytes in the repo for nothing.
  sips --resampleWidth "$target" "$TMP/$name.png" --out "$TMP/$name-r.png" >/dev/null
  sips -s format jpeg -s formatOptions 82 "$TMP/$name-r.png" --out "$OUT/$ID-$name.jpg" >/dev/null
  printf '  %-28s %s  %s\n' "$ID-$name.jpg" \
    "$(sips -g pixelWidth -g pixelHeight "$OUT/$ID-$name.jpg" | awk '/pixel/{printf "%sx", $2}' | sed 's/x$//')" \
    "$(du -h "$OUT/$ID-$name.jpg" | cut -f1)"
}

shoot desktop 1440 900 2000
shoot mobile 390 845 470
